"use client";
import { DndProvider, DndProviderProps, Draggable, Droppable } from "@mgcrea/react-native-dnd";
import type { FunctionComponent } from "react";
import {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from "react-native";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";

export type Id = number;


export interface Column {
    id: Id;
    title: string;
}

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


export const Workspace: FunctionComponent = () => {
  const [teste, setTeste] = useState<any>();

  const handleDragEnd: DndProviderProps["onDragEnd"] = ({ active, over }) => {
    "worklet";
    if (over) {
      console.log("onDragEnd", { active, over });
      if(active.data){
        console.log(active.data.value)
        setTeste(active.data.value);
      }
    }
  };

  const handleBegin: DndProviderProps["onBegin"] = () => {
    "worklet";
    console.log("onBegin");
  };

  const handleFinalize: DndProviderProps["onFinalize"] = ({ state }) => {
    "worklet";
    console.log("onFinalize");
    if (state !== State.FAILED) {
      console.log("onFinalize");
    }
  };

  return (
    <SafeAreaView>
      <GestureHandlerRootView>
        <Button title="TSSS" onPress={()=>{console.log(teste)}}></Button>
        <DndProvider onBegin={handleBegin} onFinalize={handleFinalize} onDragEnd={handleDragEnd}>
          <Droppable id="drop">
            <Text>DROP</Text>
          </Droppable>
          <Draggable id="drag">
            <Text>DRAG</Text>
          </Draggable>
        </DndProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};