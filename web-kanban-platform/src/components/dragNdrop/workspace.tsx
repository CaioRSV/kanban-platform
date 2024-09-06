"use client";

import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';

import { useUserContext } from '../contexts/userContext';
import { useTaskContext } from '../contexts/tasksContext';

import ColumnElement from './column';
import Card from './card';


import { DndContext, closestCorners, 
    useSensor, useSensors, 
    PointerSensor, 
    TouchSensor, 
    DragOverlay,
} from '@dnd-kit/core';

import { SortableContext } from '@dnd-kit/sortable';

// Importando funções DND utilizadas
import { onDragStart } from './functions/dnd_functions';
import { onDragEnd } from './functions/dnd_functions';
import { onDragOver } from './functions/dnd_functions';

// Types

export type Id = string | number;


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

//

const Workspace = () => {
    // Contextos
    const {
        id,
        setColumn1_name, column1_name,
        setColumn2_name, column2_name,
        setColumn3_name, column3_name,
        column1,
        column2,
        column3,
    } = useUserContext();

    const {tasks, setTasks} = useTaskContext();

    // Colunas (locais)
    
    const [columns, setColumns] = useState<Column[]>([
        {
            id: 1,
            title: column1_name
        },
        {
            id: 2,
            title: column2_name
        },
        {
            id: 3,
            title: column3_name
        }
    ]);

    // Populando colunas com nomes recebidos do back on mount

    useEffect(()=>{
        setColumns([
            {
                id: 1,
                title: column1_name
            },
            {
                id: 2,
                title: column2_name
            },
            {
                id: 3,
                title: column3_name
            }
        ]);
    }, [column1_name, column2_name, column3_name])
    
    const columnsId = useMemo(() => columns.map(col=>col.id), [columns]); // Mapeando cada ID de colunas


    const [activeTask , setActiveTask] = useState<Task | null>(); // Info task de interação atual
    const [activeColumn , setActiveColumn] = useState<Column | null>(); // Info coluna de interação atual


    // Delimitando comportamentos de sensores do dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 100 // Distância de ativação do drag, tem que puxar uma quantidade pixels pra ele sair do lugar
            }
        }),
        useSensor(TouchSensor)
    )


    function updateColumn_Server(columnId: Id, title:string){
        let paramStack = `?id=${id}`
        if(columnId==1){
            setColumn1_name(title);
            paramStack += `&column1_name=${title}`
        }
        else if(columnId==2){
            setColumn2_name(title);
            paramStack += `&column2_name=${title}`
        }
        else if(columnId==3){
            setColumn3_name(title);
            paramStack += `&column3_name=${title}`
        }

        paramStack += `${column1.length> 0 ? `&column1=${column1.join(',')}` : ``}`;
        paramStack += `${column2.length> 0 ? `&column2=${column2.join(',')}` : ``}`;
        paramStack += `${column3.length> 0 ? `&column3=${column3.join(',')}` : ``}`;

        fetch("/api/user/update"+paramStack);
    }

    function updateColumn(id: Id, title: string){
        if(!title || title.length==0) return;

        const newColumns = columns.map(col => {
            if(col.id !== id){ // Não muda as que não são as referidas
                return col
            }
            else{ // Alterando a especificada
                updateColumn_Server(id, title);
                return {...col, title};

            }
        })

        setColumns(newColumns);
    }

    async function addTask(columnId: Id, definedObject?: Task){
        if(definedObject){
            if(!tasks.find(item => item.serverId == definedObject.id)){
                setTasks([...tasks, definedObject]);
            }
        }
        else{
            let newId =  Math.floor(Math.random()*10000);

            const res = await fetch(`/api/tasks/add?user=${id}&name=${'Nova tarefa'}&description=${''}`)
                .then(res => res.json())
                .then(data => data.resposta.id);

            const newTask: Task = {
                id: newId,
                name: "Nova tarefa",
                columnId: columnId,
                serverId: parseInt(res)
            }

            setTasks([...tasks, newTask]);

        }

    }

    function deleteTask(id: Id){
        const newTasks = tasks.filter(task => task.id != id);
        setTasks(newTasks);
    }

    async function changeToEmptyColumn(overColumnID: Id, activeTaskID: Id, definedObject?: Task){
        const newTasks = tasks.filter(task => task.id != activeTaskID);

        const newTask: Task = {
            id: typeof activeTaskID ==='number' ? activeTaskID : Math.floor(Math.random()*10000),
            name: definedObject?.name ?? "Nova tarefa",
            columnId: typeof overColumnID ==='number'? overColumnID : Math.floor(Math.random()*10000),
            description: definedObject?.description ?? '',
            color: definedObject?.color,
            startDate: definedObject?.startDate,
            endDate: definedObject?.endDate,
            serverId: definedObject?.serverId ?? 0
        }

        setTasks([...newTasks, newTask]);
    }

    function updateTask(localId: Id, content: string, attribute?: string){

        const serverId_chosen = tasks.find(item => item.id==localId)?.serverId

        const newTasks = tasks.map((task) => {
            if(task.id === localId && content.length>0){
                fetch(`/api/tasks/update?id=${serverId_chosen}&${attribute ? attribute : 'description'}=`+content)
                
                if (attribute == 'name'){
                    return {...task, name:content}
                }
                else if (attribute == 'color'){
                    return {...task, color:content}
                }
                else{
                    return {...task, description:content}
                }
            }
            else{
                return task;
            }
        });

        setTasks(newTasks);  
    }

    return (
        <DndContext 
            onDragStart={(e)=>{onDragStart(e,setActiveColumn, setActiveTask)}} 
            onDragEnd={(e)=>{onDragEnd(e, setActiveColumn, setActiveTask, columns, setColumns, tasks, changeToEmptyColumn)}}
            onDragOver={(e)=>{onDragOver(e, tasks, setTasks)}}
            sensors={sensors} collisionDetection={closestCorners}
        >
            <SortableContext items={columnsId}>
                {
                    columns.map(col => (
                        <div key={col.id} className={`flex-1 h-[500px]`}>
                            <ColumnElement column={col} 
                                updateColumn={updateColumn} 
                                addTask={addTask} 
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                />
                        </div>
                    ))
                }
            </SortableContext>
            

            {
                typeof window === 'object' && 
                    createPortal(
                        <DragOverlay>
                            {activeColumn
                                ?
                                <ColumnElement column={activeColumn} 
                                        updateColumn={updateColumn} 
                                        addTask={addTask}
                                        deleteTask={()=>{deleteTask(activeColumn.id)}}
                                        updateTask={updateTask}
                                        />
                                :
                                <></>
                            }
                            {
                                activeTask
                                    ?
                                    <Card task={activeTask}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                        />
                                    :
                                    <></>
                            }
                        </DragOverlay>, document.body
                    )
            }
        </DndContext>
    )
}

export default Workspace