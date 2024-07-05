const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.prisma = new PrismaClient({
  log: ["query"],
});

async function  connectPostgresql() {
  try {
    await prisma.$connect();
    console.log("🚀 Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }finally{
    prisma.$disconnect();
  }
}

module.exports.connectPostgresql = connectPostgresql;
