"use client";
import React, {useState} from 'react'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

import { Button } from "@/components/ui/button";

import RatioGraph from "@/components/graphBar/ratioGraph";

import { useUserContext } from '../contexts/userContext';

import { TbChartInfographic } from "react-icons/tb";
import DoneLineGraph from './doneLineGraph';

import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useTheme } from 'next-themes';

import { GraphQLSchema } from 'graphql';
import { User, Task } from '@/app/schemaWrapper';
import { getTasksFunction_GQL } from '@/lib/graphQl_functions';

interface GraphDrawerProps{
  schema?: GraphQLSchema
  users_schema?: Record<string, User>
  tasks_schema?: Record<string, Task>
}


const GraphDrawer = ( { schema } : GraphDrawerProps) => {

  // Contextos e variáveis de estado
  const {theme} = useTheme();

  const {
    user, id,
    column1, column1_name,
    column2, column2_name,
    column3, column3_name
  } = useUserContext();
  
  const [loading, setLoading] = useState<boolean>(false);

  // Variáveis úteis para fetch e exibição de dados para o gráfico de linha (DoneLine)

  const [doneRange] = useState<number>(7); // Definindo limite de 7 dias para fetch (no futuro pode ser implementado para customizável)
  const [doneLabels, setDoneLabels] = useState<string[]>(); // Labels do gráfico a serem exibidas
  const [doneSeries, setDoneSeries] = useState<number[]>(); // Quantidades de tasks feitas a serem exibidas


  // Função de fetch de tarefas feitas pelo usuário baseado no range acima 
  async function updateDoneLine(){
    setLoading(true);

    const newLabels:string[] = [];
    const newSeries:number[] = [];

    const resDoneTasks = await getTasksFunction_GQL(id, true, schema); //(+GraphQL)

    if(doneRange){
      for(let i=doneRange; i>0;i--){
        const currentDate = new Date(); // today


        const previousDateLabel = new Date(currentDate); 
        previousDateLabel.setDate(currentDate.getDate() - i + 1);

        //

        const previousDate = new Date(currentDate); 
        previousDate.setDate(currentDate.getDate() - i);
        
        const plusOneDate = new Date(currentDate); 
        plusOneDate.setDate(currentDate.getDate() - i + 1);

        const formattedDate = previousDateLabel.toLocaleDateString('en-GB');
        
        newLabels.push(formattedDate);

        if(resDoneTasks){
          const quantity: Task[] = resDoneTasks.filter(
            elem => {
              if (elem.enddate) {
                const endDate = new Date(elem.enddate);
                if(previousDate.getTime() < endDate.getTime() && endDate.getTime() < plusOneDate.getTime()){
                  return true
                }
                else{
                  return false
                }
              }
              else{
                return false;
              }
            }
           )

           newSeries.push(quantity.length);
        }
      }
    }

    // Após fim do fetch, associa os valores às variáveis para exibir e encerra o loading
    setDoneLabels(newLabels);
    setDoneSeries(newSeries);
    
    setLoading(false);
  }

  //
  
  return (
    <div className={`w-full flex justify-center`} style={{filter: (!user || user.length==0) ? 'blur(3px)' : '', pointerEvents: (!user || user.length==0) ? 'none': 'all' }}>
      <Drawer>
        <DrawerTrigger onClick={()=>{updateDoneLine()}}>
          <div className={`w-[300px] p-2 border rounded-full flex justify-center items-center`}>
            <TbChartInfographic size={26} />
          </div>
        </DrawerTrigger>

        <DrawerContent className={`h-[95vh]`}>
            <DrawerHeader>

              <DrawerTitle>
                <p className={`w-full flex justify-center`}>Relatórios</p>
              </DrawerTitle>

              <DrawerDescription className={`w-full flex justify-center`}>
                Informações sobre suas atividades no aplicativo.
              </DrawerDescription>

            </DrawerHeader>
              <div className={`w-full h-full flex flex-col items-center overflow-y-scroll`}>
                  <div className={`h-[1px] w-[95%] m-2 bg-slate-400 bg-opacity-75`}/>
                  {
                    loading
                      ?
                      <div className={`w-full h-full flex justify-center items-center`}>
                        <CgSpinnerTwoAlt size={26} className={`animate-spin`} />
                      </div>
                      :
                      <>
                        <p className={`w-full flex justify-center p-2`}>Distribuição de suas tarefas por coluna.</p>
                          {
                            (column1.length>0 || column2.length>0 || column3.length>0)
                              ?
                              <RatioGraph series={[column1.length, column2.length, column3.length]} labels={[column1_name, column2_name, column3_name]} theme={theme ?? 'light'} />
                              :
                              <p className={`p-4 bg-[rgba(141,164,195,0.05)] rounded-md`}>Não existem tarefas presentes no momento. Crie algumas para visualizar este gráfico!</p>
                          }
                        
                        <div className={`h-[1px] w-[95%] m-2 bg-slate-400 bg-opacity-75`}/>
                        <p className={`w-full flex justify-center p-2`}>Tarefas concluídas ao longo do tempo.</p>
                        
                        <DoneLineGraph series={doneSeries ?? []} labels={doneLabels ?? []} theme={theme ?? 'light'}/>
                        
                        <div className={`h-[1px] w-[95%] m-2 bg-slate-400 bg-opacity-75`}/>
                      
                      </>
                  }
              
              </div>
            
            <DrawerClose>
                <Button variant="outline" className={`my-2`}>Voltar</Button>
            </DrawerClose>

        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default GraphDrawer