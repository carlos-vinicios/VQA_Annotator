import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
export async function POST(request) {
  const data = await request.json()

  if(!data.email || !data.token) {
    return new NextResponse("Email e token são obrigatários.", { status: 400 })
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if(exist) {
    return new NextResponse("Usuário já cadastrado.", { status: 400 })
  }
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      token: data.token
    }
  });

  return new NextResponse(JSON.stringify(user))
}
