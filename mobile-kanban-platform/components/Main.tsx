"use client";
import { View, Text, Button, Switch, TouchableOpacity, Modal, ActivityIndicator, Linking} from 'react-native'
import { ScrollView } from 'react-native-virtualized-view'

import React, {useState} from 'react'

import { useUserContext } from "../components/contexts/userContext";
import { useTaskContext } from "../components/contexts/tasksContext";

import SetUserModal from './setUserModal';

import { useTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

import Workspace from './dragNdrop/workspace';

import {Dimensions} from 'react-native';
import RatioGraph from './graphs/ratioGraph';
import DoneLineGraph from './graphs/doneLineGraph';

import { GestureHandlerRootView } from "react-native-gesture-handler";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const Main = () => {


  async function saveColumns() {
    const col1_params = `${column1.length> 0 ? `&column1=${column1.join(',')}` : ``}`;
    const col2_params = `${column2.length> 0 ? `&column2=${column2.join(',')}` : ``}`;
    const col3_params = `${column3.length> 0 ? `&column3=${column3.join(',')}` : ``}`;
    
    await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/user/update?id=${id}${col1_params}${col2_params}${col3_params}`);
}

  const [graphModal, setGraphModal] = useState<boolean>(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

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

  const {tasks, setTasks} = useTaskContext();

  function cleanUp(){
    setUser("");
    setId(-1);
    setColumn1([]);
    setColumn2([]);
    setColumn3([]);
    setColumn1_name("A fazer");
    setColumn2_name("Em progresso");
    setColumn3_name("Finalizadas");
    setTasks([]);
  }

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
  
  
    //


  return (
    <View style={{overflow: 'scroll'}} className={`h-full w-full dark:bg-black p-8 relative`}>
        <View className={`w-full flex flex-row`}>

          <TouchableOpacity onPress={()=>{Linking.openURL("https://github.com/CaioRSV")}}  className={`flex-1 items-start justify-center`}>
            <AntDesign name="github" size={40} color={`${colorScheme=='dark'?'white':'black'}`} />
          </TouchableOpacity>

          <View className={`flex-1 flex gap-2 flex-row justify-center items-center`}>
            <Text className={`${colorScheme=='dark'?'text-white':'text-black'}`}>{user}</Text>
            <Octicons name="arrow-switch" size={24} color={`${colorScheme=='dark'?'white':'black'}`} onPress={cleanUp} />
          </View>

          <View className={`flex-1 flex flex-row justify-end items-center`}>
            <Ionicons name="bulb-outline" size={24} color={`${colorScheme=='dark'?'white':'black'}`} />
            <Switch value={colorScheme=='light'} onValueChange={toggleColorScheme} thumbColor={colorScheme=='light' ? 'black' : 'white'} trackColor={{false: 'gray', true: 'gray'}}/>
            
          </View>

        </View> 

        <ScrollView>
          <TouchableOpacity onPress={saveColumns} className={`border rounded-md flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: 'gray'}}>
                <Text className={`text-lg`} style={{color: colorScheme=='dark' ? 'white' : 'black'}} >Salvar</Text>
                <FontAwesome5 name="save" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
          </TouchableOpacity>

          <Workspace theme={colorScheme=='dark' ? 'dark' : 'light'}/>

          <View className={`w-full flex flex-row justify-center`}>
            <TouchableOpacity onPress={()=>{updateDoneLine();setGraphModal(true);}} className={`w-[80%] border rounded-full flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: 'gray'}}>
              <Entypo name="bar-graph" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
            </TouchableOpacity>
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
                  {/* <View className={`w-full px-2 h-20 justify-center items-center border-x`} style={{borderColor: colorScheme=='dark'?'white':'black'}}>
                    <TouchableOpacity onPress={()=>{setGraphModal(false)}} className={`p-5 rounded-md border`} style={{borderColor: colorScheme=='dark'?'white':'gray'}}>
                      <Text style={{color: colorScheme=='dark'?'white':'black'}} className={`text-md`}>Voltar</Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
              

            </Modal>

          </View>
          



          <SetUserModal theme={colorScheme=='dark'?'dark':'light'}/> 

        </ScrollView>
    </View>
  )
}

export default Main