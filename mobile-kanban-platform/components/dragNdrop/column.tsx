import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, Alert, ActivityIndicator} from "react-native";
import DraggableFlatList, {
  ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation
} from "react-native-draggable-flatlist";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useTaskContext } from "../contexts/tasksContext";
import { useUserContext } from "../contexts/userContext";
import ModalColumn from "./modalColumn";
import ButtonAddTask from "./buttonAddTask";
import { addTask_GQL, orderColumn_GQL, updateTask_GQL } from "../../utils/graphQl_functions";
import { GraphQLSchema } from "graphql";

export type Id = string | number;


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

const colorToPriorities = [
    "rgb(254,240,138)",
    "rgb(134,239,172)",
    "rgb(34,197,94)",
    "rgb(249,115,22)",
    "rgb(239,68,68)"
]

export interface ColumnProps{
    name: string;
    idServer: number;
    isDone: boolean;
    theme: string;
    schema?: GraphQLSchema;

    tasks_schema?: any
  }

const Column = (props: ColumnProps) => {

  // Contextos
  const {tasks, setTasks} = useTaskContext();
  const {
    id,
    setColumn1, column1,
    setColumn2, column2,
    setColumn3, column3,
    loadingTasks
  } = useUserContext();

  // Variáveis de estado locais

  const [editingTask, setEditingTask] = useState<number>();

  const [edit, setEdit] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>();
  const [tempDesc, setTempDesc] = useState<string>();
  const [tempColor, setTempColor] = useState<string>('Comum');
  const [tempCol, setTempCol] = useState<number>(props.idServer)

  const [loadingAddingTask, setLoadingAddingTask] = useState<boolean>(false);

  const listRef = useRef(null);

  // Função de atualização de lista de tasks local
  const updateLocal = (newTasks: Task[]) => {
    if(props.idServer==1){
        setColumn1(newTasks.filter(item => item.columnId==props.idServer).map(found => found.serverId));
    }
    else if(props.idServer==2){
        setColumn2(newTasks.filter(item => item.columnId==props.idServer).map(found => found.serverId));
    }
    else if(props.idServer==3){
        setColumn3(newTasks.filter(item => item.columnId==props.idServer).map(found => found.serverId));
    }

    // GraphQL ---
    // for(let i=1;i<=3;i++){
    //     orderColumn_GQL(id, `column${i}`,
    //         (tasks.filter(item => item.columnId == i)).map(elem => elem.serverId)
    //     , props.schema);
    // }
  }

  // Função de atualização de lista de tasks local em todas as colunas de uma vez
  const updateLocalAll = (newTasks: Task[]) => {
    setColumn1(newTasks.filter(item => item.columnId==1).map(found => found.serverId));
    setColumn2(newTasks.filter(item => item.columnId==2).map(found => found.serverId));
    setColumn3(newTasks.filter(item => item.columnId==3).map(found => found.serverId));

    // GraphQL ---
    // for(let i=1;i<=3;i++){
    //     orderColumn_GQL(id, `column${i}`,
    //         (tasks.filter(item => item.columnId == i)).map(elem => elem.serverId)
    //     , props.schema);
    // }

  }

  // Adicionando Task
  async function addTask(columnId: Id, definedObject?: Task){
    setLoadingAddingTask(true);
        if(definedObject){
            if(!tasks.find(item => item.serverId == definedObject.id)){
                setTasks(prev => [...prev, definedObject]);
            }
        }
        else{
            // REST request (apenas envio por virtude de manutenção do banco, não afeta localmente tirando o ID timestamp para garantir sem erros sync)
            const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/tasks/add?user=${id}&name=${'Nova tarefa'}&description=${''}`)
                .then(res => res.json())
                .then(data => data.resposta.id)
                .catch(err => {
                    setLoadingAddingTask(false);
                    throw err
                })

            const newTask: Task = {
                id: parseInt(res),
                name: "Nova tarefa",
                columnId: columnId,
                serverId: parseInt(res)
            }

            setTasks(prev => [...prev, newTask]);
            addTask_GQL(parseInt(res), "Nova tarefa", parseInt(columnId.toString()), parseInt(res), id, props.schema) // GraphQL
            updateLocalAll([...tasks, newTask])

        }
        setLoadingAddingTask(false);
    }

    // Marcando coluna inteira como concluída
    function setDone(){
        try{
            setTasks(prev => prev.filter(item => item.columnId!=3));

            column3.forEach(item => {
                //  Update (apenas envio, sem uso local)
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/tasks/update?id=${item}&done=TRUE`)
                    .catch(err => {
                        throw err
                    })

                // GraphQL ---
                updateTask_GQL(item, "done", "true", props.schema);
            });

            setColumn3([]); // Para evitar concluídos fantasmas

        }
        catch(err){
            throw err
        }
    }

    const confirmDone = () => {
        Alert.alert('Concluir tarefas', 'Todas as tarefas serão concluídas e não serão mais exibidas na área de trabalho. Deseja prosseguir?',
            [
                {
                    text: 'Prosseguir',
                    onPress: () => {
                        setDone();
                        updateLocalAll(tasks);
                    }
                }
                ,
                {
                  text: 'Voltar',
                  onPress: () => {},
                },
              ],
              {
                cancelable: true,
                onDismiss: () =>{}
              },
        )
    }

  // Populando vars temps para edição antes de abrir o modal
  const updateTemps = (idToTemp:number) => {
    if(tasks.find(item => item.id == idToTemp) && tasks.find(item => item.id == idToTemp).color){
        if(colorToPriorities.includes(tasks.find(item => item.id == idToTemp).color)){
            setTempColor(tasks.find(item => item.id == idToTemp).color)
        }
        else{
            setTempColor(colorToPriorities[2])
        }
        
    }
    else{
        setTempColor(colorToPriorities[2])
    }

    if(tasks.find(item => item.id == idToTemp)){
        setTempName(tasks.find(item => item.id == idToTemp).name);
        setTempDesc(tasks.find(item => item.id == idToTemp).description);
        setTempCol(tasks.find(item => item.id == idToTemp).columnId);
    }
  }

  // Renderizando tasks
  const renderItem = ({item, drag}) => {
    const {isActive} = useOnCellActiveAnimation();

    // console.log("##########")
    // console.log(item);
    // console.log('=')
    // console.log(props.idServer);
    // console.log(typeof props.idServer);
    // console.log(item.columnId);
    // console.log(typeof item.columnId);
    // console.log("##########")

   if(props.idServer===item.columnId){
    return(
        <ScaleDecorator>
        <OpacityDecorator>
          <ShadowDecorator>
            <TouchableOpacity style={{
              backgroundColor: props.theme=='dark' ? 'black' : 'white',
              padding: 10,
              elevation: isActive ? 20 : 0,
              marginVertical: 3,
              borderWidth: 1,
              borderColor: 'rgb(100,116,139)',
              flex: 1,
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
            onLongPress={drag}
            onPress={()=>{
                setEdit(true);
                setEditingTask(item.id);
                updateTemps(item.id);
            }}
            >
  
              <View style={{width: 10, height: 10, backgroundColor: item.color, borderRadius: 100}}></View>

              <Text style={{flex: 1, color: props.theme=='dark' ? 'white' : 'black', fontSize: 16}}>{item.name}</Text>
  
              <MaterialIcons name="drag-handle" size={24} style={{color: props.theme=='dark' ? 'gray' : 'black'}} />
  
              
            </TouchableOpacity>
          </ShadowDecorator>
        </OpacityDecorator>
      </ScaleDecorator>
      )
   }
   else{
    return(
        <></>
    )
   }
  }

  return (
    <View style={{
      padding: 10,
      borderWidth: 1,
      borderColor: props.theme=='dark' ? 'white' : 'gray',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      }}>
        <Text style={{color: props.theme=='dark' ? 'white' : 'black', fontSize: 18}}>{props.name}</Text>

        <TouchableOpacity onPress={()=>{console.log(props.tasks_schema)}}><Text>dsaidisodso</Text></TouchableOpacity>

        <View style={{backgroundColor: props.theme=='dark' ? 'white' : 'black', width: '100%', height: 1, marginVertical: 8}}></View>

        <View style={{
            height: 200,
            overflow: 'hidden',
        }}>
            {
                loadingTasks
                    ?
                    <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: "center", alignItems: 'center'}}>
                        <ActivityIndicator size="small" color={props.theme=='dark'? 'white' : 'black'} />
                    </View>
                    :
                    <DraggableFlatList
                        ref={listRef}
                        data={tasks}
                        renderItem={renderItem}
                        keyExtractor={(item) => `draggable-item-${item.id}`}
                        onDragEnd={({ data }) => {
                            setTasks(data);
                            updateLocal(data);
                        }}
                    />                 
            }
            
            {
                loadingAddingTask ?
                <View style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginVertical: 5}}>
                    <ActivityIndicator size="small" color={props.theme=='dark'? 'white' : 'black'} style={{opacity: 0.2}} />
                </View>
                :
                <></>
            }

        </View>

        <ButtonAddTask
            {...props}
            confirmDone={confirmDone}
            addTask={addTask}
        />

        <ModalColumn
            {...props}
            editingTask={editingTask}
            updateLocalAll={updateLocalAll}

            edit={edit}
            setEdit={setEdit}

            tempName={tempName}
            setTempName={setTempName}

            tempDesc={tempDesc}
            setTempDesc={setTempDesc}

            tempColor={tempColor}
            setTempColor={setTempColor}

            tempCol={tempCol}
            setTempCol={setTempCol}
        />
    </View>
  )
}

export default Column