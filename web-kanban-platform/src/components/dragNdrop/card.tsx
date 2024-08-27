import React, {useState, useEffect} from 'react'

import { MdDragIndicator } from "react-icons/md";
import { IoRemove } from "react-icons/io5";

import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { Task } from './workspace';

//<MdDragIndicator size={28} className={`text-[var(--background)]`} />
type Id = string | number;

interface TaskCardProps{
    task: Task
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const Card: React.FC<TaskCardProps> = ({task, deleteTask, updateTask}) => {
    const [editing, setEditing] = useState<boolean>(false);
    
    const switchEditing = () => {
        setEditing(prev => !prev);
    };

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
                    <IoRemove size={32} className={`text-red-800 pr-2`} onClick={()=>{deleteTask(task.id)}}/>

                    <div>
                        <textarea
                            className={`h-[80%] w-full resize-none bg-transparent focus:outline-none`}
                            value={task.description}
                            onBlur={()=>{switchEditing()}}
                            onChange={(e)=>{updateTask(task.id, e.target.value)}}
                        >

                        </textarea>
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
        className={`flex-col rounded-md p-3 border ${isDragging ? `opacity-50` : ``}`}
        >

        <div className={`w-full flex items-center`}>
            <IoRemove size={32} className={`text-red-800 pr-2`} onClick={()=>{deleteTask(task.id)}}/>

            <div onClick={switchEditing}>
                <p>{editing}</p>
                <p>{task.name}</p>
                <p>{task.id}</p>
                <p>{task.color ?? ''}</p>
                <p>{task.description  ?? ''}</p>
                <p>{task.done}</p>
            </div>
            <div className={`flex-1`}></div>
            <MdDragIndicator size={28} className={`text-[var(--background)]`} />
        </div>


    </div>
  )
}

export default Card