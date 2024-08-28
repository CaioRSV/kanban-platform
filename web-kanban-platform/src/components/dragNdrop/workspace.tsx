"use client";

import React, { useState, useEffect, useMemo } from 'react'

import { DndContext, closestCorners, 
    useSensor, useSensors, 
    PointerSensor, 
    TouchSensor, 
    KeyboardSensor,
    DragStartEvent,
    DragOverlay,
    DragEndEvent,
    DragOverEvent
} from '@dnd-kit/core';

import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import ColumnElement from './column';
import { createPortal } from 'react-dom';
import Card from './card';
import { useUserContext } from '../contexts/userContext';

type Id = string | number;


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
};


const Workspace = () => {
    
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
    
    const columnsId = useMemo(() => columns.map(col=>col.id), [columns]);

    //

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeTask , setActiveTask] = useState<Task | null>();

    //

    const [activeColumn , setActiveColumn] = useState<Column | null>();


    function createNewColumn() {
        const columnToAdd: Column = {   
            id: Math.floor(Math.random()*10000),
            title: `Column ${columns.length+1}`
        };

        setColumns([...columns, columnToAdd]);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 100 // Distância de ativação do drag, tem que puxar uma quantidade pixels pra ele sair do lugar
            }
        }),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function onDragStart(event: DragStartEvent){
        if(event.active.data.current?.type=="Column"){
            setActiveColumn(event.active.data.current.column)
            return;
        }

        if(event.active.data.current?.type=="Task"){
            setActiveTask(event.active.data.current.task)
            return;
        }

    }

    function onDragEnd(event: DragEndEvent){

        setActiveColumn(null);
        setActiveTask(null);

        const {active, over} = event;

        // Verifica se está dando over em alguma coluna
        if (over){
            const activeColumnID = active.id;
            const overColumnID = over.id;

            const isActiveTask = active.data.current?.type == 'Task';
            const isOverTask = over.data.current?.type == 'Task';

            if(!isOverTask && isActiveTask){
                const overID = columns.findIndex(col => col.id === overColumnID)+1;
                const activeID = activeColumnID;
                changeToEmptyColumn(overID, activeID);
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

        fetch("/api/user/update"+paramStack);
    }

    function updateColumn(id: Id, title: string){
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

    function addTask(columnId: Id){
        
        let newId =  Math.floor(Math.random()*10000);

        const newTask: Task = {
            id: newId,
            name: "Nova tarefa",
            columnId: columnId
        }
        setTasks([...tasks, newTask]);

    }

    function deleteTask(id: Id){
        const newTasks = tasks.filter(task => task.id != id);
        setTasks(newTasks);
    }

    function sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function changeToEmptyColumn(overColumnID: Id, activeTaskID: Id){
        
        const newTasks = tasks.filter(task => task.id != activeTaskID);

        const newTask: Task = {
            id: typeof activeTaskID ==='number' ? activeTaskID : Math.floor(Math.random()*10000),
            name: "Nova tarefa",
            columnId: typeof overColumnID ==='number'? overColumnID : Math.floor(Math.random()*10000)
        }

        setTasks([...newTasks, newTask]);
    }

    function updateTask(id: Id, content: string){
        const newTasks = tasks.map((task) => {
            if(task.id === id && content.length>0){
                return {...task, description:content}
            }
            else{
                return task;
            }
        });

        setTasks(newTasks);  
    }

    function onDragOver(event: DragOverEvent){
        const {active, over} = event;

        // Verifica se está dando over em alguma coluna
        if (over){
            const activeID = active.id;
            const overID = over.id;

            const isActiveTask = active.data.current?.type == 'Task';
            const isOverTask = over.data.current?.type == 'Task';
            
            // TODO: Ajeitar BUG envolvendo dropar em colunas vazias

            if(isActiveTask && isOverTask){ // Ta dropando em outra task
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

    // useEffect(() => {
    //     console.log(tasks);
    // }, [tasks]);

    return (
        <DndContext onDragStart={onDragStart} sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <SortableContext items={columnsId}>
                {
                    columns.map(col => (
                        <div key={col.id} className={`flex-1 h-[500px]`}>
                            <ColumnElement column={col} 
                                updateColumn={updateColumn} 
                                addTask={addTask} 
                                tasks={tasks.filter(item => item.columnId == col.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                />
                        </div>
                    ))
                }
            </SortableContext>

            {
                (typeof window === 'object')
                    ?
                    createPortal(
                        <DragOverlay>
                            {activeColumn
                                ?
                                <ColumnElement column={activeColumn} 
                                        updateColumn={updateColumn} 
                                        addTask={addTask}
                                        tasks={tasks.filter(item => item.columnId == activeColumn.id)}
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
                    :
                    <></>
            }
            

        </DndContext>
    )
}

export default Workspace