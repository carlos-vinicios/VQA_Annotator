import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  //lendo os metadados enviados
  try{
    const data = await request.json()
    
    const user = await prisma.user.findUnique({
      where: {
        email: data.annotator
      }
    });

    let newPageData = {...data}
    delete newPageData.pageId
    delete newPageData.annotator
    newPageData["annotatorId"] = user.id
    
    const r = await prisma.page.update({
      where: {
        id: data.pageId
      },
      data: newPageData
    })
    
    //lança um erro caso nenhum arquivo tenha sido atualizado
    if (r.modifiedCount === 0) {
      throw new Error("O arquivo não foi encontrado.")
    }

    return new NextResponse("Anotações inseridas com sucesso")
  } catch (e) {
    return new NextResponse(
      "Erro ao atualizar o arquivo: " + e, 
      {status: 400}
    )
  }
}
