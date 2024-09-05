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


const GraphDrawer = () => {

  const {theme} = useTheme();

  const [loading, setLoading] = useState<boolean>(false);

  const {user} = useUserContext();

  const {
    id,
    column1, column1_name,
    column2, column2_name,
    column3, column3_name
  } = useUserContext();


  const [doneRange, setDoneRange] = useState<number>(7);

  const [doneLabels, setDoneLabels] = useState<string[]>();
  const [doneSeries, setDoneSeries] = useState<number[]>();

  async function updateDoneLine(){

    setLoading(true);

    const newLabels:string[] = [];

    const newSeries:number[] = [];

    if(doneRange){
      for(let i=doneRange; i>0;i--){
        const currentDate = new Date(Date.now()); 
        const previousDate = new Date(currentDate); 
        previousDate.setDate(currentDate.getDate() - i + 1);
        const formattedDate = previousDate.toLocaleDateString('en-GB');
        
        newLabels.push(formattedDate);

        const numberOfTasks = await fetch(`api/tasks/done?user=${id}&doneTime=${i}&referenceTime=${i-1}`)
          .then(res => res.json())
          .then(data => data.resposta.rows.length)

        newSeries.push(numberOfTasks);
      }
    }
    setDoneLabels(newLabels);
    setDoneSeries(newSeries);
    
    setLoading(false);
  }
  
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
            <DrawerDescription>
              <p className={`w-full flex justify-center`}>Informações sobre suas atividades no aplicativo.</p>
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