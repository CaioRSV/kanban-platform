"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

import { FaCheck } from "react-icons/fa6";
import { CiSaveUp1 } from "react-icons/ci";


const FinishColumn = () => { 
    const [finish, setFinish] = useState<boolean>(false);
    const [timePress, setTimePress] = useState<number | null>(null);
    const [counterTime, setCounterTime] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const delay = 2000;

    const clearExistingInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const clearExistingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const mouseDown = () => {
        if (finish) {
            setFinish(false);
        }
        const startTime = Date.now();
        setTimePress(startTime);

        clearExistingInterval();
        clearExistingTimeout();

        intervalRef.current = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const percentage = (elapsedTime / delay) * 100;
            setCounterTime(Math.min(percentage, 100));

            if (elapsedTime >= delay) {
                setFinish(true);
                clearExistingInterval();

                timeoutRef.current = setTimeout(() => {
                    setFinish(false);
                    setCounterTime(0);
                }, 700);
            }
        }, 15);
    };

    const mouseReset = () => {
        if(counterTime>0){
            mouseUp();  
        }
    }

    const mouseUp = () => {
        clearExistingInterval();
        clearExistingTimeout();
        setFinish(false);
        setCounterTime(0);
    };

    useEffect(() => {
        return () => {
            clearExistingInterval();
            clearExistingTimeout();
        };
    }, []);

    return (
        <div className={`flex gap-1 h-full items-center`}>
            <div
                style={{
                    opacity: finish ? 1 : 0
            }}>
                <FaCheck className={`text-[rgb(18,172,255)]`}/>
            </div>

            <Button
                variant={'outline'}
                style={{
                    borderWidth: `2px`,
                    borderColor: `${finish ? "rgb(18,172,255)" : `
                            ${counterTime==0 ? `` : `rgba(79,255,99,${counterTime/100})`}
                        `}`
                }}
                className={`
                    transition-all
                    flex gap-1 justify-center items-center
                    relative
                    z-0
                    overflow-hidden
                    `}
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
                onMouseLeave={mouseReset}>
                <p className={`z-10`}>Concluir tarefas feitas</p>

                <CiSaveUp1 className={`z-10`} size={25} />

                <div 
                style={{
                    width: `${counterTime*1.1}%`,
                    opacity: counterTime/200,
                    backgroundColor: finish ? "rgb(18,172,255)" : "rgb(79,255,99)"
                }}
                className={`left-0 pt-6 pb-6 absolute`}
                >
                </div>

            </Button>
        </div>
    );
};

export default FinishColumn;
