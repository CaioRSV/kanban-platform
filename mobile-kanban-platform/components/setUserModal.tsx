"use client";

import { View, Text, Modal, TextInput, TouchableOpacity} from 'react-native'

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


const SetUserModal = () => {
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

    const resFetch:Task[] = await fetch("/api/tasks?task="+id)
      .then(res => res.json())
      .then(data => data.resposta.rows);

    if(resFetch.length>0){

      console.log(resFetch.map( (item:Task) =>({
        ...item,
        id: Math.floor(Math.random()*10000),
        columnId: 1,
        name: item.name,
        serverId: item.id
      })))


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

  async function setUserServer(userName:string){

    if(userName.length==0) return;

    setLoading(true);

    const userRes = await fetch("/api/user?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => data.resposta.rows);

    if(userRes.length>0){ // Fetch no banco (existente)
      const userFound = userRes[0];

      setUser(userName);
      setId(userFound.id);

      if(userFound.column1_name !== null) setColumn1_name(userFound.column1_name);
      if(userFound.column2_name !== null) setColumn2_name(userFound.column2_name);
      if(userFound.column3_name !== null) setColumn3_name(userFound.column3_name);

      setColumn1(userFound.column1);
      setColumn2(userFound.column2);
      setColumn3(userFound.column3);

      let totalIDs:number[] = []

      userFound.column1.forEach((elem:number) => {
        totalIDs.push(elem)
      });

      userFound.column2.forEach((elem:number) => {
        totalIDs.push(elem)
      });

      userFound.column3.forEach((elem:number) => {
        totalIDs.push(elem)
      });

      updateInfoLocal(totalIDs, userFound.column1, userFound.column2, userFound.column3);

    }
    else{
      const createUserRes = await fetch("/api/user/add?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => {
        return data.resposta.id
      });

      if(createUserRes != undefined){
        setUser(userName);
      }

      const userRes_2 = await fetch("/api/user?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => data.resposta.rows);
  
      const userFound_2 = userRes_2[0];
  
      setId(userFound_2.id);

    }

    setLoading(false);

  }

  return (
    <>
        <Modal
        transparent={true}
        animationType="fade"
        visible={!user || user.length==0}>
            <View className={`w-full h-full flex justify-center bg-[rgba(0 0 0 0.5)] p-4`}>
                <View className={`bg-white p-4 flex gap-2 rounded-md`}>
                    <Text className={`text-lg font-semibold`}>Quem é você?</Text>
                    <Text className={`mb-2`}>Informe seu nome de usuário para acessar sua área de trabalho</Text>
                    <TextInput onChangeText={(e)=>{setTempUserName(e)}} className={`border m-2 text-lg p-2`}></TextInput>
                    <TouchableOpacity className={`flex flex-row justify-center border rounded-full p-3 gap-2 items-center`} onPress={()=>{setUser(tempUserName)}}>
                        <AntDesign name="login" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </>
  )
}

export default SetUserModal