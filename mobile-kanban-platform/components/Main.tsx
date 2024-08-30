"use client";
import { View, Text, Button, Switch, TouchableOpacity, Modal} from 'react-native'
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

import { Workspace } from './dragNdrop/workspace';

import {Dimensions} from 'react-native';
import RatioGraph from './graphs/ratioGraph';
import DoneLineGraph from './graphs/doneLineGraph';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const Main = () => {

  const [graphModal, setGraphModal] = useState<boolean>(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const {
    user, setUser, id, setId, 
    setColumn1_name, 
    setColumn2_name, 
    setColumn3_name,
    setColumn1, column1,
    setColumn2, column2,
    setColumn3, column3
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
    setColumn3_name("Concluídas");
    setTasks([]);
  }

  return (
    <View className={`h-full w-full dark:bg-black p-8 relative`}>
        <View className={`w-full flex flex-row`}>

          <View className={`flex-1 items-start justify-center`}>
            <AntDesign name="github" size={40} color={`${colorScheme=='dark'?'white':'black'}`} />
          </View>

          <View className={`flex-1 flex gap-2 flex-row justify-center items-center`}>
            <Text className={`${colorScheme=='dark'?'text-white':'text-black'}`}>{user}</Text>
            <Octicons name="arrow-switch" size={24} color={`${colorScheme=='dark'?'white':'black'}`} onPress={cleanUp} />
          </View>

          <View className={`flex-1 flex flex-row justify-end items-center`}>
            <Ionicons name="bulb-outline" size={24} color={`${colorScheme=='dark'?'white':'black'}`} />
            <Switch value={colorScheme=='light'} onValueChange={toggleColorScheme} thumbColor={colorScheme=='light' ? 'black' : 'white'} trackColor={{false: 'gray', true: 'gray'}}/>
            
          </View>

        </View> 

        <TouchableOpacity className={`border rounded-md flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: colorScheme=='dark' ? 'white' : 'gray'}}>
              <Text className={`text-lg`} style={{color: colorScheme=='dark' ? 'white' : 'black'}} >Salvar</Text>
              <FontAwesome5 name="save" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
        </TouchableOpacity>

        <View className={`h-full w-full flex justify-center items-center`}>
          <Text adjustsFontSizeToFit className={`text-blue-300`}>{user}</Text>
          <Text className={`text-green-800`}></Text>

          {/* <Workspace></Workspace> */}

          <Modal
            visible={graphModal}
            animationType="slide"
            transparent={true}
            >
              <View className={`w-full h-full flex justify-center`} style={{backgroundColor: colorScheme=='dark'?'black':'white'}}>
                <TouchableOpacity onPress={()=>{setGraphModal(false)}} className={`w-full flex items-center rounded-t-full p-2 border-t border-l border-r`} style={{backgroundColor: colorScheme=='dark'?'black':'white', borderColor: colorScheme=='dark'?'white':'black'}}>
                  <View className={`h-[3px] bg-slate-300 mt-2 w-[25%] rounded-full opacity-50 mb-3`} />
                  <Text className={`text-lg`} style={{color: colorScheme=='dark'?'white':'black'}}>Relatórios</Text>
                  <Text className={`text-slate-500`}>Informações sobre suas atividades no aplicativo.</Text>
                </TouchableOpacity>

                <View className={`flex-1 h-32 border-l border-r flex items-center`} style={{borderColor: colorScheme=='dark'?'white':'black'}}>
                  <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'black'}}/>
                  <Text style={{color: colorScheme=='dark'?'white':'black'}}>Distribuição de suas tarefas por coluna</Text>
                  <RatioGraph/>

                  <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'gray'}}/>
                  <Text style={{color: colorScheme=='dark'?'white':'black'}}>Tarefas realizadas por período de tempo</Text>
                  <DoneLineGraph theme={colorScheme=='dark'?'dark':'light'} />
                  <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'gray'}}/>

                </View>
                <View className={`w-full px-2 h-20 justify-center items-center border-x`} style={{borderColor: colorScheme=='dark'?'white':'black'}}>
                  <TouchableOpacity onPress={()=>{setGraphModal(false)}} className={`p-5 rounded-md border`} style={{borderColor: colorScheme=='dark'?'white':'gray'}}>
                    <Text style={{color: colorScheme=='dark'?'white':'black'}} className={`text-md`}>Voltar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            

          </Modal>

          <TouchableOpacity className={`w-[80%] border rounded-full flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: colorScheme=='dark' ? 'white' : 'gray'}}>
            <Text className={`text-lg`} style={{color: colorScheme=='dark' ? 'white' : 'black'}}> Confirmar conclusão</Text>
            <Feather name="thumbs-up" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
          </TouchableOpacity>


          <TouchableOpacity onPress={()=>{setGraphModal(true)}} className={`w-[80%] border rounded-full flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: colorScheme=='dark' ? 'white' : 'gray'}}>
            <Entypo name="bar-graph" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
          </TouchableOpacity>

        </View>
        



        <SetUserModal/> 
    </View>
  )
}

export default Main