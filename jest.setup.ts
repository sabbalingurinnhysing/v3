import { PrismaClient } from "@prisma/client";
import { beforeAll, afterAll, beforeEach } from "@jest/globals";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  // Clears all tables before every test to ensure clean test runs
  await prisma.categories.deleteMany();
  await prisma.questions.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
