import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';

import { useUserContext } from '../contexts/userContext';
import { useColorScheme } from 'nativewind';
import ModalGraphDrawer from './modalGraphDrawer';
import { getTasksFunction_GQL } from '../../utils/graphQl_functions';
import { GraphQLSchema } from 'graphql';
import { Task } from '../schemaComponents/schemaWrapper';


interface GraphDrawerProps {
  schema?: GraphQLSchema;
}

const GraphDrawer = ({schema} : GraphDrawerProps) => {
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

        const resDoneTasks = await getTasksFunction_GQL(id, true, schema); //(+GraphQL)
    
        if(doneRange){
          for(let i=doneRange; i>0;i--){
            const currentDate = new Date(); // today

            const previousDateLabel = new Date(currentDate); 
            previousDateLabel.setDate(currentDate.getDate() - i + 1);
    
            // Começando do range (7) e dimiuindo até o 1, contar quantidade de done tasks:
    
            // Entre i dias atrás
            const previousDate = new Date(currentDate); 
            previousDate.setDate(currentDate.getDate() - i);
            
            // e i+1 dias atrás
            const plusOneDate = new Date(currentDate); 
            plusOneDate.setDate(currentDate.getDate() - i + 1);
    
            const formattedDate = previousDateLabel.toLocaleDateString('en-GB').split('/')
            
            newLabels.push(`${formattedDate[0]}/${formattedDate[1]}`);
    
            if(resDoneTasks){
              const quantity: Task[] = resDoneTasks.filter(
                elem => {
                  if (elem.enddate) {
                    const endDate = new Date(elem.enddate);
                    if(previousDate.getTime() < endDate.getTime() && endDate.getTime() < plusOneDate.getTime()){
                      return true
                    }
                    // Today handler
                    else if(i==1 &&previousDate.getTime() < endDate.getTime() && endDate.getTime() > plusOneDate.getTime()){
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