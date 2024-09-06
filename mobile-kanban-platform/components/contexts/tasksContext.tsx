import React from 'react'

import { createContext, useContext, useState, ReactNode } from 'react'

import { Task, Id } from '../dragNdrop/workspace';

interface TaskInterface {
    tasks: Task[],
    setTasks : React.Dispatch<React.SetStateAction<Task[]>>
}

const PlaceholderTask : TaskInterface = {
    tasks : [], 
    setTasks : () => {},
};

const taskContext = createContext<TaskInterface>(PlaceholderTask);

export const useTaskContext = () => {
    const context = useContext(taskContext);
    return context
};

interface ProviderProps {
    children: ReactNode;
}

export const ProviderTaskContext: React.FC<ProviderProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    return (
        <taskContext.Provider value={{ 
            tasks, setTasks
        }}>
            {children}
        </taskContext.Provider>
    );
};