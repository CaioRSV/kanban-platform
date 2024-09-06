import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


// Delete task por id

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const task = searchParams.get('task');

  const SQL = `DELETE FROM KBN_Tasks where id=$1`
  try {
    if (!task) throw new Error('ID da Tarefa requerido');
      const resposta = await sql.query(SQL, [task]);
      return NextResponse.json({ resposta }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

