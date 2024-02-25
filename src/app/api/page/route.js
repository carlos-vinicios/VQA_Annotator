import { NextResponse } from "next/server";
import prisma from "@/services/database/prisma";

//adicionando uma página para seleção e marcação ao MongoDB
export async function POST(request) {
  try {
    //lendo os metadados enviados
    const data = await request.json();
    
    const page = await prisma.page.findFirst({
      where: {
        filename: data.filename
      }
    });

    if(page){
      return new NextResponse("Arquivo já existe.", {status: 400})
    }

    //buscando o report ao qual a página pertence
    const report = await prisma.report.findFirst({
      where: {
        id: data.reportId
      }
    })

    if(!report){
      return new NextResponse("Relatário não encontrado.", {status: 400})
    }

    //adiciona a informação do report
    let pageData = {...data, report:  {
      connect: { id: report.id }, // or `connectOrCreate` if it doesn't exist
    }}
    delete pageData.reportId
      
    //insere os dados da página na base
    await prisma.page.create({
      data: pageData
    })
    
    return new NextResponse("Dados inseridos com sucesso.")
  } catch (e) {
    return new NextResponse("Erro ao inserir página:"+e, {status: 400})
  }
}