import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'samsonbalogun95@gmail.com'
  
  // First check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })
  
  if (existingUser) {
    console.log(`User found: ${existingUser.username}. Updating to admin...`)
    const updated = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    })
    console.log('Successfully updated to admin:', updated.username, updated.role)
  } else {
    console.log(`User ${email} not found in database. Please log in first to create an account.`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
