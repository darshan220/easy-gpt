import { config } from "dotenv";

config();

export const ENVIRONMENT = {
  PRODUCTION: "production",
  TEST: "test",
  DEVELOPMENT: "development",
  LOCAL: "local",
};

export function getOsEnv(key: string): string {
  if (typeof process.env[key] === "undefined") {
    throw Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key];
}

// To Retrieve Env variable which might undefined
export function getOsEnvOptional(key: string): string | undefined {
  return process.env[key];
}
