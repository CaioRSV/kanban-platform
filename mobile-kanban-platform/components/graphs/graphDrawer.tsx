import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';

import { useUserContext } from '../contexts/userContext';
import { useColorScheme } from 'nativewind';
import ModalGraphDrawer from './modalGraphDrawer';

const GraphDrawer = () => {
    const [graphModal, setGraphModal] = useState<boolean>(false);

    const { user, id, setLoadingTasks } = useUserContext();

    // Done line graph
    const [doneRange] = useState<number>(7);

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

    const { colorScheme } = useColorScheme();


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
      </View>

      <View className={`h-full w-full flex justify-center items-center`}>
        <Text adjustsFontSizeToFit className={`text-blue-300`}>{user}</Text>

        <ModalGraphDrawer graphModal={graphModal} setGraphModal={setGraphModal} doneLabels={doneLabels} doneSeries={doneSeries}/>
      </View>
    </View>
)
}

export default GraphDrawer