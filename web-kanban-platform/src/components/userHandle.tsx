"use client"
import React from 'react'

import { FaRegLightbulb } from "react-icons/fa"; // Hollow
import { FaLightbulb } from "react-icons/fa"; // Full
import { CgArrowsExchangeAlt } from "react-icons/cg";

import { useUserContext } from '@/components/contexts/userContext';
import { ProviderUserContext } from '@/components/contexts/userContext';

import GithubHandle from '@/components/githubHandle';
import ThemeSwitch from '@/components/themeSwitch';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { useTheme } from 'next-themes';
import { useTaskContext } from './contexts/tasksContext';


const UserHandle = () => {

    const {setTasks} = useTaskContext();

    const {
        user, setUser, 
        id, setId, 
        column1_name, setColumn1_name, 
        column2_name, setColumn2_name, 
        column3_name, setColumn3_name,
        column1, setColumn1, 
        column2, setColumn2, 
        column3, setColumn3
      } = useUserContext();

    function logout(){
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
    <ContextMenu>
        <ContextMenuTrigger>
        <p className={`text-lg select-none border border-transparent hover:border-[rgba(125,125,125,0.25)] px-2 rounded-md transition-all`}>{user}</p>
        </ContextMenuTrigger>
        <ContextMenuContent>
        <ContextMenuItem onClick={()=>{logout()}}>
            <div className={`flex gap-1`}>
            <p>Mudar de usuário</p>
            <CgArrowsExchangeAlt size={20} />
            </div>
        </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  )
}

export default UserHandle