"use client";

import { useState } from 'react';
import { graphql, ExecutionResult } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { GrGraphQl } from "react-icons/gr";
import { Button } from './ui/button';
import { useTaskContext } from './contexts/tasksContext';
import { Task } from './dragNdrop/workspace';
import { Description } from '@radix-ui/react-dialog';
import { useUserContext } from './contexts/userContext';


const schemaString = `
  type Template {
    id: ID!
    name: String!
    tasks: [Todo!]!
  }

  type Todo {
    id: ID!
    title: String!
    description: String!
    priority: Int!
  }

  type Query {
    template(id: ID!): Template
  }
`;

interface Todo {
  id: string;
  title: string;
  description: string;
  priority: number;
}

interface TemplateData {
  id: string;
  name: string;
  tasks: Todo[];
}

const schema = makeExecutableSchema({ typeDefs: schemaString });

const schemaWithMocks = addMocksToSchema({
  schema,
  mocks: {
    Template: () => {
      const templates = [
        {
          id: '1',
          name: 'Casual',
          tasks: [
            { id: '1', title: 'Comprar mantimentos', description: 'Leite, Pão, Queijo, Ovos', priority: 2 },
            { id: '2', title: 'Terminar projeto', description: 'Completar o projeto de GraphQL', priority: 3 },
            { id: '3', title: 'Planejar uma viagem', description: 'Planejar uma viagem com amigos', priority: 1 },
            { id: '4', title: 'Ir para a academia', description: 'Fazer exercícios', priority: 4 },
          ],
        },
        {
          id: '2',
          name: 'Profissional',
          tasks: [
            { id: '5', title: 'Revisar relatório financeiro', description: 'Completar a revisão e análise do relatório financeiro mensal', priority: 2 },
            { id: '6', title: 'Desenvolver estratégia de marketing', description: 'Elaborar o plano de marketing para o próximo trimestre', priority: 1 },
            { id: '7', title: 'Atualizar documentação de projeto', description: 'Revisar e atualizar a documentação técnica do projeto', priority: 3 },
            { id: '8', title: 'Agendar reuniões de equipe', description: 'Organizar e confirmar as reuniões semanais com a equipe', priority: 4 },
          ],
        },
      ];

      return templates[Math.floor(Math.random() * templates.length)];
    },
  },
});

interface MockerProps{
  active: boolean
}

export default function GraphQlMocker(props: MockerProps) {
  const [todo, setTodo] = useState<Todo[]>([]);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const {tasks, setTasks} = useTaskContext();
  const {id, setLoadingTasks} = useUserContext();

  const fetchTodo = (chosenTemplate: number) => {
    graphql({
      schema: schemaWithMocks,
      source: `
      query tasksForTemplate {
        template(id: ${chosenTemplate}) {
          id
          name
          tasks {
            id
            title
            description
            priority
          }
        }
      }
    `,
    })
      .then((result: ExecutionResult) => {
        if (result.data && 'template' in result.data) {
          const templateData = result.data as { template: TemplateData };
          setTodo(templateData.template.tasks);
        } else {
          console.error("Unexpected result structure:", result);
        }
      })
      .catch((error) => {
        console.error("Error fetching todo:", error);
      });

      return [];
  };

  const populateTasks = (chosenNumber: number) => {
    fetchTodo(chosenNumber);
    setAlertOpen(true)
  }

  async function addTask(columnId: number, definedObject: Task){
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

  const updateLocal = async () => { 
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

      const processTasks = async (tasks: any[]) => {
        for (const item of tasks) {
          newTaskList.push(await addTask(1, item));
          await sleep(800);
        }
      };

      await processTasks(newTasks);

      setTasks([...tasks, ...newTaskList])

      setLoadingTasks(false);

    }
  }

  return (
    <div className={`${!props.active ? 'opacity-50 pointer-events-none' : ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger className={`p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground`}>
            <GrGraphQl size={23} />          
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
          Escolha um pacote template de tarefas
          </DropdownMenuLabel>
          <DropdownMenuSeparator></DropdownMenuSeparator>

          <DropdownMenuItem onClick={()=>{populateTasks(1)}}>Tarefas casuais</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{populateTasks(2)}}>Tarefas profissionais</DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja importar as tarefas do template?</AlertDialogTitle>
          <AlertDialogDescription>Assim como todas as mudanças às colunas, alterações apenas serão armazenadas caso salve elas.</AlertDialogDescription>
        </AlertDialogHeader>
          <AlertDialogAction onClick={()=>{updateLocal();setAlertOpen(false);}}>Prosseguir</AlertDialogAction>
          <AlertDialogCancel onClick={()=>{setAlertOpen(false);}}>Voltar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}