import { ENVIRONMENT, getOsEnv } from "./env.config";

export const appConfig = {
  port: +getOsEnv("PORT"),
//   isProduction: getOsEnv("NODE_ENV") === ENVIRONMENT.PRODUCTION,
//   isLocal: getOsEnv("NODE_ENV") === ENVIRONMENT.LOCAL,
  groqConfig: {
    apiKey: getOsEnv("GROQ_API_KEY"),
    apiUrl: getOsEnv("GROQ_API_URL"),
  },
  jwtSecret: getOsEnv("JWT_SECRET"),
  openaiConfig: getOsEnv("OPENAI_API_KEY"),
  corsOrigin: getOsEnv("CORS_ORIGIN"),
};
