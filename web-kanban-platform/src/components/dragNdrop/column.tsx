"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable} from '@dnd-kit/sortable';
import Card from './card';

import { Task } from './workspace';

import {CSS} from "@dnd-kit/utilities";

import { Column } from './workspace';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { MdDragHandle } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import FinishColumn from '../finishColumn';
import { useUserContext } from '../contexts/userContext';
import { useTaskContext } from '../contexts/tasksContext';


type Id = string | number;


interface TaskColumnProps {
    column: Column;

    updateColumn: (id: Id, title: string) => void;
    addTask: (columnId: Id, definedObject?: Task) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string, attribute?: string) => void;
}

const ColumnElement: React.FC<TaskColumnProps> = ({ column, updateColumn, addTask, deleteTask, updateTask}) => {

    const {tasks, setTasks} = useTaskContext();

    const tasksId = useMemo(() => tasks.map(task=>task.id), [tasks]);

    const [editing, setEditing] = useState<boolean>(false);

    const [tempColName, setTempColName] = useState<string>(column.title);

    const {
    user, setUser, id, setId, 
    setColumn1_name, column1_name,
    setColumn2_name, column2_name,
    setColumn3_name, column3_name,
    setColumn1, column1,
    setColumn2, column2,
    setColumn3, column3,

    } = useUserContext();

    useEffect(() => {
        if(column.id==1){
            setTempColName(column1_name);
        }
        else if (column.id==2){
            setTempColName(column2_name);
        }
        else if(column.id==3){
            setTempColName(column3_name);
        }
    }, [column1_name, column2_name, column3_name]);


    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editing // Desativa quando tiver editando o nome
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    function updateLocalColumns() {
        //tasksLocal
    }

    useEffect(()=>{
        updateLocalColumns();
        setColumn1(
            (tasks.filter(item => item.columnId==1)).map(elem => elem.serverId)
        )

        setColumn2(
            (tasks.filter(item => item.columnId==2)).map(elem => elem.serverId)
        )

        setColumn3(
            (tasks.filter(item => item.columnId==3)).map(elem => elem.serverId)
        )
    }, [tasks])


    // Estilo quando a coluna estiver sendo movida
    if(isDragging){
        return(
            <div ref={setNodeRef} style={style} 
            className="opacity-50 border-emerald-700 p-4 rounded-md w-full h-full flex flex-col gap-2 bg-[var(--background)] border border-[var(--foreground)]"/>
        );
    }

    return (
        <div ref={setNodeRef}
            style={style}
            className="p-4 rounded-md max-w-full h-full flex flex-col gap-2 bg-[var(--background)] border border-[var(--foreground)]"
        >
            <div
            {...attributes} {...listeners} onClick={()=>{setEditing(true)}}
                className={`font-semibold`}>
                {
                    !editing
                        ?
                        <div className={`flex items-center`}>
                            <p>{column.title}</p>
                            <div className={`flex-1`}/>
                            <MdDragHandle size={26} className={`pb-1`} />
                        </div>
                        
                        :
                        <Input 
                            value={tempColName}
                            onChange={(e => setTempColName(e.target.value))} // Alterando nome
                            autoFocus 
                            onBlur={(e)=>{updateColumn(column.id, tempColName);setEditing(false)}} 
                            onKeyDown={(e)=>{e.key=='Enter'?()=>{
                                updateColumn(column.id, tempColName);
                                setEditing(false);
                            }:<></>}}
                            className={`outline-none`}        
                        />
                }
             </div>

            <div className={`h-[1px] w-full bg-white opacity-50`} onClick={()=>{}}/>

            <SortableContext items={[]} strategy={verticalListSortingStrategy}>
                <div className={`min-h-[300px] h-full flex flex-col`}>


                    <div className={`flex-1 flex flex-col gap-2 overflow-scroll`}>
                        <SortableContext items={tasksId}>
                        {
                            tasks.filter(item=>(typeof item.columnId == 'number' ? item.columnId : 0) == column.id).map((task) => (
                                <Card task={task} key={task.id} 
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                ></Card>
                            ))   
                        }
                        </SortableContext>                     
                    </div>

                    <div className={`w-full flex justify-center items-center gap-4`}>
                        <Button variant="outline" className={`rounded-full w-32`}
                            onClick={()=>{
                                addTask(column.id)
                            }}
                        >
                            <IoMdAdd size={20}/>
                        </Button>

                        {
                            column.id == 3
                                ?
                                <FinishColumn/>
                                :
                                <></>

                        }


                    </div>
                </div>
            </SortableContext>
        </div>
    );
};

export default ColumnElement;
