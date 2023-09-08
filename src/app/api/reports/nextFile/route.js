import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
 
export async function GET() {
  //essa rota vai ser utilizada apenas para teste da aplicação
  const reportsPath = "/home/carlos/Documentos/PUC/vqa_annotator/src/pdfs";
  const annotationsPath = "/home/carlos/Documentos/PUC/vqa_annotator/src/annotations";
  
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
