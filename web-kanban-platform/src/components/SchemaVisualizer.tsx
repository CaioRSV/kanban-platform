"use client"
import React, { useState } from 'react'

import { GraphQLSchema } from 'graphql'

import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

import { getTasksFunction_GQL, getUserFunction_GQL } from '@/lib/graphQl_functions';

interface WorkspaceProps{
    schema?: GraphQLSchema
}

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useUserContext } from './contexts/userContext'
import { useTheme } from 'next-themes';
import { GrGraphQl } from 'react-icons/gr';

import { IoInformationCircleOutline } from "react-icons/io5";


const buttonOutline_style = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2`


const SchemaVisualizer = ({schema} : WorkspaceProps) => {
  const {user, id} = useUserContext();
  const {theme} = useTheme();

  // Strings que serão populadas com as queries GraphQL para serem exibidas
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

  const Divisor = () => {
    return(
      <div className={`w-full flex-1 flex justify-center`}>
        <div className={`w-[90%]`}>
          <div className={`bg-slate-500 w-full min-h-[1px] my-3`}/>
        </div>
      </div>
    );
  }

  const query_user = `query getUser {
    user(name: "${user}") {
      id
      name
      column1
      column1_name
      column2
      column2_name
      column3
      column3_name
  }
}`

  const query_tasks_open = `query CurrentTasks {
  tasks(id: ${id}, done: true){
    id,
    name,
    description,
    color,
    done,
    enddate,
  }`

  const query_tasks_done = `query DoneTasks {
  tasks(id: ${id}, done: true){
    id,
    name,
    description,
    color,
    done,
    enddate,
  }
}`


  const Info = ({propQuery}: {propQuery: string}) => {
    // Aproveitando o comportamento de erro JSONPretty para formatar a query GraphQL
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IoInformationCircleOutline size={23}/>
          </TooltipTrigger>
          <TooltipContent>
            <JSONPretty id={propQuery} data={propQuery} errorStyle={`color:${theme=="dark"?"rgba(255,255,255,1)":"rgba(0,0,0,1)"};background:rgba(0,0,0,0);padding:5px;`}></JSONPretty>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>      
    );
  }

  const QueryResContainer = ({title, querySet, queryInfo}: {title: string, querySet: string, queryInfo: string}) => {
    return(
      <div className={`w-[90%]`}>
        <div className={`flex w-full items-center`}>
          <p>{title}</p>
          <div className={`flex-1`}/>
          <Info propQuery={queryInfo} />
        </div>

        <div className={`w-full max-h-[250px] min-h-[20px] rounded-md overflow-y-scroll border my-1 ${theme=="dark" ? 'contrast-125' : ''}`}>
          <JSONPretty id="user-pretty" data={querySet} mainStyle="padding:15px;background:rgb(35,35,35)"></JSONPretty>
        </div>
      </div>
    );
  }

  //

  return (
    <div style={{filter: (!user || user.length==0) ? 'blur(3px)' : '', pointerEvents: (!user || user.length==0) ? 'none': 'all' }}>
        <AlertDialog>
                <AlertDialogTrigger className={`${buttonOutline_style} gap-2`} onClick={handleOpen}> 
                    <p className={`z-10`}>Visualizar GraphQL</p>
                    <GrGraphQl size={23} className={`${theme=="dark"?"text-pink-500 opacity-90": "text-pink-400"}`} />  
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogDescription>GraphQL Visualizer</AlertDialogDescription>

                    <AlertDialogHeader>
                        <AlertDialogTitle>Status da base local GraphQL</AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className={`w-full h-[400px] overflow-y-scroll flex flex-col gap-2`}>
                      <Divisor/>

                      <div className={`w-full flex-1 flex justify-center`}>
                        <QueryResContainer title="Query - Usuário atual" querySet={userQuery ?? ""} queryInfo={query_user}/>
                      </div>

                      <Divisor/>

                      <div className={`w-full flex-1 flex justify-center`}>
                        <QueryResContainer title="Query - Tarefas atuais" querySet={tasksQuery ?? ""} queryInfo={query_tasks_open}/>
                      </div>

                      <Divisor/>

                      <div className={`w-full flex-1 flex justify-center`}>
                        <QueryResContainer title="Query - Tarefas concluídas" querySet={doneTasksQuery ?? ""} queryInfo={query_tasks_done}/>
                      </div>

                      <Divisor/>
                    </div>
                    
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>

    </div>
  )
}

export default SchemaVisualizer