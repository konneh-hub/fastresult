import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Result } from "./entities/Result";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "resultapp",
  synchronize: false, // use migrations
  logging: false,
  entities: [User, Result],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
