"use client";

import React, { useState, useEffect } from 'react'

import { useTheme } from 'next-themes';

import { Switch } from "@/components/ui/switch"

import { FaRegDotCircle } from "react-icons/fa";

const ThemeSwitch = () => {
  const {resolvedTheme, theme, setTheme} = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>
        <FaRegDotCircle size={30} className={`animate-ping`} />
      </>;
  }


  return (
    <div>
        <Switch checked={theme=='light'} onCheckedChange={()=>{setTheme(theme=='light'?'dark':'light')}}/>
    </div>
  )
}

export default ThemeSwitch