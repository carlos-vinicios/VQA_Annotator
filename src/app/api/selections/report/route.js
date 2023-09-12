import { NextResponse } from 'next/server';
import clientPromise from "@/services/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("DOC_VQA");

    //seleciona um arquivo disponível para seleção de
    //páginas
    const report = await db
      .collection("reports")
      .findOne({
        avaiable: true, 
        selecting: false,
        pagesMetadata: {$exists: false}
      });
    
    //atualiza o status dele
    await db.collection("reports").updateOne(
      {_id: report._id},
      {$set: {
        selecting: true,
        lastUpdate: new Date()
      }}
    )
    
    return NextResponse.json({report})
  } catch (e) {
    return NextResponse.json({message: "Erro ao buscar arquivo: " + e, status: 501})
  }
}
