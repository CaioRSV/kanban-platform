import { View, Text, Button, Switch, TouchableOpacity} from 'react-native'
import React from 'react'

import { useUserContext } from "../components/contexts/userContext";
import { useTaskContext } from "../components/contexts/tasksContext";

import SetUserModal from './setUserModal';

import { useTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Workspace from './dragNdrop/workspace';



const Main = () => {

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
    <View className={`h-full w-full dark:bg-black p-8`}>
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

        <TouchableOpacity className={`border rounded-md flex flex-row gap-2 justify-center items-center m-4 p-4`}>
              <Text className={`text-lg`}>Salvar</Text>
              <FontAwesome5 name="save" size={24} color="black" />
        </TouchableOpacity>

        <View className={`h-full w-full flex justify-center items-center`}>


          <Text adjustsFontSizeToFit className={`text-blue-300`}>{user}</Text>
          <Text className={`text-green-800`}></Text>

          <Workspace></Workspace>


              
        </View>

        <SetUserModal/> 
    </View>
  )
}

export default Main