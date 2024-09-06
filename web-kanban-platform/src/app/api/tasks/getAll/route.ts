import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Fetch all tasks from user (Criado para auxiliar lógica de GraphQL)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const user = searchParams.get('user');

  const SQL = `SELECT * FROM KBN_Tasks WHERE userId=$1`; // Todas as tasks (concluídas ou não) de usuário
  
  try {
    if (!user) throw new Error('ID de usuário requerido');
      const resposta = await sql.query(SQL, [user]);
      return NextResponse.json({ resposta }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

