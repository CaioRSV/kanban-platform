import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const done = searchParams.get('done');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let setCombo:string[] = [];
  let refValues:any[] = [id]
  
  if (name) {
    setCombo.push(`name=$${setCombo.length+2}`);
    refValues.push(name);
  }
  
  if (description) {
    setCombo.push(`description=$${setCombo.length+2}`);
    refValues.push(description);
  }
  
  if (done) {
    setCombo.push(`done = TRUE`);
  }
  
  if (startDate) {
    setCombo.push(`startDate=$${setCombo.length+2}`);
    refValues.push(startDate);
  }
  
  if (endDate) {
    setCombo.push(`endDate=$${setCombo.length+2}`);
    refValues.push(endDate);
  }
  
  const SQL = `
    UPDATE KBN_Tasks 
    SET ${setCombo.join(', ')}
    WHERE id=$1`;
  
  try {
    if (!id) throw new Error('ID requerido');
      const resposta = await sql.query(SQL, refValues);
      return NextResponse.json({ resposta }, { status: 200 });
      
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

}