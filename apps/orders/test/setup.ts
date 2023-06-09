import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

jest.mock(
  "../src/events/nats-context.ts",
  () => jest.requireActual("./mocks/nats-context.ts")
);

beforeAll(async () => {
  process.env.JWT_KEY = "JWT_KEY";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongo?.stop();
  await mongoose.connection.close();
});
