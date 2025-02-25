import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL: string | undefined = process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida! Verifique o arquivo .env.");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

export default prisma;
