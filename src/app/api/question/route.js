import { NextResponse } from "next/server";
import prisma from "@/services/database/prisma";

export async function POST(request) {
  //inserindo as questões anotadas
  try {
    const data = await request.json();

    let questionsList = [];
    data.questions.forEach(async (question) => {
      questionsList.push({
        pageId: data.pageId,
        ...question,
      });
    });

    await prisma.question.createMany({
      data: questionsList,
    });

    return new NextResponse("Questões inseridas com sucesso");
  } catch (e) {
    return new NextResponse("Erro ao atualizar o arquivo: " + e, {
      status: 400,
    });
  }
}

export async function GET() {
  try {
    const question = await prisma.$transaction(
      async (tx) => {
        const question = await tx.question.findFirst({
          where: {
            validating: false,
            validation: null,
          },
        });

        //se encontrar a questão, atualiza a validação para true
        //e retorna a mesma
        if(question){
          await tx.question.update({
            where: {
              id: question.id,
            },
            data: {
              validating: true,
            },
          });
        }

        return question;
      },
      { retry: 5 }
    );
    
    if (!question) {
      return new NextResponse("Não há questões para validar", {status: 200})
    }

    //procura a página que a questão pertence
    const page = await prisma.page.findUnique({
      where: {
        id: question.pageId
      }
    });

    return NextResponse.json({
      ...question, 
      pageFilename: page.filename
    });
  } catch (e) {
    return new NextResponse("Erro ao buscar questão: " + e, { status: 400 });
  }
}
