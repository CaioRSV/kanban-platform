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

  import { useUserContext } from './contexts/userContext';

const SetUserModal = () => {
  const {user, setUser} = useUserContext();
  const [tempUserName, setTempUserName] = useState<string>("");

  return (
    <>
        <AlertDialog open={!user || user.length==0}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Quem é você?</AlertDialogTitle>
                <AlertDialogDescription>
                Informe seu nome de usuário para acessar sua área de trabalho
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className={`w-full flex gap-2`}>
            
            <Input onBlur={(e)=>{setTempUserName(e.target.value)}}/>

            <AlertDialogFooter>
                <AlertDialogAction onClick={()=>{setUser(tempUserName)}}>
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