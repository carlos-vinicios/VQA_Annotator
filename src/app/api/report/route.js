import { NextResponse } from "next/server";
import prisma from "@/services/database/prisma";

//adiciona um novo report na base de dados
export async function POST(request) {
  try {
    //lendo os metadados enviados
    const data = await request.json();

    const report = await prisma.report.findFirst({
      where: {
        ticker: data.ticker,
        filename: data.filename
      }
    });

    if(report){
      return new NextResponse("Arquivo já existe", {status: 400})
    }

    //insere os dados do documento na base
    await prisma.report.create({
      data: data
    })

    return new NextResponse("Dados inseridos com sucesso.")
  } catch (e) {
    return new NextResponse("Erro ao inserir os dados.", {status: 400})
  }
}