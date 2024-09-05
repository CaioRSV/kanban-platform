"use client";

import { View, Text, TouchableOpacity, Linking, Switch } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons';

import { useColorScheme } from 'nativewind';
import { useUserContext } from '../contexts/userContext';
import { useTaskContext } from '../contexts/tasksContext';

const TopBar = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    const {
        user, setUser, setId, 
        setColumn1_name, 
        setColumn2_name, 
        setColumn3_name,
        setColumn1,
        setColumn2, 
        setColumn3, 
      } = useUserContext();

    const {setTasks} = useTaskContext();

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

  return (
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
  )
}

export default TopBar