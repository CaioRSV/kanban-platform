"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

import { FaCheck } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { useUserContext } from './contexts/userContext';


const SaveColumns = () => {
    const {
        user, setUser, id, setId, 
        setColumn1_name, column1_name,
        setColumn2_name, column2_name,
        setColumn3_name, column3_name,
        setColumn1, column1,
        setColumn2, column2,
        setColumn3, column3,
    
        } = useUserContext();
        
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveColumns = async () => {
        const col1_params = `${column1.length> 0 ? `&column1=${column1.join(',')}` : ``}`;
        const col2_params = `${column2.length> 0 ? `&column2=${column2.join(',')}` : ``}`;
        const col3_params = `${column3.length> 0 ? `&column3=${column3.join(',')}` : ``}`;

        console.log(`/api/user/update?id=${id}${col1_params}${col2_params}${col3_params}`);

        await fetch(`/api/user/update?id=${id}${col1_params}${col2_params}${col3_params}`)
    }

    const handleSave = async () => {
        await saveColumns();

        setConfirmed(true);

        timeoutRef.current = setTimeout(() => {
            setConfirmed(false);
        }, 700);
    }

    useEffect(() => {
        return () => {
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    }, [])

    return (
        <div style={{filter: (!user || user.length==0) ? 'blur(3px)' : '', pointerEvents: (!user || user.length==0) ? 'none': 'all' }} className={`flex gap-2 h-full items-center`}>
            <div style={{opacity: confirmed ? 1 : 0}} className={`transition-opacity`}>
                <FaCheck className={``}/>
            </div>

            <Button variant={'outline'} onClick={handleSave} className={`transition-all`}
                style={{
                    borderColor: confirmed ? 'var(--foreground)' : ''
                }}>
                <p className={`font-semibold`}>Salvar</p>

                <FaRegSave className={`ml-2`} size={20} />
            </Button>
        </div>
    );
};

export default SaveColumns;
