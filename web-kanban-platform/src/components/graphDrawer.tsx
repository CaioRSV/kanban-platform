"use client";
import React from 'react'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

import { Button } from "@/components/ui/button";

import RatioGraph from "@/components/ratioGraph";

import { useUserContext } from './contexts/userContext';


const GraphDrawer = () => {
  const {
    column1, column1_name,
    column2, column2_name,
    column3, column3_name
  } = useUserContext();
  
  return (
    <div>

    <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent className={`h-[95vh]`}>
        <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className={`w-full h-full flex justify-center`}>
            <RatioGraph series={[column1.length, column2.length, column3.length]} labels={[column1_name, column2_name, column3_name]} />
        </div>
        <DrawerClose>
            <Button variant="outline">Cancel</Button>
        </DrawerClose>
    </DrawerContent>
    </Drawer>

    </div>
  )
}

export default GraphDrawer