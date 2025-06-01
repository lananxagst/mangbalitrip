import { PrismaClient } from '../generated/prisma';

// Correct global declaration for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Connection pool configuration untuk mengatasi prepared statement errors
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  });
};

// Menggunakan var global untuk mencegah multiple instances selama hot reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  console.log('PrismaClient initialized in development mode with connection limit');
} else {
  console.log('PrismaClient initialized in production mode');
}

export default prisma;