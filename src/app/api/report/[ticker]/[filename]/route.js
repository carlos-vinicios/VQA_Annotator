import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
 
export async function GET(request, {params}) {
  const srcPath = process.env.FULL_REPORTS_PATH

  const filePath = `${srcPath}/${params.ticker}/${params.filename}`
  const reportData = await fs.readFile(filePath);
  
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");

  return new NextResponse(reportData, { status: 200, statusText: "OK", headers })
}
