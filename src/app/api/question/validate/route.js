import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  //inserindo a validação das questões
  try {
    const data = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email: data.validator,
      }
    })

    const r = await prisma.question.update({
      where: {
        id: data.questionId,
      },
      data: {
        validatorId: user.id,
        validating: false,
        validation: {
          response: data.response,
          validationElapsedTime: data.validationElapsedTime
        }
      },
    });

    if (r.modifiedCount === 0) {
      throw new Error("A questão não foi encontrada.")
    }

    return new NextResponse("Validação inserida com sucesso");
  } catch (e) {
    return new NextResponse("Erro ao atualizar o arquivo: " + e, {
      status: 400,
    });
  }
}
