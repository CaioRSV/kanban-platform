"use client";

import { View, Text, Button } from 'react-native'
import React, {useState, useEffect, useMemo} from 'react'

import { DndProvider, DndProviderProps, Draggable, Droppable, useDraggable} from "@mgcrea/react-native-dnd";

import { useUserContext } from "../contexts/userContext";
import { useTaskContext } from "../contexts/tasksContext";

import { GestureHandlerRootView, State } from "react-native-gesture-handler";

import { KanbanBoard, ColumnModel, CardModel } from '@intechnity/react-native-kanban-board';


export type Id = number;

export interface Column {
    id: Id;
    title: string;
}

export interface Task {
    id: number
    name: string
    columnId: Id,
    description?: string
    color?: string
    startDate?: Date
    endDate?: Date
    done?: boolean

    serverId: number
};


const Workspace = () => {
    const {
        user, setUser, id, setId, 
        setColumn1_name, column1_name,
        setColumn2_name, column2_name,
        setColumn3_name, column3_name,
        setColumn1, column1,
        setColumn2, column2,
        setColumn3, column3
      } = useUserContext();
    
      const {tasks, setTasks} = useTaskContext();

      const [columns, setColumns] = useState<Column[]>([
            {
                id: 1,
                title: column1_name
            },
            {
                id: 2,
                title: column2_name
            },
            {
                id: 3,
                title: column3_name
            }
        ]);

        useEffect(()=>{
            setColumns([
                {
                    id: 1,
                    title: column1_name
                },
                {
                    id: 2,
                    title: column2_name
                },
                {
                    id: 3,
                    title: column3_name
                }
            ]);
        }, [column1_name, column2_name, column3_name])
        
        const columnsId = useMemo(() => columns.map(col=>col.id), [columns]);

        const tasksId_1 = useMemo(() => (tasks.filter(tas=>tas.columnId==1)).map(tas=>tas.id), [tasks]);

        const tasksId_2 = useMemo(() => (tasks.filter(tas=>tas.columnId==2)).map(tas=>tas.id), [tasks]);

        const tasksId_3 = useMemo(() => (tasks.filter(tas=>tas.columnId==3)).map(tas=>tas.id), [tasks]);

        useEffect(()=>{
            // console.log('=============')

            // console.log(tasksId_1);
            // console.log((tasks.filter(tas=>tas.columnId==2)).map(tas=>tas.serverId))
            // console.log((tasks.filter(tas=>tas.columnId==3)).map(tas=>tas.serverId))

            // setColumn1((tasks.filter(tas=>tas.columnId==1)).map(tas=>tas.serverId));
            // setColumn2((tasks.filter(tas=>tas.columnId==2)).map(tas=>tas.serverId));
            // setColumn3((tasks.filter(tas=>tas.columnId==3)).map(tas=>tas.serverId));
        }, [tasksId_1, tasksId_2, tasksId_3])

        const [activeTask , setActiveTask] = useState<Task | null>();

        //

        const [activeColumn , setActiveColumn] = useState<Column | null>();

        // function onDragStart(event: DragStartEvent){
        //     if(event.active.data.current?.type=="Column"){
        //         setActiveColumn(event.active.data.current.column)
        //         return;
        //     }

        //     if(event.active.data.current?.type=="Task"){
        //         setActiveTask(event.active.data.current.task)
        //         return;
        //     }

        // }

        // function onDragEnd(event: DragEndEvent){

        //     setActiveColumn(null);
        //     setActiveTask(null);

        //     const {active, over} = event;

        //     // Verifica se está dando over em alguma coluna
        //     if (over){
        //         const activeColumnID = active.id;
        //         const overColumnID = over.id;

        //         const isActiveTask = active.data.current?.type == 'Task';
        //         const isOverTask = over.data.current?.type == 'Task';

        //         if(!isOverTask && isActiveTask){
        //             const overID = columns.findIndex(col => col.id === overColumnID)+1;
        //             const activeID = activeColumnID;
        //             changeToEmptyColumn(overID, activeID, tasks.find(item => item.id == activeID));
        //         }
        //         else if(!(activeColumnID === overColumnID)){ // Caso esteja dando over em alguma coluna diferente
        //             setColumns(columns => {
        //                 const activeColumnIndex = columns.findIndex(col => col.id === activeColumnID);

        //                 const overColumnIndex = columns.findIndex(col => col.id === overColumnID);

        //                 return arrayMove(columns, activeColumnIndex, overColumnIndex)
        //             })
        //         }
                
                
        //     }
        // }

        // function updateColumn_Server(columnId: Id, title:string){
        //     let paramStack = `?id=${id}`
        //     if(columnId==1){
        //         setColumn1_name(title);
        //         paramStack += `&column1_name=${title}`
        //     }
        //     else if(columnId==2){
        //         setColumn2_name(title);
        //         paramStack += `&column2_name=${title}`
        //     }
        //     else if(columnId==3){
        //         setColumn3_name(title);
        //         paramStack += `&column3_name=${title}`
        //     }

        //     fetch("/api/user/update"+paramStack);
        // }

        // function updateColumn(id: Id, title: string){
        //     if(!title || title.length==0) return;

        //     const newColumns = columns.map(col => {
        //         if(col.id !== id){ // Não muda as que não são as referidas
        //             return col
        //         }
        //         else{ // Alterando a especificada
        //             updateColumn_Server(id, title);
        //             return {...col, title};

        //         }
        //     })

        //     setColumns(newColumns);
        // }

        // async function addTask(columnId: Id, definedObject?: Task){
        //     if(definedObject){
        //         if(!tasks.find(item => item.serverId == definedObject.id)){
        //             setTasks([...tasks, definedObject]);
        //         }
        //     }
        //     else{
        //         let newId =  Math.floor(Math.random()*10000);

        //         const res = await fetch(`/api/tasks/add?user=${id}&name=${'Nova tarefa'}&description=${''}`)
        //             .then(res => res.json())
        //             .then(data => data.resposta.id);

        //         const newTask: Task = {
        //             id: newId,
        //             name: "Nova tarefa",
        //             columnId: columnId,
        //             serverId: parseInt(res)
        //         }

        //         setTasks([...tasks, newTask]);

        //     }

        // }

        // function deleteTask(id: Id){
        //     const newTasks = tasks.filter(task => task.id != id);
        //     setTasks(newTasks);
        // }

        // function sleep(ms:number) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // async function changeToEmptyColumn(overColumnID: Id, activeTaskID: Id, definedObject?: Task){
        //     const newTasks = tasks.filter(task => task.id != activeTaskID);

        //     const newTask: Task = {
        //         id: typeof activeTaskID ==='number' ? activeTaskID : Math.floor(Math.random()*10000),
        //         name: definedObject?.name ?? "Nova tarefa",
        //         columnId: typeof overColumnID ==='number'? overColumnID : Math.floor(Math.random()*10000),
        //         description: definedObject?.description ?? '',
        //         color: definedObject?.color,
        //         startDate: definedObject?.startDate,
        //         endDate: definedObject?.endDate,
        //         serverId: definedObject?.serverId ?? 0
        //     }

        //     setTasks([...newTasks, newTask]);
        // }

        // function updateTask(localId: Id, content: string, attribute?: string){

        //     const serverId_chosen = tasks.find(item => item.id==localId)?.serverId

        //     const newTasks = tasks.map((task) => {
        //         if(task.id === localId && content.length>0){
        //             fetch(`/api/tasks/update?id=${serverId_chosen}&${attribute ? attribute : 'description'}=`+content)
                    
        //             if (attribute == 'name'){
        //                 return {...task, name:content}
        //             }
        //             else if (attribute == 'color'){
        //                 return {...task, color:content}
        //             }
        //             else{
        //                 return {...task, description:content}
        //             }
        //         }
        //         else{
        //             return task;
        //         }
        //     });

        //     setTasks(newTasks);  
        // }

        // function onDragOver(event: DragOverEvent){
        //     const {active, over} = event;

        //     // Verifica se está dando over em alguma coluna
        //     if (over){
        //         const activeID = active.id;
        //         const overID = over.id;

        //         const isActiveTask = active.data.current?.type == 'Task';
        //         const isOverTask = over.data.current?.type == 'Task';
                
        //         if(isActiveTask && isOverTask){ // Ta dropando em outra task
        //             setTasks(tasks => {
        //                 const activeIndex = tasks.findIndex(item => item.id === activeID);
        //                 const overIndex = tasks.findIndex(item => item.id === overID);

        //                 if(tasks[activeIndex].columnId !== tasks[overIndex].columnId){
        //                     tasks[activeIndex].columnId = tasks[overIndex].columnId
        //                 }

        //                 return arrayMove(tasks, activeIndex, overIndex);
        //             })
        //         }
                
        //     }        
        // }

        const [test, setTest] = useState<any>();

          const handleDragEnd: DndProviderProps["onDragEnd"] = ({ active, over }) => {
            "worklet";
            if (over && active && active.data) {
              if(active.data.value){
                console.log('!')
                if(!over.data.value.serverId){
                  console.log('!!')
                  const preTask = active.data.value as Task;

                  if(preTask){
                    const newTask2:Task = {
                      ...preTask,
                      columnId: typeof over.id === 'string' ? parseInt(over.id) : -1,
                      id: typeof preTask.id === 'string' ? parseInt(preTask.id) : preTask.id,
                      serverId: 2025
                    };
                    console.log(newTask2);

                    setTest(newTask2);

                  }
                  else{
                    console.log('nao')
                  }


                  
                  

                }
              }
            }
          };
        
          const handleBegin: DndProviderProps["onBegin"] = (active) => {
            "worklet";
            console.log('onBegin');
          };
        
          const handleFinalize: DndProviderProps["onFinalize"] = ({ state }) => {
            "worklet";
            console.log("onFinalize");
            if (state !== State.FAILED) {
              console.log("onFinalize");
            }
          };

          interface DND_Card {
            info: Task;
            category: string;
          }

          interface DND_Column{
            category: string;
          }

          const data = { key: "value" };

          const onCardDragEnd = (srcColumn: ColumnModel, destColumn: ColumnModel, item: CardModel, cardIdx: number) => {
            console.log(
              'Card finished dragging',
              `Item: ${item.title} \nFrom column: ${srcColumn.id} \nTo column: ${destColumn.id} \nCard index: ${cardIdx}`);
          }
          
          const onCardPress = (card: CardModel) => {
            console.log(`Card '${card.title}' pressed`);
          }

          
        
          


  return (
    <GestureHandlerRootView>

      {/* <KanbanBoard
        style={{backgroundColor: 'black', padding: 10}}
        cardContainerStyle={{
          borderColor: 'red'
        }}
        columns={columns_test}
        cards={cards}
        onDragEnd={onCardDragEnd}
        onCardPress={onCardPress}
      /> */}

        <DndProvider onBegin={handleBegin} onFinalize={handleFinalize} onDragEnd={handleDragEnd}>
          
          <Button title="COLUMN1" onPress={()=>{console.log(tasks)}}></Button>

          <Button title="ADD ITEM" onPress={()=>{setTasks([
            ...tasks, {columnId: 1, id: 1, name: "Taskers", serverId: 2025}
          ])}}></Button>
          
          <Droppable id="1" style={{backgroundColor: 'red'}} data={[[], "column"]}>
           
            <Text>DROP</Text>
            
          </Droppable>

          <Draggable id="1" data={
              {
              id: "1",
              name: "Taskers",
              serverId: "1",
              columnId: -1
            }
          }>

            <Text>DRAG</Text>
          </Draggable>
        </DndProvider>
    </GestureHandlerRootView>
  )
}

export default Workspace