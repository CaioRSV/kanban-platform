"use client";
import React from 'react'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UserInterface {
    user: string,
    setUser : React.Dispatch<React.SetStateAction<string>>
}

const PlaceholderUser : UserInterface = {
    user : "", 
    setUser : () => {}
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
    return (
        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    );
};