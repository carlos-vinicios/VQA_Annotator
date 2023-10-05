import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    //seleciona um arquivo disponível para seleção de páginas
    const response = await prisma.$transaction(
      async (tx) => {
        const report = await tx.report.findFirst({
          where: {
            avaiable: true,
            selecting: false,
            metadatas: { isEmpty: true },
          },
        });

        if(report){
          await tx.report.update({
            where: {
              id: report.id,
            },
            data: {
              selecting: true,
            },
          });
        }

        return report;
      },
      {
        retry: 5,
      }
    );

    if(!response){
      return new NextResponse("Não há arquivos disponíveis para seleção.", {status: 201})
    }

    return NextResponse.json(response);
  } catch (e) {
    return new NextResponse("Erro ao buscar arquivo: " + e, { status: 400 });
  }
}
