import { NextResponse } from 'next/server';
import prisma from "@/services/database/prisma";

export async function GET() {
  try {
    //seleciona um arquivo disponível para marcação de questões
    const page = await prisma.$transaction(async (tx) => {
      const page = await tx.page.findFirst({
        where: {
          marking: false,
          marked: false
        }
      })

      //marca o arquivo como em marcação, caso encontre algum disponivel
      if(page){
        await tx.page.update({
          where: {
            id: page.id
          },
          data: {
            marking: true,
          }
        })
      }

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
