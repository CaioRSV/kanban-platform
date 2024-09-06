import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";

import React, { SetStateAction } from "react";

import { Column, Task } from "../workspace";
import { arrayMove } from "@dnd-kit/sortable";

export function onDragStart(event: DragStartEvent, setCol: Function, setTask: Function){
    if(event.active.data.current?.type=="Column"){
        setCol(event.active.data.current.column)
        return;
    }

    if(event.active.data.current?.type=="Task"){
        setTask(event.active.data.current.task)
        return;
    }
}



export function onDragEnd(event: DragEndEvent, setCol: Function, setTask: Function, columns: Column[], setColumns: React.Dispatch<SetStateAction<Column[]>>, tasks:Task[], change2empty: Function){
    setCol(null);
    setTask(null);

    const {active, over} = event;

    // Verifica se está dando over em alguma coluna
    if (over){
        const activeColumnID = active.id;
        const overColumnID = over.id;

        const isActiveTask = active.data.current?.type == 'Task';
        const isOverTask = over.data.current?.type == 'Task';

        if(!isOverTask && isActiveTask){
            const overID = columns.find(col => col.id === overColumnID)?.id;
            const activeID = activeColumnID;
            if(overID){
                change2empty(overID, activeID, tasks.find(item => item.id == activeID));
            }
        }
        else if(!(activeColumnID === overColumnID)){ // Caso esteja dando over em alguma coluna diferente
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(col => col.id === activeColumnID);

                const overColumnIndex = columns.findIndex(col => col.id === overColumnID);

                return arrayMove(columns, activeColumnIndex, overColumnIndex)
            })
        }
        
        
    }
}


export function onDragOver(event: DragOverEvent, tasks: Task[], setTasks: React.Dispatch<SetStateAction<Task[]>>){
    const {active, over} = event;

    // Verifica se está dando over em alguma coluna
    if (over){
        const activeID = active.id;
        const overID = over.id;

        const isActiveTask = active.data.current?.type == 'Task';
        const isOverTask = over.data.current?.type == 'Task';
        
        if(isActiveTask && isOverTask){ // Está sendo "dropado" em outra task
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(item => item.id === activeID);
                const overIndex = tasks.findIndex(item => item.id === overID);

                if(tasks[activeIndex].columnId !== tasks[overIndex].columnId){
                    tasks[activeIndex].columnId = tasks[overIndex].columnId
                }

                return arrayMove(tasks, activeIndex, overIndex);
            })
        }
        
    }        
}
