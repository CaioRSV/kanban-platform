"use client";
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

const TopBar = () => {
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

  const {setTasks} = useTaskContext();

    const {resolvedTheme, theme, setTheme} = useTheme();

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
    <div className={`w-[80%] flex justify-center items-center gap-2`}>       
        <GithubHandle/>
        <div className={`flex-1 flex justify-center items-center`} onClick={()=>{
          console.log([user, id, column1_name, column2_name, column3_name, column1, column2, column3]);
        }}>
          <ContextMenu>
            <ContextMenuTrigger>
              <p className={`text-lg select-none border border-transparent hover:border-[rgba(125,125,125,0.25)] px-2 rounded-md transition-all duration-300`}>{user}</p>
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
          
        </div>
        <FaRegLightbulb size={20} className={`text-slate-600`} onChange={()=>{setTheme('dark')}}/>
        <ThemeSwitch/>
    </div>
  )
}

export default TopBar