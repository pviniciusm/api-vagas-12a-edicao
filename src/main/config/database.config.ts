import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();

let config: DataSourceOptions;

if (process.env.NODE_ENV === "test") {
  // config banco de testes
  config = {
    type: "postgres",
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
    migrations: ["src/app/shared/database/migrations/**/*.ts"],
    entities: ["src/app/shared/database/entities/**/*.ts"],
    schema: "vagas",
  };
} else {
  // config banco de producão/dev
  config = {
    type: "postgres",
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
    migrations: ["src/app/shared/database/migrations/**/*.ts"],
    entities: ["src/app/shared/database/entities/**/*.ts"],
    schema: "vagas",
  };
}

export default new DataSource(config);
