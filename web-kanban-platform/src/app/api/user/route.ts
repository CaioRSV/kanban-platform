import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Fetch dados user
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  const SQL = `SELECT * FROM KBN_Users where name=$1`
  try {
    if (!name) throw new Error('Nome requerido');
      const resposta = await sql.query(SQL, [name]);
      return NextResponse.json({ resposta }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

}