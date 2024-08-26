import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './card';

interface Task {
    id: number;
    name?: string;
    description?: string;
    color?: string;
    startDate?: Date;
    endDate?: Date;
    done: boolean;
};

interface TaskColumnProps {
    name?: string;
    tasks: Task[];
}

const Column: React.FC<TaskColumnProps> = ({ name, tasks }) => {
    return (
        <div className="p-4 rounded-md w-full h-full flex flex-col gap-2 bg-[var(--background)] border border-[var(--foreground)]">
            <p className={`font-semibold`}>{name}</p>


            
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {
                    tasks.map((task) => (
                        <Card task={task} key={task.id}></Card>
                    ))   
                }

            </SortableContext>
        </div>
    );
};

export default Column;
