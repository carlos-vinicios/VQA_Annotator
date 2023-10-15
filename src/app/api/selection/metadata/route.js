import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {  
    //lendo os metadados enviados
    const data = await request.json()
    console.log(data.metadatas.length)
    //atualiza o status de seleção e insere os metadados
    const r = await prisma.report.update({
      where: {
        id: data.file_id
      },
      data: {
        selecting: false,
        metadatas: data.metadatas,
      }
    })

    //lança um erro caso nenhum arquivo tenha sido atualizado
    if (r.modifiedCount === 0) {
      throw new Error("O arquivo não foi encontrado.")
    }
    
    return new NextResponse("Metadados inseridos com sucesso")
  } catch (e) {
    return new NextResponse(
      "Erro ao atualizar o arquivo: " + e, 
      {status: 400}
    )
  }
}