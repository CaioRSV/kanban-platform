import { SetStateAction } from "react";
import { Task, Id } from "../components/dragNdrop/column";

interface Todo {
    id: string;
    title: string;
    description: string;
    priority: number;
  }

export async function addTask(columnId: Id, id: Number, setLoadingAddingTask: React.Dispatch<SetStateAction<boolean>>, tasks: Task[], setTasks: React.Dispatch<SetStateAction<Task[]>> , definedObject?: Task){
        // Utils para traduzir prioridade em cor no sistema
        interface priorityColorObjectInterface{
            [key: string]: string
          }
          const priorityColorObject:priorityColorObjectInterface = {
            '1': 'rgb(254,240,138)',
            '2': 'rgb(134,239,172)',
            '3': 'rgb(34,197,94)',
            '4': 'rgb(249,115,22)',
            '5': 'rgb(239,68,68)'
          }
  
          // 
  
          let newId =  Math.floor(Math.random()*10000);
          const clr = definedObject.color ?? '1'
          
          const res = await fetch(`/api/tasks/add?user=${id}&name=${definedObject.name}&description=${definedObject.description}&color=${Object.keys(priorityColorObject).includes(clr) ? priorityColorObject[clr] : 'white'}`)
              .then(res => {
                if(!res.ok){
                  return false;
                }
                return res.json();
              })
              .then(data => (data && data.resposta && data.resposta.id ? data.resposta.id : false));
  
          if(res){
            const newTask: Task = {
              id: newId,
              name: definedObject.name,
              columnId: columnId,
              serverId: parseInt(res),
              color: Object.keys(priorityColorObject).includes(clr) ? priorityColorObject[clr] : 'white',
              description: definedObject.description
          }
  
          return newTask;
          }
          else{
            const newTask: Task = {
              id: -1,
              name: '',
              columnId: 1,
              serverId: 232019301,
            }
  
            return newTask;
          }
    }

// Traduz as tarefas de todo em tasks usuais e popula o contexto de tasks locais com as novas tarefas
export const updateLocal = async (
    setLoadingTasks: React.Dispatch<SetStateAction<boolean>>, todo: Todo[],  
    tasks: Task[], setTasks: React.Dispatch<SetStateAction<Task[]>>,
    id: Number, setLoadingAddingTask: React.Dispatch<SetStateAction<boolean>>, definedObject?: Task
    ) => { 

    if(todo){
      setLoadingTasks(true);
      const newTasks:Task[] = todo.map(item => {
        return {
          id: parseInt(item.id),
          name: item.title,
          description: item.description,
          color: item.priority.toString(),
          columnId: 1,
          serverId: -1
        }
      })

      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      const newTaskList:Task[] = [];

      const processTasks = async (tasks: Task[]) => {
        for (const item of tasks) {
          newTaskList.push(await addTask(1, id, setLoadingAddingTask, tasks, setTasks, item));
          await sleep(800);
        }
      };
      
      await processTasks(newTasks);

      setTasks([...tasks, ...newTaskList])
      setLoadingTasks(false);
    }
  }