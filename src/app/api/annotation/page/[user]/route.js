import { NextResponse } from 'next/server';
import prisma from "@/services/database/prisma";

export async function GET(request, {params}) {
  try {
    //seleciona um arquivo disponível para marcação de questões
    const page = await prisma.$transaction(async (tx) => {
      const page = await tx.pageTest.findFirst({
        where: {
          annotated: false,
          user: params.user
        }
      })

      return page
    })
    
    if(!page){
      return new NextResponse("Não há arquivos disponíveis para marcação.", {status: 201})
    }

    return NextResponse.json(page)
  } catch (e) {
    return new NextResponse("Erro ao buscar arquivo: " + e, {status: 400})
  }
}
