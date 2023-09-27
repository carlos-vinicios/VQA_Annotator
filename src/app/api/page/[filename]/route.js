import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
 
export async function GET(request, {params}) {
  const folderPath = process.env.PAGE_REPORTS_PATH

  const filePath = `${folderPath}/${params.filename}`
  const data = await fs.readFile(filePath);
  
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  
  return new NextResponse(data, { status: 200, statusText: "OK", headers })
}
