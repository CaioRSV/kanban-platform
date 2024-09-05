import { View, Text, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import DoneLineGraph from './doneLineGraph';
import RatioGraph from './ratioGraph';

import { useUserContext } from '../contexts/userContext';
import { useColorScheme } from 'nativewind';

const GraphDrawer = () => {
    const [graphModal, setGraphModal] = useState<boolean>(false);

    
    const {
        user, setUser, id, setId, 
        setColumn1_name, column1_name,
        setColumn2_name, column2_name,
        setColumn3_name,column3_name,
        setColumn1, column1,
        setColumn2, column2,
        setColumn3, column3,
        loadingTasks, setLoadingTasks
    } = useUserContext();

    // Done line graph

    const [doneRange, setDoneRange] = useState<number>(7);

    const [doneLabels, setDoneLabels] = useState<string[]>();
    const [doneSeries, setDoneSeries] = useState<number[]>();




    async function updateDoneLine(){
  
        setLoadingTasks(true);
    
        const newLabels:string[] = [];
    
        const newSeries:number[] = [];
    
        if(doneRange){
          for(let i=doneRange; i>0;i--){
            const currentDate = new Date(Date.now()); 
            const previousDate = new Date(currentDate); 
            previousDate.setDate(currentDate.getDate() - i + 1);
            const formattedDate = previousDate.toLocaleDateString('en-GB').split('/');
            
            newLabels.push(`${formattedDate[0]}/${formattedDate[1]}`);
      
            const numberOfTasks = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/tasks/done?user=${id}&doneTime=${i}&referenceTime=${i-1}`)
              .then(res => res.json())
              .then(data => data.resposta.rows.length)
              .catch(err => {
                setLoadingTasks(false);
                throw err
              })
    
            if(numberOfTasks){
              newSeries.push(numberOfTasks);
            }
            else{
              newSeries.push(0);
            }
          }
        }
        setDoneLabels(newLabels);
        setDoneSeries(newSeries);
        
        setLoadingTasks(false);
      }

      const { colorScheme, toggleColorScheme } = useColorScheme();


      const openGraphDrawer = () => {
        setGraphModal(true);
        updateDoneLine();
      }


  return (
    <View>
          <View className={`w-full flex flex-row justify-center`}>
            <TouchableOpacity onPress={openGraphDrawer} className={`w-[80%] border rounded-full flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: 'gray'}}>
              <Entypo name="bar-graph" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
            </TouchableOpacity>
            <Text>{graphModal.toString()}</Text>
          </View>

          <View className={`h-full w-full flex justify-center items-center`}>
            <Text adjustsFontSizeToFit className={`text-blue-300`}>{user}</Text>
            <Modal
              visible={graphModal}
              animationType="slide"
              transparent={true}
              >
                <View className={`w-full h-full flex justify-center`} style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                  <TouchableOpacity onPress={()=>{setGraphModal(false)}} className={`w-full flex items-center rounded-t-full p-2 border-t border-l border-r`} style={{backgroundColor: colorScheme=='dark'?'black':'white', borderColor: colorScheme=='dark'?'white':'black'}}>
                    <View className={`h-[3px] bg-slate-300 mt-2 w-[25%] rounded-full opacity-50 mb-3`} />
                    <Text className={`text-lg`} style={{color: colorScheme=='dark'?'white':'black'}}>Relatórios</Text>
                    <Text className={`text-slate-500`}>Informações sobre suas atividades no aplicativo.</Text>
                  </TouchableOpacity>

                  <View className={`flex-1 h-32 border-l border-r flex items-center`} style={{backgroundColor: colorScheme=='dark'?'black':'white', borderColor: colorScheme=='dark'?'white':'black'}}>
                    {
                      loadingTasks
                        ?
                        <View className={`w-full h-full flex flex-row justify-center items-center`}>
                          <ActivityIndicator size="large" color={colorScheme=='dark'? 'white' : 'black'} />
                        </View>
                        :
                        <>
                        <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'black'}}/>
                        <Text style={{color: colorScheme=='dark'?'white':'black'}}>Distribuição de suas tarefas por coluna</Text>
                        <RatioGraph column1_name={column1_name ?? 'A fazer'} column1={column1 ?? []} column2_name={column2_name ?? 'Em progresso'} column2={column2 ?? []} column3_name={column3_name ?? 'Finalizadas'} column3={column3 ?? []}/>

                        <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'gray'}}/>
                        <Text style={{color: colorScheme=='dark'?'white':'black'}}>Tarefas realizadas por período de tempo</Text>
                        <DoneLineGraph theme={colorScheme=='dark'?'dark':'light'} labels={doneLabels} series={doneSeries} />
                        <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'gray'}}/>
                        </>
                    }

                  </View>
                </View>
              

            </Modal>

          </View>
          
        </View>
  )
}

export default GraphDrawer