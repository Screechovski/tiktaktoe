import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";

export const DBInstance = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [UserEntity],
});
