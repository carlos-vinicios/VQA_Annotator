import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
 
export async function GET(request, {params}) {
  const cut_index = __dirname.indexOf("/.next")
  const srcPath = __dirname.slice(0, cut_index)
  const folderPath = `${srcPath}/pdfs`
  const fileName = `${params.file}.pdf`
  const filePath = `${folderPath}/${fileName}`

  const data = await fs.readFile(filePath);
  
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");

  return new NextResponse(data, { status: 200, statusText: "OK", headers })
}
