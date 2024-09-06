import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Criação de novas tasks

const epoch2038_limit = 2147483647; // Limitação em ms do datatype int

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = Math.floor(Date.now()/1000) % epoch2038_limit;  // Tratamento de possível limitação de geração de IDs (Epoch 2038)
  const name = searchParams.get('name');

  const SQL = `INSERT INTO KBN_Users(id, name, column1, column2, column3) VALUES ($1, $2, ARRAY[]::INTEGER[], ARRAY[]::INTEGER[], ARRAY[]::INTEGER[])`
  try {
    if (!name) throw new Error('Nome requerido');
      await sql.query(SQL, [id, name]);
      return NextResponse.json({ resposta : { id: id} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

}