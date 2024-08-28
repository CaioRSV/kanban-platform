import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const task = searchParams.get('task')?.split(',').map(Number);

  const SQL = `SELECT * FROM KBN_Tasks WHERE id = ANY($1::int[]) AND done = FALSE`;
  
  try {
    if (!task) throw new Error('ID da Tarefa requerido');
      const resposta = await sql.query(SQL, [task]);
      return NextResponse.json({ resposta }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

