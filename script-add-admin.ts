import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'cpapanal75@gmail.com';
  
  // Try to find the user first
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    console.log(`\n\n--- ERROR ---`);
    console.log(`User with email ${email} DOES NOT EXIST yet.`);
    console.log(`Please ask the user to register an account first, then we can upgrade them to admin.`);
    console.log(`---------------\n\n`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  });

  console.log(`\n\n--- SUCCESS ---`);
  console.log(`Successfully made ${updatedUser.email} an admin!`);
  console.log(`---------------\n\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
