import { Client } from "pg";
//   postgresql://neondb_owner:npg_jteOPxrqN8Q0@ep-bold-pond-a8onup0r-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "chatgpt",
  password: "Sitaram@227",
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to Postgres!'))
  .catch(err => console.error('Connection error', err.stack));
  
export default client;
