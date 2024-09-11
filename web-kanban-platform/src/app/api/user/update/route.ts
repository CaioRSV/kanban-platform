import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Atualizando tasks presentes nas colunas de algum usuário
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');
  
  const column1 = searchParams.get('column1')?.split(',').map(Number) || [];
  const column2 = searchParams.get('column2')?.split(',').map(Number) || [];
  const column3 = searchParams.get('column3')?.split(',').map(Number) || [];
  
  const column1_name = searchParams.get('column1_name');
  const column2_name = searchParams.get('column2_name');
  const column3_name = searchParams.get('column3_name');


  let setCombo:string[] = [];
  let refValues:any[] = [id]
  
  //

  setCombo.push(`column1=$${setCombo.length+2}`);
  refValues.push(column1);
  //

  setCombo.push(`column2=$${setCombo.length+2}`);
  refValues.push(column2);

  //

  setCombo.push(`column3=$${setCombo.length+2}`);
  refValues.push(column3);

  //
  if (column1_name) {
    setCombo.push(`column1_name=$${setCombo.length+2}`);
    refValues.push(column1_name);
  }

  if (column2_name) {
    setCombo.push(`column2_name=$${setCombo.length+2}`);
    refValues.push(column2_name);
  }

  if (column3_name) {
    setCombo.push(`column3_name=$${setCombo.length+2}`);
    refValues.push(column3_name);
  }

  //
  
  const SQL = `
    UPDATE KBN_Users 
    SET ${setCombo.join(', ')}
    WHERE id=$1`;


    console.log(SQL);

  
  try {
    if (!id) throw new Error('ID requerido');
      const resposta = await sql.query(SQL, refValues);
      return NextResponse.json({ resposta }, { status: 200 });
      
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

}