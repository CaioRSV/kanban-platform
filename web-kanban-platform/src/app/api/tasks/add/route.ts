import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const epoch2038_limit = 2147483647;
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const task = Math.floor(Date.now()/1000) % epoch2038_limit;  // Tratamento de possível limitação de geração de IDs (Epoch 2038)
  const user = searchParams.get('user');
  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const color = searchParams.get('color');

  const SQL = `INSERT INTO KBN_Tasks(id, userId, name, description, done) VALUES ($1,$2,$3,$4, FALSE)`;

  const SQL_2 = `INSERT INTO KBN_Tasks(id, userId, name, description, done, color) VALUES ($1,$2,$3,$4, FALSE, $5)`;

  try {
    if (!name) throw new Error('Nome da Tarefa requerido');
      if(color){
        const resposta = await sql.query(SQL_2, [task,user,name,description, color]);
      }
      else{
        const resposta = await sql.query(SQL, [task,user,name,description]);
      }
      return NextResponse.json({ resposta: {id: task} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

