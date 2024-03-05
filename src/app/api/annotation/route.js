import { NextResponse } from "next/server";
import prisma from "@/services/database/prisma";

export async function POST(request) {
  //lendo os metadados enviados
  try {
    const data = await request.json();
    const dataId = data.id;
    delete data.id;

    const r = await prisma.pageTest.update({
      where: {
        id: dataId,
      },
      data: data,
    });

    //lança um erro caso nenhum arquivo tenha sido atualizado
    if (r.modifiedCount === 0) {
      throw new Error("O arquivo não foi encontrado.");
    }

    return new NextResponse("Anotação realizada com sucesso.");
  } catch (e) {
    return new NextResponse("Erro ao atualizar o arquivo: " + e, {
      status: 400,
    });
  }
}
