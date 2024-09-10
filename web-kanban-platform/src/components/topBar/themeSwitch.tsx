"use client";

import React, { useState, useEffect } from 'react'

import { useTheme } from 'next-themes';

import { Switch } from "@/components/ui/switch"

import { FaRegDotCircle } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";

const ThemeSwitch = () => {
  const {theme, setTheme} = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  // Caso ainda não tenha terminado o mount, mostra uma animação indicativa disso
  if (!mounted) {
    return <>
        <FaRegDotCircle size={30} className={`animate-ping`} /> 
      </>;
  }

  return (
    <div className={`flex gap-2`} >
        <FaRegLightbulb size={20} className={`text-slate-600`}/>
        <Switch checked={theme=='light'} onCheckedChange={()=>{setTheme(theme=='light'?'dark':'light')}}/>
    </div>
  )
}

export default ThemeSwitch