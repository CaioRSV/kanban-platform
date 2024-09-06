import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Fetch de tasks confirmadas de forma definitiva no sistema
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userID = searchParams.get('user');
  const doneTime = searchParams.get('doneTime'); // Lower limit do fetch (Ex: No máximo 7 dias atrás)
  const referenceTime = searchParams.get('referenceTime'); // Upper limit do fetch (Ex: no mínimo 3 dias atrás)

  if(doneTime && doneTime.length>0){
    if(!referenceTime || referenceTime.length==0){
      const SQL = `SELECT * FROM KBN_Tasks WHERE userId=$1 AND done IS TRUE and CURRENT_TIMESTAMP - endDate < ($2 * INTERVAL '1 day');`
      try {
        if (!userID) throw new Error('Usuário não encontrado');
          const resposta = await sql.query(SQL, [userID, parseInt(doneTime)]);
          return NextResponse.json({ resposta }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
      }      
    }
    else{
      const SQL = `SELECT * FROM KBN_Tasks WHERE userId=$1 AND done IS TRUE and CURRENT_TIMESTAMP - endDate < ($2 * INTERVAL '1 day') and CURRENT_TIMESTAMP - endDate > ($3 * INTERVAL '1 day');`
      try {
        if (!userID) throw new Error('Usuário não encontrado');
          const resposta = await sql.query(SQL, [userID, parseInt(doneTime), parseInt(referenceTime)]);
          return NextResponse.json({ resposta }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
      }
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