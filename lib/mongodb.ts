import { MongoClient, Db, Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "necesse";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getBuildsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection("builds");
}

export async function saveBuild(build: {
  id: string;
  weapon: string;
  trinket: string;
  armor: string;
  createdAt: string;
}) {
  const collection = await getBuildsCollection();
  await collection.insertOne(build);
  return build;
}

export async function getBuild(id: string) {
  const collection = await getBuildsCollection();
  const build = await collection.findOne({ id });
  return build;
}
