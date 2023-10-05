import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  //lendo os metadados enviados
  try {
    const data = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email: data.annotator,
      },
    });

    const r = await prisma.page.update({
      where: {
        id: data.pageId,
      },
      data: {
        annotatorId: user.id,
        markingElapsedTime: data.elapsedTime,
        marked: true
      },
    });

    //lança um erro caso nenhum arquivo tenha sido atualizado
    if (r.modifiedCount === 0) {
      throw new Error("O arquivo não foi encontrado.");
    }

    return new NextResponse("Tempo atualizado com sucesso.");
  } catch (e) {
    return new NextResponse("Erro ao atualizar o arquivo: " + e, {
      status: 400,
    });
  }
}
