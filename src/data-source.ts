import "reflect-metadata";
import { DataSource } from "typeorm";

import dotenv from "dotenv";
import { MagicItem } from "./entity/magicItem";
import { MagicMover } from "./entity/magicMover";

dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "transporters",
  password: process.env.DB_PASSWORD || "transporters",
  database: process.env.DB_NAME || "transporters",
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
  entities: [MagicMover, MagicItem],
  migrations: [],
  subscribers: [],
});
