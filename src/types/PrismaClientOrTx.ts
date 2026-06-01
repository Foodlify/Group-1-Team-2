import { Prisma ,PrismaClient} from "@prisma/client";

export type DBClient =
  Prisma.TransactionClient | PrismaClient;