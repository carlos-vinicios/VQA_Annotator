import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function POST(request) {
  //lendo os metadados enviados
  const data = await request.json()
  
  //escrevendo os metadados no arquivo
  const cut_index = __dirname.indexOf("/.next")
  const srcPath = __dirname.slice(0, cut_index)
  const folderPath = `${srcPath}/annotations`
  const fileName = 'times.json'
  const filePath = `${folderPath}/${fileName}`

  //salva o arquivo em disco
  let status = 200
  let message = "Arquivo salvo com sucesso"
  try {
    await fs.writeFile(filePath, JSON.stringify(data))
  } catch (error) {
    console.log(error)
    message = "Erro ao salvar arquivo"
    status = 501
  }

  return NextResponse.json({message, status})  
}
