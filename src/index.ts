import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import itemRoutes from "./routes/itemRoutes";
import moverRoutes from "./routes/moverRoutes";
import { setupSwagger } from "./swagger";
import path from "path";
import dotenv from "dotenv";

// test again if env loaded correctly
const envFilePath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFilePath });

const app = express();
const PORT = process?.env?.port || 3000;

app.use(bodyParser.json());
app.use(requestLogger);
app.use("/movers", moverRoutes);
app.use("/items", itemRoutes);
setupSwagger(app);

app.use(errorHandler);

// make the port from env
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `API documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => console.log(error));
