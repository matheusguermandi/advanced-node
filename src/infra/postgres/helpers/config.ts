import { ConnectionOptions } from "typeorm";

export const config: ConnectionOptions = {
  type: "postgres",
  host: "motty.db.elephantsql.com",
  port: 5432,
  username: "wfkbknoa",
  password: "rTFjnRXzgVil2SNdjhexFaxLn81UMfri",
  database: "wfkbknoa",
  entities: ["dist/infra/postgres/entities/index.js"],
};
