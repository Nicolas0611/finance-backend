// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      categories: {
        create: [
          {
            id: "1",
            name: "Food",
          },
          {
            id: "2",
            name: "Transportation",
          },
          {
            id: "3",
            name: "Housing",
          },
        ],
      },
      transactions: {
        create: [
          {
            amount: 100,
            categoryId: "1",
            description: "Salary",
          },
        ],
      },
    },
  });

  console.log(`✅ Created admin: ${admin.email}`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
