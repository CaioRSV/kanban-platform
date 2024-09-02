"use client";
import React from 'react'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UserInterface {
    user: string,
    setUser : React.Dispatch<React.SetStateAction<string>>
    id: number,
    setId : React.Dispatch<React.SetStateAction<number>>,

    selectedColumn: string,
    setSelectedColumn: React.Dispatch<React.SetStateAction<string>>
    
    column1_name: string;
    setColumn1_name: React.Dispatch<React.SetStateAction<string>>
    column2_name: string;
    setColumn2_name: React.Dispatch<React.SetStateAction<string>>
    column3_name: string;
    setColumn3_name: React.Dispatch<React.SetStateAction<string>>

    column1: number[];
    setColumn1: React.Dispatch<React.SetStateAction<number[]>>
    column2: number[];
    setColumn2: React.Dispatch<React.SetStateAction<number[]>>
    column3: number[];
    setColumn3: React.Dispatch<React.SetStateAction<number[]>>;

    loadingTasks: boolean;
    setLoadingTasks: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlaceholderUser : UserInterface = {
    user : "", 
    setUser : () => {},
    id: -1,
    setId: () => {},

    selectedColumn: 'column1',
    setSelectedColumn: () => {},

    column1_name: "A fazer",
    setColumn1_name: () => {},
    column2_name: "Em progresso",
    setColumn2_name: () => {},
    column3_name: "Finalizadas",
    setColumn3_name: () => {},

    column1: [],
    setColumn1: () => {},

    column2: [],
    setColumn2: () => {},

    column3: [],
    setColumn3: () => {},

    loadingTasks: false,
    setLoadingTasks: () => {}
};

const userContext = createContext<UserInterface>(PlaceholderUser);

export const useUserContext = () => {
    const context = useContext(userContext);
    return context
};

interface ProviderProps {
    children: ReactNode;
}


export const ProviderUserContext: React.FC<ProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string>("");
    const [id, setId] = useState<number>(-1);

    const [selectedColumn, setSelectedColumn] = useState<string>("column1");

    const [column1_name, setColumn1_name] = useState<string>("A fazer");
    const [column2_name, setColumn2_name] = useState<string>("Em progresso");
    const [column3_name, setColumn3_name] = useState<string>("Finalizadas");

    const [column1, setColumn1] = useState<number[]>([]);
    const [column2, setColumn2] = useState<number[]>([]);
    const [column3, setColumn3] = useState<number[]>([]);

    const [loadingTasks, setLoadingTasks] = useState<boolean>(false);

    return (
        <userContext.Provider value={{ 
            user, setUser, 
            id, setId,
            selectedColumn, setSelectedColumn,
            column1_name, setColumn1_name, 
            column2_name, setColumn2_name,
            column3_name, setColumn3_name,
            column1, setColumn1,
            column2, setColumn2,
            column3, setColumn3,
            loadingTasks, setLoadingTasks
            }}>
            {children}
        </userContext.Provider>
    );
};