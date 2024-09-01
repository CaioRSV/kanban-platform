"use client";

import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'

import AntDesign from '@expo/vector-icons/AntDesign';

import React, { useState, useEffect, useRef } from 'react'

import { useUserContext } from './contexts/userContext';
import { useTaskContext } from './contexts/tasksContext';

type Id = string | number;

export interface Task {
    id: number
    name: string
    columnId: Id,
    description?: string
    color?: string
    startDate?: Date
    endDate?: Date
    done?: boolean

    serverId: number
};


interface SetUserModalProps{
  theme: string;
}

const SetUserModal = (props: SetUserModalProps) => {
  const {
    user, setUser, id, setId, 
    setColumn1_name, 
    setColumn2_name, 
    setColumn3_name,
    setColumn1,
    setColumn2,
    setColumn3,
    setLoadingTasks
  } = useUserContext();

  const { tasks, setTasks } = useTaskContext();

  const [tempUserName, setTempUserName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  //
  

  async function updateInfoLocal(id: number[], col1:number[], col2:number[], col3:number[] ){
    setLoadingTasks(true); // Loading nas colunas

    const resFetch:Task[] = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/api/tasks?task="+id)
      .then(res => res.json())
      .then(data => data.resposta.rows);

    if(resFetch.length>0){

      setTasks(
        resFetch.map( (item:Task) =>({
          ...item,
          id: Math.floor(Math.random()*10000),
          columnId: 
            col1.includes(item.id) ? 1 : 
              col2.includes(item.id) ? 2 :
                col3.includes(item.id) ? 3 :
                0,
          name: item.name,
          serverId: item.id
        })
          )
      );
    }

    setLoadingTasks(false);
  }

  async function setUserServer(userName: string) {
    try {
      if (userName.length === 0) return;
  
      setLoading(true);
  
      const userRes = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + "/api/user?name=" + userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => data.resposta.rows)
      .catch(err => {
        setLoading(false);
        throw err;
      });
  
      if (userRes.length > 0) { 
        const userFound = userRes[0];
  
        setUser(userName);
        setId(userFound.id);
  
        if (userFound.column1_name !== null) setColumn1_name(userFound.column1_name);
        if (userFound.column2_name !== null) setColumn2_name(userFound.column2_name);
        if (userFound.column3_name !== null) setColumn3_name(userFound.column3_name);
  
        setColumn1(userFound.column1);
        setColumn2(userFound.column2);
        setColumn3(userFound.column3);
  
        let totalIDs: number[] = [];
  
        userFound.column1.forEach((elem: number) => totalIDs.push(elem));
        userFound.column2.forEach((elem: number) => totalIDs.push(elem));
        userFound.column3.forEach((elem: number) => totalIDs.push(elem));
  
        updateInfoLocal(totalIDs, userFound.column1, userFound.column2, userFound.column3);
  
      } else {
        const createUserRes = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + "/api/user/add?name=" + userName, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(data => data.resposta.id)
        .catch(err => {
          setLoading(false);
          throw err;
        });
  
        if (createUserRes !== undefined) {
          setUser(userName);
        }
  
        const userRes_2 = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + "/api/user?name=" + userName, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(data => data.resposta.rows)
        .catch(err => {
          setLoading(false);
          throw err;
        });
  
        const userFound_2 = userRes_2[0];
        setId(userFound_2.id);
      }
    } catch (err) {
      console.error('Different error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
        <Modal
        transparent={true}
        animationType="fade"
        visible={!user || user.length==0}>
            <View className={`w-full h-full flex justify-center p-4`} style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <View className={`${props.theme=='dark'?'bg-black':'bg-white'} p-4 flex gap-2 rounded-md`}>
                    <Text className={`text-lg font-semibold ${props.theme=='dark'?'text-white':'text-black'}`}>Quem é você?</Text>
                    <Text className={`mb-2 ${props.theme=='dark'?'text-white':'text-black'}`}>Informe seu nome de usuário para acessar sua área de trabalho</Text>
                    
                    <TextInput onChangeText={(e)=>{setTempUserName(e)}} className={`border m-2 text-lg p-2 rounded-md ${props.theme=='dark'?'border-white text-white':'border-black text-black'}`}></TextInput>
                    <TouchableOpacity className={`flex flex-row justify-center border rounded-full p-3 gap-2 items-center ${props.theme=='dark'?'border-white':'border-black'} `} onPress={()=>{setUserServer(tempUserName)}}>
                        <AntDesign name="login" size={32} color={`${props.theme=='dark'?'white':'black'}`} />
                    </TouchableOpacity>

                    {
                      loading && <View className={`w-full flex flex-row justify-center`}>
                        <ActivityIndicator size="small" color={props.theme=='dark'? 'white' : 'black'} />
                      </View>
                    }

                </View>
            </View>
        </Modal>
    </>
  )
}

export default SetUserModal