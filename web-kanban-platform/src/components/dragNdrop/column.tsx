import React, { useState, useEffect, useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable} from '@dnd-kit/sortable';
import Card from './card';

import { Task } from './workspace';

import {CSS} from "@dnd-kit/utilities";

import { Column } from './workspace';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { MdDragHandle } from "react-icons/md";


type Id = string | number;


interface TaskColumnProps {
    column: Column;
    tasks: Task[];

    updateColumn: (id: Id, title: string) => void;
    addTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const ColumnElement: React.FC<TaskColumnProps> = ({ column, tasks, updateColumn, addTask, deleteTask, updateTask}) => {

    const tasksId = useMemo(() => tasks.map(task=>task.id), [tasks]);

    const [editing, setEditing] = useState<boolean>(false);

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
            className="p-4 rounded-md w-full h-full flex flex-col gap-2 bg-[var(--background)] border border-[var(--foreground)]"
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
                            value={column.title}
                            onChange={(e => updateColumn(column.id, e.target.value))} // Alterando nome
                            autoFocus 
                            onBlur={()=>{setEditing(false)}} 
                            onKeyDown={(e)=>{e.key=='Enter'?setEditing(false):<></>}}
                            className={`outline-none`}        
                        />
                }
             </div>

            <div className={`h-[1px] w-full bg-white opacity-50`}/>
            <SortableContext items={[]} strategy={verticalListSortingStrategy}>
                <div className={`min-h-[300px] h-full flex flex-col`}>


                    <div className={`flex-1 flex flex-col gap-2 overflow-scroll`}>
                        <SortableContext items={tasksId}>
                        {
                            tasks.map((task) => (
                                <Card task={task} key={task.id} 
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                ></Card>
                            ))   
                        }
                        </SortableContext>                     
                    </div>

                    <div className={`w-full flex justify-center items-center`}>
                        <Button variant="outline" className={`rounded-full w-32`}
                            onClick={()=>{
                                addTask(column.id)
                            }}
                        >+</Button>
                    </div>
                </div>
            </SortableContext>
        </div>
    );
};

export default ColumnElement;
