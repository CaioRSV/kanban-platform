"use client";
import React from 'react'


import { FaRegLightbulb } from "react-icons/fa"; // Hollow
import { FaLightbulb } from "react-icons/fa"; // Full
import { useUserContext } from '@/components/contexts/userContext';
import { ProviderUserContext } from '@/components/contexts/userContext';

import GithubHandle from '@/components/githubHandle';
import ThemeSwitch from '@/components/themeSwitch';

import { useTheme } from 'next-themes';

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

    const {resolvedTheme, theme, setTheme} = useTheme();

  return (
    <div className={`w-[80%] flex justify-center items-center gap-2`}>       
        <GithubHandle/>
        <div className={`flex-1 flex justify-center items-center`} onClick={()=>{
          console.log([user, id, column1_name, column2_name, column3_name, column1, column2, column3]);
        }}>
        {user}
        </div>
        <FaRegLightbulb size={20} className={`text-slate-600`} onChange={()=>{setTheme('dark')}}/>
        <ThemeSwitch/>
    </div>
  )
}

export default TopBar