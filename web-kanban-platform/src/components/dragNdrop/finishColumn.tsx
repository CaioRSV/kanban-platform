"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../contexts/userContext';
import { useTaskContext } from '../contexts/tasksContext';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";

import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { CiSaveUp1 } from "react-icons/ci";


const FinishColumn = () => { 
    const [finish, setFinish] = useState<boolean>(false);
    const [timePress, setTimePress] = useState<number | null>(null);
    const [counterTime, setCounterTime] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [historyPressTime, SetHistoryPressTime] = useState<number[]>([]);

    const [notifyIcon, setNotifyIcon] = useState<boolean>(false);

    const { column3 } = useUserContext();

    const {setTasks} = useTaskContext();

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
        setNotifyIcon(false);
        
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

                setTasks(prev => prev.filter(item => item.columnId!=3));

                column3.forEach(item => {
                    fetch(`/api/tasks/update?id=${item}&done=TRUE`)
                });
                
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
        if((historyPressTime.slice(historyPressTime.length-3).reduce((a, b) => a + b, 0)/3)<50 && counterTime<50) setNotifyIcon(true);
        SetHistoryPressTime([...historyPressTime, counterTime]);
        setCounterTime(0);
    };

    useEffect(() => {
        return () => {
            clearExistingInterval();
            clearExistingTimeout();
        };
    }, []);

    return (
        <div className={`flex gap-2 h-full items-center`}>

        <TooltipProvider>
        <Tooltip>
            <TooltipTrigger onClick={()=>{ console.log(historyPressTime.slice(historyPressTime.length-3)) }} onMouseEnter={()=>{setNotifyIcon(false)}}>
                <IoIosInformationCircleOutline style={{color: notifyIcon ? 'rgba(0, 135, 255, 0.8)' : ''}} size={23} className={`transition-all`} />
            </TooltipTrigger>
            <TooltipContent>
                <p>Para que as tarefas sejam consideradas como concluídas, clique e segure no botão ao lado.</p>
            </TooltipContent>
        </Tooltip>
        </TooltipProvider>

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
                    rounded-full
                    `}
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
                onMouseLeave={mouseReset}>
                <p className={`z-10`}>Confirmar conclusão</p>

                <CiSaveUp1 className={`z-10 ml-[1px]`} size={25} />

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

            <div
                style={{
                    opacity: finish ? 1 : 0
            }}>
                <FaCheck className={`text-[rgb(18,172,255)]`}/>
            </div>
        </div>
    );
};

export default FinishColumn;
