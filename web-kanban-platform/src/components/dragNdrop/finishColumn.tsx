"use client";

import React, { useState, useEffect, useRef } from 'react';


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

import { FaCheck } from "react-icons/fa6";
import { CiSaveUp1 } from "react-icons/ci";

import { updateTask_GQL } from '@/lib/graphQl_functions';
import { GraphQLSchema } from 'graphql';
import { Task, User } from '@/app/schemaWrapper';


// Outline style pego do Button do shadcn
const buttonOutline_style = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2`

interface FinishColumnProps{
    schema?: GraphQLSchema
    users_schema?: Record<string, User>
    tasks_schema?: Record<string, Task>
  }

const FinishColumn = ({schema, users_schema, tasks_schema}: FinishColumnProps) => { 
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
            updateTask_GQL(item, "done", "true", schema);
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
                {/* Aplicando abaixo variant="outline" sem hydration error de button on button, e style equivalente a "rounded-full" */}
                <AlertDialogTrigger className={buttonOutline_style} style={{borderRadius: '9999px'}}> 
                        <p className={`z-10`}>Confirmar conclusão</p>
                        <CiSaveUp1 className={`z-10 ml-[1px]`} size={25} />
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
