import { NextResponse } from 'next/server';
import clientPromise from "@/services/mongodb";
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("DOC_VQA");
    
    //lendo os metadados enviados
    const data = await request.json()
    
    //atualiza o status de seleção e insere os metadados
    const r = await db.collection("reports").updateOne(
      {_id: new ObjectId(data.file_id)},
      {$set: {
        selecting: false,
        pagesMetadata: data.pagesMetadata,
        lastUpdate: new Date()
      }}
    )
    
    //lança um erro caso nenhum arquivo tenha 
    //sido atualizado
    if (r.modifiedCount === 0) {
      throw new Error("O arquivo não foi encontrado.")
    }
    
    return NextResponse.json({
      message: "Metadados inseridos com sucesso"
    })
  } catch (e) {
    return NextResponse.json({
      message: "Erro ao atualizar o arquivo: " + e.message, 
      status: 501
    })
  }
}