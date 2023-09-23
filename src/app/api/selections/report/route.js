import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient

export async function GET() {
  try {
    //seleciona um arquivo disponível para seleção de
    //páginas
    const report = await prisma.report.findFirst({
      where: {
        avaiable: true, 
        selecting: false,
        // metadatas: {isEmpty: true}
      }
    })

    await prisma.report.update({
      where: {
        id: report.id
      },
      data: {
        selecting: true,
      }
    })
    
    return NextResponse.json({report})
  } catch (e) {
    return new NextResponse("Erro ao buscar arquivo: " + e, {status: 400})
  }
}
