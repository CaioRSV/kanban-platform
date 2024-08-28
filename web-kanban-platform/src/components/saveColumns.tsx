"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

import { FaCheck } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";


const SaveColumns = () => {
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSave = () => {
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
        <div className={`flex gap-2 h-full items-center`}>
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
