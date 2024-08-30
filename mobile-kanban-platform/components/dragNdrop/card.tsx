"use client";

import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'

import { Task, Id } from './workspace';

import { DndProvider, DndProviderProps, Draggable, Droppable } from "@mgcrea/react-native-dnd";



interface TaskCardProps{
    task: Task
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string, attribute?: string) => void;
}

const Card: React.FC<TaskCardProps> = ({task, deleteTask, updateTask}) => {

    const [editing, setEditing] = useState<boolean>(false);

    const [editingName, setEditingName] = useState<boolean>(false);

    const [tempName, setTempName] = useState<string>(task.name); 
    const [tempDesc, setTempDesc] = useState<string>(task.description ?? '');


    
    const switchEditing = () => {
        setEditing(prev => !prev);
    };



    if(task.id==0){
        return <></>;
    }

  return (
    <Draggable id={task.id.toString()} data={task}>
        <View className={`w-full p-2 border rounded-md`}>
            <Text>{task.name}</Text>
        </View>
    </Draggable>
  )
}

export default Card