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
  const color = searchParams.get('color');

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
    setCombo.push(`endDate=$${setCombo.length+2}`);

    setCombo.push(`done = TRUE`);

    const todayte = Date.now();
    const sqlTimestamp = new Date(todayte).toISOString().slice(0, 19).replace('T', ' ');

    refValues.push(sqlTimestamp); 

  }
  
  if (startDate) {
    setCombo.push(`startDate=$${setCombo.length+2}`);
    refValues.push(startDate);
  }
  
  if (endDate) {
    setCombo.push(`endDate=$${setCombo.length+2}`);
    refValues.push(endDate);
  }

  if (color) {
    setCombo.push(`color=$${setCombo.length+2}`);
    refValues.push(color);
  }
  
  const SQL = `
    UPDATE KBN_Tasks 
    SET ${setCombo.join(', ')}
    WHERE id=$1`;

    console.log(setCombo);
    console.log(SQL);
  
  try {
    if (!id) throw new Error('ID requerido');
      const resposta = await sql.query(SQL, refValues);
      return NextResponse.json({ resposta }, { status: 200 });
      
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

}