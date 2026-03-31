import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const email = 'cpapanal75@gmail.com';
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
      });
      return NextResponse.json({ 
        success: true, 
        message: `Successfully updated ${updated.username} (${email}) to admin in production database. You may need to log out and log back in.` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `User ${email} not found in the database. Please make sure you have created an account first.` 
      }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
