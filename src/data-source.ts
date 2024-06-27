import "reflect-metadata";
import { DataSource } from "typeorm";

import dotenv from "dotenv";
import { MagicItem } from "./entity/magicItem";
import { MagicMover } from "./entity/magicMover";
import path from "path";
const envFilePath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFilePath });

export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
  entities: [MagicMover, MagicItem],
  migrations: [],
  subscribers: [],
});
