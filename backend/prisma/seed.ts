import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    name: 'System Admin',
    email: 'admin@oamanagement.com',
    password: '123',
    role: 'ADMIN',
  },
  {
    name: 'Alice Mensah',
    email: 'alice@assetcore.com',
    password: 'password123',
    role: 'ADMIN',
  },
  {
    name: 'Bob Nkosi',
    email: 'bob@assetcore.com',
    password: 'password123',
    role: 'STAFF',
  },
  {
    name: 'James Okafor',
    email: 'james@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
  },
  {
    name: 'Eva Osei',
    email: 'eva@assetcore.com',
    password: 'password123',
    role: 'STAFF',
  },
];

async function main() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

  console.log('Seeded users');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
