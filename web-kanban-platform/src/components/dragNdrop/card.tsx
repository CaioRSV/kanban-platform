import React, {useState} from 'react'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Id, Task } from './workspace';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Input } from '../ui/input';

import { MdDragIndicator } from "react-icons/md";
import { MdCircle } from "react-icons/md";
import { TbTextPlus } from "react-icons/tb";
import { GoTrash } from "react-icons/go";

interface TaskCardProps{
    task: Task
    deleteTask: (serverId: Id, localId: Id) => void;
    updateTask: (id: Id, content: string, attribute: string) => void;
}

const Card: React.FC<TaskCardProps> = ({task, deleteTask, updateTask}) => {
    // Temp vars
    const [editing, setEditing] = useState<boolean>(false);
    const [editingName, setEditingName] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>(task.name); 
    const [tempDesc, setTempDesc] = useState<string>(task.description ?? '');
    
    // Para fácil leitura
    const switchEditing = () => {
        setEditing(prev => !prev);
    };

    // Configs do Sortable
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
        disabled: editing
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    //

    if(task.id==0){
        return <></>;
    }

    if(editing){
        return(
            <div ref={setNodeRef} 
                {...attributes} 
                {...listeners} 
                style={style}
                className={`flex-col w-full rounded-md p-3 border`}
            >
                <div className={`w-full flex items-center`}>
                    <div>
                        <textarea
                            className={`h-[80%] w-full resize-none bg-transparent focus:outline-none`}
                            value={tempDesc}
                            onChange={(e)=>{setTempDesc(e.target.value)}}
                            onBlur={(e)=>{updateTask(task.id, tempDesc, "description");setEditing(false);}}
                        />
                    </div>

                    <div className={`flex-1`}></div>

                    <MdDragIndicator size={28} className={`text-[var(--background)]`} />
                </div>
            </div>
        )
    }

  return (
    <div ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            className={`flex flex-col items-center justify-center rounded-md p-3 border ${isDragging ? `opacity-50 border-2` : ``}`}
        >

        <ContextMenu>
            <ContextMenuTrigger className={`w-full flex items-center`}>
                <div className={`h-full flex flex-col justify-center mr-2`}>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <MdCircle size={12} style={{color: task.color}}/>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuLabel>Marcar prioridade por cor</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className={`bg-yellow-200 bg-opacity-50 mb-1`} onClick={()=>{updateTask(task.id, "rgb(254,240,138)", "color")}}>Não prioritária</DropdownMenuItem>
                            <DropdownMenuItem className={`bg-green-300 bg-opacity-50 mb-1`} onClick={()=>{updateTask(task.id, "rgb(134,239,172)", "color")}}>Comum</DropdownMenuItem>
                            <DropdownMenuItem className={`bg-green-500 bg-opacity-50 mb-1`} onClick={()=>{updateTask(task.id, "rgb(34,197,94)", "color")}}>Média</DropdownMenuItem>
                            <DropdownMenuItem className={`bg-orange-500 bg-opacity-50 mb-1`} onClick={()=>{updateTask(task.id, "rgb(249,115,22)", "color")}}>Importante</DropdownMenuItem>
                            <DropdownMenuItem className={`bg-red-500 bg-opacity-50`} onClick={()=>{updateTask(task.id, "rgb(239,68,68)", "color")}}>Prioritária</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div>
                    {
                        editingName
                            ?
                            <Input className={``} 
                                value={tempName}
                                onChange={(e)=>{setTempName(e.target.value)}}
                                onBlur={()=>{updateTask(task.id, tempName, "name");setEditingName(false);}}
                                autoFocus
                                onKeyDown={(e)=>{
                                    if(e.key=='Enter'){
                                        updateTask(task.id, tempName, "name")
                                        setEditingName(false);
                                    }
                                }}
                            />
                            :
                            <p className={`select-none font-medium`} onClick={()=>{setEditingName(true)}}>{task.name.length<48 ? task.name : task.name.slice(0,45)+"..."}</p>
                    }
                    {
                        task.description && task.description.length>0
                            ?
                            <p className={`select-none`} onClick={switchEditing}>{task.description ? task.description.length>18 ? task.description.slice(0,15)+"..." : task.description : ''}</p>
                            :
                            <TbTextPlus onClick={()=>{switchEditing()}} size={26} className={`p-1`}/>

                    }
                    
                </div>

                <div className={`flex-1`}/>
                
                <MdDragIndicator size={28} className={`text-[var(--background)]`} />
            </ContextMenuTrigger>

        
            <ContextMenuContent>
                <ContextMenuItem onClick={()=>{deleteTask(task.serverId, task.id)}}>
                    <div className={`flex gap-2`}>
                        <p>Excluir tarefa</p>
                        <GoTrash size={16} />
                    </div>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    </div>
  )
}

export default Card