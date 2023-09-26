import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  //inserindo as questões anotadas
  try{
    const data = await request.json()
    
    let questionsList = []
    data.questions.forEach(async (question) => {
      questionsList.push({
        pageId: data.pageId,
        ...question,
      })
    })

    const r = await prisma.question.createMany({
      data: questionsList
    })

    return new NextResponse("Questões inseridas com sucesso")
  } catch (e) {
    return new NextResponse(
      "Erro ao atualizar o arquivo: " + e, 
      {status: 400}
    )
  }
}

export async function GET() {
  try {
    
    const page = await prisma.question.findFirst({
      where: {
        validating: false
      }
    })
    
    return NextResponse.json({ question: page.questions[questionId] });
  } catch (e) {
    return new NextResponse("Erro ao buscar questão: " + e, { status: 400 });
  }
}