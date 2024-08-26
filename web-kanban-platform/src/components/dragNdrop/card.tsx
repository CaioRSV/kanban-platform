import React, {useState, useEffect} from 'react'

import { MdDragIndicator } from "react-icons/md";

import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

interface Task {
    id: number
    name?: string
    description?: string
    color?: string
    startDate?: Date
    endDate?: Date
    done: boolean
};

interface TaskCardProps{
    task: Task
}

const Card: React.FC<TaskCardProps> = ({task}) => {
    const { attributes, listeners, setNodeRef, transform, transition} = useSortable({id: task.id});

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

  return (
    <div ref={setNodeRef} 
        {...attributes} 
        {...listeners} 
        style={style}

        className={`flex-col rounded-md p-3 border`}
        >

        <div className={`w-full flex items-center`}>
            <div>
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