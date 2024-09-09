"use client";
import React, { useState } from 'react'

import { useUserContext } from './contexts/userContext';
import { useTaskContext } from './contexts/tasksContext';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog_v2"

import { Input } from "@/components/ui/input"
  
import { RiLoginCircleLine } from "react-icons/ri";
import { ImSpinner8 } from "react-icons/im";

//---

import { User, Task } from '@/app/schemaWrapper';
import { ExecutionResult, graphql, GraphQLSchema } from 'graphql';

import { getTasksFunction_GQL, getUserFunction_GQL } from '@/lib/graphQl_functions';

interface SetUserModalProps{
  schema?: GraphQLSchema
  users_schema?: Record<string, User>
  tasks_schema?: Record<string, Task>
}


const SetUserModal = ( {schema, users_schema, tasks_schema} : SetUserModalProps ) => {
  // Contextos

  const {
    user, setUser, setId, 
    setColumn1_name, 
    setColumn2_name, 
    setColumn3_name,
    setColumn1,
    setColumn2,
    setColumn3,
    setLoadingTasks
  } = useUserContext();

  const { setTasks } = useTaskContext();

  // Variáveis de estado locais
  const [tempUserName, setTempUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  //
  

  // Funções que atualizam informações dos contextos de User e Tasks (+GraphQL)
  async function setUserServer(userName:string){

    if(userName.length==0 || !schema) return;

    setLoading(true);

    // Parte REST apenas para verificação se usuário existe ou não (simplicidade)
    const userRes = await fetch("/api/user?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => data.resposta.rows);

    if(userRes.length>0){ // Fetch no banco (área de trabalho existente)
      const userFound = userRes[0];

      const res = await loginFunction(userName, parseInt(userFound.id))
      
      const resUser = await getUserFunction_GQL(userName, schema);
      
      if(resUser){
        const resTasks = await getTasksFunction_GQL(parseInt(resUser.id), false, schema);

        setLoadingTasks(true); // Loading nas colunas

        setUser(resUser.name);
        setId(parseInt(resUser.id));

        setColumn1(resUser.column1);
        setColumn2(resUser.column2);
        setColumn3(resUser.column3);

        if(resUser.column1_name !== null && resUser.column1_name !==undefined) setColumn1_name(resUser.column1_name);
        if(resUser.column2_name !== null && resUser.column2_name !==undefined) setColumn2_name(resUser.column2_name);
        if(resUser.column3_name !== null && resUser.column3_name !==undefined) setColumn3_name(resUser.column3_name);


        if(resTasks){
          const col1 = resUser.column1;
          const col2 = resUser.column2;
          const col3 = resUser.column3;

          const resTasks_Filtered = resTasks.map(elem => ({
            ...elem,
            id: typeof elem.id === 'string' ? parseInt(elem.id) : elem.id
          }))

          console.log('there is')
          console.log(resTasks_Filtered)

          setTasks(
            resTasks_Filtered.map( (item:Task) => ({
              ...item,
              id: Math.floor(Math.random()*10000),
              columnId: 
                col1.includes(item.id) ? 1 : 
                  col2.includes(item.id) ? 2 :
                    col3.includes(item.id) ? 3 :
                    0,
              name: item.name,
              serverId: item.id
            })
              ).sort((a,b)=> [...col1, ...col2, ...col3].findIndex(item => item==a.serverId)>[...col1, ...col2, ...col3].findIndex(item => item==b.serverId) ? 0 : -1)
          
          )
        
        }

        setLoadingTasks(false);

      }
      
      
    }
    else{ // Criação de conta (Usuário não tinha área de trabalho anteriormente)
      const createUserRes = await fetch("/api/user/add?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => {
        return data.resposta.id
      });

      if(createUserRes != undefined){
        setUser(userName);
      }

      const userCreated = await fetch("/api/user?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => data.resposta.rows);
  
      const res = await loginFunction(userName, parseInt(userCreated.id))
      
      const resUser = await getUserFunction_GQL(userName, schema);

      //console.log(resUser);

      if(resUser){
        const resTasks = await getTasksFunction_GQL(parseInt(resUser.id), false, schema);
        //console.log(resTasks)
        setUser(resUser.name);
        setId(parseInt(resUser.id));
      }

    }

    setLoading(false);

  }


  //

  const loginFunction = async (username: String, userId: number) => {
    if(schema){  
      const query = `
          mutation Login($username: String!) {
        login(username: $username)
        }
      `

      const vars = {
          "username": username
      }
  
      const result: ExecutionResult = await graphql({
          schema,
          source: query,
          variableValues: vars
      })

      // Task fetching

      const query_tasks = `
        mutation PopTasks($id: Int!) {
          populateTasks(id: $id)
        }
      `
  
      const vars_tasks = {
          "username": username,
          "id": userId
      }
  
      const result_tasks: ExecutionResult = await graphql({
          schema,
          source: query_tasks,
          variableValues: vars_tasks
      })

      return {
        user_message: result,
        tasks_message: result_tasks
      }
    }
}

//

  return (
    <>
        <AlertDialog open={!user || user.length==0}>
            <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>
                    <div className={`flex`}>
                      <p>Quem é você?</p>
                      <div className={`flex-1`}/>
                      {
                        loading
                          ?
                          <ImSpinner8 size={20} className={`animate-spin mr-1`}/>
                          :
                          <></>
                      }
                    </div>
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                  Informe seu nome de usuário para acessar sua área de trabalho
                  </AlertDialogDescription>

              </AlertDialogHeader>

              <div className={`w-full flex gap-2`}>  
                <Input autoFocus onBlur={(e)=>{setTempUserName(e.target.value)}} onKeyDown={(e)=>{if(e.key=='Enter'){setUserServer(e.currentTarget.value)} }}/>
                
                <AlertDialogFooter>
                    <AlertDialogAction onClick={()=>{setUserServer(tempUserName)}}>
                    <RiLoginCircleLine size={28} />   
                    </AlertDialogAction>
                </AlertDialogFooter>
              </div>
          
            </AlertDialogContent>
        </AlertDialog>
    </>
  )
}

export default SetUserModal