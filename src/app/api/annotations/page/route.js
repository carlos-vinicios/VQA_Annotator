import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
 
export async function GET() {
  //essa rota vai ser utilizada apenas para teste da aplicação
  const cut_index = __dirname.indexOf("/.next");
  const srcPath = __dirname.slice(0, cut_index);
  const reportsPath = `${srcPath}/pdfs`;
  const annotationsPath = `${srcPath}/annotations`;
  
  const reportsFiles = await fs.readdir(reportsPath);
  const annotationFiles = await fs.readdir(annotationsPath);

  let file = ""
  for(var rf in reportsFiles){
    const annotationFile = reportsFiles[rf].replace(".pdf", ".json")
    if(!(annotationFiles.includes(annotationFile))){
      file = reportsFiles[rf].replace(".pdf", "")
      break
    }
  }
  
  return NextResponse.json({file})
}
