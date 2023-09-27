import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient

export async function GET() {
  try {
    //seleciona um arquivo disponível para marcação de questões
    const page = await prisma.page.findFirst({
      where: {
        marking: false,
        // marked: false
      }
    })

    await prisma.page.update({
      where: {
        id: page.id
      },
      data: {
        marking: true,
      }
    })
    
    return NextResponse.json({page})
  } catch (e) {
    return new NextResponse("Erro ao buscar arquivo: " + e, {status: 400})
  }
}
