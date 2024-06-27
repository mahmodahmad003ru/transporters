import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import itemRoutes from "./routes/itemRoutes";
import moverRoutes from "./routes/moverRoutes";
import { setupSwagger } from "./swagger";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(requestLogger);
app.use("/movers", moverRoutes);
app.use("/items", itemRoutes);
setupSwagger(app);

app.use(errorHandler);

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
