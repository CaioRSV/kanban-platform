"use client";
import React, { useState, useEffect } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog_v2"
  
  import { Input } from "@/components/ui/input"
  
  
  import { RiLoginCircleLine } from "react-icons/ri";
  import { ImSpinner8 } from "react-icons/im";

  import { useUserContext } from './contexts/userContext';

const SetUserModal = () => {
  const {
    user, setUser, id, setId, 
    setColumn1_name, setColumn2_name, setColumn3_name,
    setColumn1, setColumn2, setColumn3
  } = useUserContext();

  const [tempUserName, setTempUserName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

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
    }

    setLoading(false);
  }

  return (
    <>
        <AlertDialog open={!user || user.length==0}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                  <div className={`flex`}>
                    <p>Quem é você?</p>
                    <div className={`flex-1`}/>
                    {
                      loading
                        ?
                        <ImSpinner8 size={20} className={`animate-spin mr-1`}/>
                        :
                        <></>
                    }
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                Informe seu nome de usuário para acessar sua área de trabalho
                </AlertDialogDescription>

            </AlertDialogHeader>

            <div className={`w-full flex gap-2`}>
            
            <Input onBlur={(e)=>{setTempUserName(e.target.value)}} onKeyDown={(e)=>{if(e.key=='Enter'){setUserServer(e.currentTarget.value)} }}/>

            <AlertDialogFooter>
                <AlertDialogAction onClick={()=>{setUserServer(tempUserName)}}>
                <RiLoginCircleLine size={28} />   
                </AlertDialogAction>
            </AlertDialogFooter>

            </div>
            

            </AlertDialogContent>
        </AlertDialog>
    </>
  )
}

export default SetUserModal