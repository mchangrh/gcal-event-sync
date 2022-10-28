// External Dependencies
import * as mongoDB from "mongodb";
import { mongo_url } from "../config.json";
import { Logger } from "../utils/logger";

// Global Variables
export const collections: {
  guilds?: mongoDB.Collection;
  events?: mongoDB.Collection;
} = {};

// Initialize Connection
export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongo_url);
  await client.connect();
  const db: mongoDB.Db = client.db("gces");
  collections.guilds = db.collection("guilds");
  collections.events = db.collection("events");

  Logger.info(`Successfully connected to database: ${db.databaseName}`);
}
