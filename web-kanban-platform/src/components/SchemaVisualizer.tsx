"use client"
import React, { useState, useEffect } from 'react'

import { ExecutionResult, graphql, GraphQLSchema } from 'graphql'

import {User, Task} from "../app/schemaWrapper"

import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

import { getTasksFunction_GQL, getUserFunction_GQL } from '@/lib/graphQl_functions';

interface WorkspaceProps{
    schema?: GraphQLSchema
    users_schema?: Record<string, User>
    tasks_schema?: Record<string, Task>
  }

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import { useUserContext } from './contexts/userContext'


const SchemaVisualizer = ({schema, users_schema, tasks_schema} : WorkspaceProps) => {
  const {user, id} = useUserContext();
  //
  const [userQuery, setUserQuery] = useState<string>();
  const [tasksQuery, setTasksQuery] = useState<string>();

  const [doneTasksQuery, setDoneTasksQuery] = useState<string>();

  //

  const handleOpen = async () => {
    const resUser = await getUserFunction_GQL(user, schema);
    const resTasks = await getTasksFunction_GQL(id, false, schema);
    const resDoneTasks = await getTasksFunction_GQL(id, true, schema);

    if(resUser && resTasks){
      const tasksInColumns = [...resUser.column1, ...resUser.column2, ...resUser.column3];
      
      const presentTasks = resTasks.filter(elem => tasksInColumns.includes( 
        typeof elem.id === "string" ? parseInt(elem.id) : elem.id
       ));

       setUserQuery(JSON.stringify(resUser));
       setTasksQuery(JSON.stringify(presentTasks));
       setDoneTasksQuery(JSON.stringify(resDoneTasks));
    }
  }

  return (
    <div>
        <AlertDialog>
                <AlertDialogTrigger className={`border rounded-md`} onClick={handleOpen}> 
                    <p className={`z-10`}>Visualize GraphQL</p>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Status local da base GraphQL</AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className={`w-full h-[400px] overflow-y-scroll flex flex-col gap-2`}>
                      <div className={`w-full flex-1 flex justify-center`}>

                        <div className={`w-[90%]`}>
                          <p>Query Users:</p>
                          <div className={`w-full max-h-[250px] min-h-[20px] rounded-md bg-black text-white overflow-y-scroll`}>
                            <JSONPretty id="user-pretty" data={userQuery}></JSONPretty>
                          </div>
                        </div>

                      </div>

                      <div className={`w-full flex-1 flex justify-center`}>
                        <div className={`w-[90%]`}>
                          <p>Query Current Tasks:</p>
                          <div className={`w-full max-h-[250px] min-h-[20px] rounded-md bg-black text-white overflow-y-scroll`}>
                            <JSONPretty id="tasks-pretty" data={tasksQuery}></JSONPretty>
                          </div>
                        </div>
                    
                      </div>

                      <div className={`w-full flex-1 flex justify-center`}>
                        <div className={`w-[90%]`}>
                          <p>Query Done Tasks:</p>
                          <div className={`w-full max-h-[250px] min-h-[20px] rounded-md bg-black text-white overflow-y-scroll`}>
                            <JSONPretty id="tasks-pretty" data={doneTasksQuery}></JSONPretty>
                          </div>
                        </div>

                      </div>

                    </div>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>

    </div>
  )
}

export default SchemaVisualizer