import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("database url is not set .did you create a .env file ?");
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL,
};
