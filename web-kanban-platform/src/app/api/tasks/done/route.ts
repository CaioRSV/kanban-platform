import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userID = searchParams.get('user');
  const timeframe = searchParams.get('timeframe');

  if(timeframe && timeframe.length>0){
    const SQL = `SELECT * FROM KBN_Tasks WHERE userId=$1 AND done IS TRUE and CURRENT_TIMESTAMP - endDate < ($2 * INTERVAL '1 day');`
    try {
      if (!userID) throw new Error('Usuário não encontrado');
        const resposta = await sql.query(SQL, [userID, parseInt(timeframe)]);
        return NextResponse.json({ resposta }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  else{
    const SQL = `SELECT * FROM KBN_Tasks where userId=$1 AND done IS TRUE`
    try {
      if (!userID) throw new Error('Usuário não encontrado');
        const resposta = await sql.query(SQL, [userID]);
        return NextResponse.json({ resposta }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

}