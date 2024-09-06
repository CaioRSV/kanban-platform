"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

import { FaCheck } from "react-icons/fa6";
import { CiSaveUp1 } from "react-icons/ci";

import { useUserContext } from '../contexts/userContext';
import { useTaskContext } from '../contexts/tasksContext';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



const FinishColumn = () => { 

    // Contextos
    const { column3, column3_name } = useUserContext();
    const {setTasks} = useTaskContext();

    // Variáveis de timeout confirm icon e var de exibição desse ícone
    const [finish, setFinish] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Método de confirmação de tarefas
    const finishItemsColumn = () => {
        setTasks(prev => prev.filter(item => item.columnId!=3));

        column3.forEach(item => {
            fetch(`/api/tasks/update?id=${item}&done=TRUE`)
        });
    }

    // Clean up pro interval
    const clearExistingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // Aplicando método de confirmação e lógica de timeout do ícone de forma conjunta
    const handleConfirm = () => {
        clearExistingTimeout();
        setFinish(true);
        finishItemsColumn();

        timeoutRef.current = setTimeout(() => {
            setFinish(false);
        }, 700);

    };

    // on mount
    useEffect(() => {
        return () => {
            clearExistingTimeout();
        };
    }, []);

    return (
        <div className={`flex gap-2 h-full items-center`}>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button
                        variant={'outline'}
                        style={{
                            borderWidth: `1px`,
                            borderColor: `${finish ? "rgba(18,172,255, 0.5)" : ``}`
                        }}
                        className={`
                            transition-all
                            flex gap-1 justify-center items-center
                            relative
                            z-0
                            overflow-hidden
                            rounded-full
                            `}
                    >
                        <p className={`z-10`}>Confirmar conclusão</p>

                        <CiSaveUp1 className={`z-10 ml-[1px]`} size={25} />
                    </Button>
                    
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <p>{`Concluir definitivamente tarefas ?`}</p>
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            <p>{`As tarefas da coluna "${column3_name}" serão consideradas como concluídas de forma definitiva e não serão exibidas na área de trabalho no futuro.`}</p>
                        </AlertDialogDescription>

                    </AlertDialogHeader>
                    <AlertDialogAction onClick={()=>{handleConfirm()}}>Prosseguir</AlertDialogAction>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        
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
