"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, TextInput, Alert, ActivityIndicator} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation
} from "react-native-draggable-flatlist";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

import {Picker} from '@react-native-picker/picker';
import { useTaskContext } from "../contexts/tasksContext";
import { useUserContext } from "../contexts/userContext";

export interface ColumnProps{
  name: string;
  idServer: number;
  isDone: boolean;
  theme: string;
}

type Id = string | number;


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

const Column = (props: ColumnProps) => {

    const {
        user, setUser, id, setId, 
        setColumn1_name, column1_name,
        setColumn2_name, column2_name,
        setColumn3_name,column3_name,
        setColumn1, column1,
        setColumn2, column2,
        setColumn3, column3,
        loadingTasks
      } = useUserContext();

  const [editingTask, setEditingTask] = useState<number>();

  const [edit, setEdit] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>();
  const [tempDesc, setTempDesc] = useState<string>();
  const [tempColor, setTempColor] = useState<string>('Comum');
  const [tempCol, setTempCol] = useState<number>(props.idServer)

  const listRef = useRef(null);

  const {tasks, setTasks} = useTaskContext();

  const orderedColumn = useMemo(()=>(tasks.filter(item => item.columnId==props.idServer).map(found => found.serverId) ), [tasks])

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
  }

  const updateLocalAll = (newTasks: Task[]) => {
    setColumn1(newTasks.filter(item => item.columnId==1).map(found => found.serverId));
    setColumn2(newTasks.filter(item => item.columnId==2).map(found => found.serverId));
    setColumn3(newTasks.filter(item => item.columnId==3).map(found => found.serverId));
  }

  const [loadingAddingTask, setLoadingAddingTask] = useState<boolean>(false);

  async function addTask(columnId: Id, definedObject?: Task){
    setLoadingAddingTask(true);
        if(definedObject){
            if(!tasks.find(item => item.serverId == definedObject.id)){
                setTasks([...tasks, definedObject]);
            }
        }
        else{
            let newId =  Math.floor(Math.random()*10000);

            const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/tasks/add?user=${id}&name=${'Nova tarefa'}&description=${''}`)
                .then(res => res.json())
                .then(data => data.resposta.id)
                .catch(err => {
                    setLoadingAddingTask(false);
                    throw err
                })

            const newTask: Task = {
                id: newId,
                name: "Nova tarefa",
                columnId: columnId,
                serverId: parseInt(res)
            }

            setTasks([...tasks, newTask]);

        }
        setLoadingAddingTask(false);
    }

    function deleteTask(id: Id){
        const newTasks = tasks.filter(task => task.id != id);
        setTasks(newTasks);
        updateLocal(newTasks);
    }

    function updateTask(localId: Id){
        const serverId_chosen = tasks.find(item => item.id==localId)?.serverId

        if(localId){
            fetch(process.env.EXPO_PUBLIC_SERVER_URL+`/api/tasks/update?id=${serverId_chosen}&name=${tempName}&description=${tempDesc}&color=${tempColor}`)
            
            const newTasks: Task[] = tasks.map(item => {
                if (item.id == localId){
                    return {
                        id: localId,
                        name: tempName,
                        description: tempDesc,
                        columnId: tempCol,
                        color: tempColor,
                        serverId: tasks.find(item => item.id == localId) ? tasks.find(item => item.id == localId).serverId : -1
                    }
                }
                else{
                    return item;
                }
            })

            setTasks(newTasks);
            updateLocalAll(newTasks);
            setEdit(false);
        }
        else{
            Alert.alert("Preencha os campos de forma devida", "Verifique novamente seus novos dados",
                [
                    {
                        text: 'Continuar',
                        onPress: () => {}
                    }
                ]
            )
        }

    }

    function setDone(){
        try{
            setTasks(prev => prev.filter(item => item.columnId!=3));

            column3.forEach(item => {
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/tasks/update?id=${item}&done=TRUE`)
                    .catch(err => {
                        throw err
                    })
            });

            setColumn3([]); // Para evitar concluídos fantasmas

            
        }
        catch(err){
            throw err
        }
    }

    const confirmDelete = () => {
        Alert.alert('Deletar item', 'Você tem certeza que deseja deletar este item?',
            [
                {
                    text: 'Deletar',
                    onPress: () => {
                        deleteTask(editingTask)
                    }
                }
                ,
                {
                  text: 'Cancelar',
                  onPress: () => {},
                },
              ],
              {
                cancelable: true,
                onDismiss: () =>{}
              },
        )
    }

    const confirmDone = () => {
        Alert.alert('Concluir tarefas', 'Todas as tarefas serão concluídas e não serão mais exibidas na área de trabalho. Deseja prosseguir?',
            [
                {
                    text: 'Prosseguir',
                    onPress: () => {
                        setDone();
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


  //-------------------------
  const renderItem = ({item, drag}) => {
    const {isActive} = useOnCellActiveAnimation();

   if(item.columnId == props.idServer){
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
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        onDragEnd={({ data }) => {
                            setTasks(data);
                            updateLocal(data);
                            console.log(data);
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


        <View style={{display: 'flex', gap: 4,  flexDirection: 'row', justifyContent: 'center', alignItems:'center', width: '100%', padding: 5, marginVertical: 4}}>
            <TouchableOpacity disabled={loadingTasks} onPress={()=>{addTask(props.idServer)}} style={{flex: 1, borderWidth: 1, borderRadius:5, borderColor: props.theme=='dark' ? 'white' : 'gray', display: 'flex', alignItems: 'center', padding:5}}>
                <Ionicons name="add-outline" size={24} style={{color: props.theme=='dark' ? 'white' : 'black'}} />
            </TouchableOpacity>
            {
                props.isDone && 
                <TouchableOpacity onPress={confirmDone} style={{flex: 1, borderWidth: 1, borderRadius:5, borderColor: props.theme=='dark' ? 'white' : 'gray', display: 'flex', alignItems: 'center', padding:5}}>
                    <Text adjustsFontSizeToFit style={{color: props.theme=='dark' ? 'white' : 'black'}}>Concluir tarefas</Text>
                </TouchableOpacity>
            }
        </View>


        <Modal 
        statusBarTranslucent
        visible={edit}
        transparent={true}
        animationType="fade">
            <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '100%', height: '90%', overflow: 'scroll', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: props.theme=='dark' ? 'black' : 'white', borderWidth: 1, borderColor: 'gray', padding: 20, borderRadius: 15}}>
                    
                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', marginBottom: 20}}>
                        <Text style={{fontSize: 20, color: props.theme=='dark'?'white':'black'}}>Modifique a tarefa</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={()=>{confirmDelete()}}>
                            <Feather style={{color: 'rgba(255,0,0,0.8)'}} name="trash-2" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{flex: 1, width: '100%', display: 'flex', gap: 5}}>
                            <Text onPress={()=>{setEdit(false)}} style={{color: props.theme=='dark'?'white':'black'}}>Nome</Text>
                            <TextInput onChangeText={(e)=>{setTempName(e)}}
                                placeholder={tasks.find(item => item.id == editingTask) ? tasks.find(item => item.id == editingTask).name : ''}
                                placeholderTextColor={'gray'}
                                style={{
                                    backgroundColor: props.theme=='dark' ? 'black' : 'white',
                                    color: props.theme=='light' ? 'black' : 'white',
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 15
                                }}    
                            ></TextInput>

                        </View>

                        <View style={{flex: 1, width: '100%', display: 'flex', gap: 5}}>
                            <Text onPress={()=>{setEdit(false)}} style={{color: props.theme=='dark'?'white':'black'}}>Descrição</Text>
                            <TextInput onChangeText={(e)=>{setTempDesc(e)}}
                                placeholder={tasks.find(item => item.id == editingTask) ? tasks.find(item => item.id == editingTask).description : ''}
                                placeholderTextColor={'gray'}
                                style={{
                                    backgroundColor: props.theme=='dark' ? 'black' : 'white',
                                    color: props.theme=='light' ? 'black' : 'white',
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 15
                                }}    
                            ></TextInput>
                        </View>

                        <View style={{flex: 1, width: '100%', display: 'flex', gap: 5}}>
                            <Text onPress={()=>{setEdit(false)}} style={{color: props.theme=='dark'?'white':'black'}}>Prioridade</Text>
                            <View style={{borderWidth: 1, borderColor: 'gray', borderRadius: 15, overflow: 'hidden'}}>
                                <Picker
                                    selectedValue={tempColor}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setTempColor(itemValue)
                                    }
                                    dropdownIconColor={props.theme=='dark'?'white':'black'}
                                    style={{
                                        color: props.theme=='dark'? 'white' : 'black',
                                    }}
                                    >
                                    <Picker.Item style={{backgroundColor: 'rgb(254,240,138)'}} label="Não prioritária" value={'rgb(254,240,138)'} />
                                    <Picker.Item style={{backgroundColor: 'rgb(134,239,172)'}} label="Comum" value={'rgb(134,239,172)'} />
                                    <Picker.Item style={{backgroundColor: 'rgb(34,197,94)'}} label="Média" value={'rgb(34,197,94)'} />
                                    <Picker.Item style={{backgroundColor: 'rgb(249,115,22)'}} label="Importante" value={'rgb(249,115,22)'} />
                                    <Picker.Item style={{backgroundColor: 'rgb(239,68,68)'}} label="Prioritária" value={'rgb(239,68,68)'} />
                                </Picker>
                            </View>
                        </View>

                        <View style={{flex: 1, width: '100%', display: 'flex', gap: 5}}>
                            <Text onPress={()=>{setEdit(false)}} style={{color: props.theme=='dark'?'white':'black'}}>Coluna</Text>
                            <View style={{borderWidth: 1, borderColor: 'gray', borderRadius: 15, overflow: 'hidden'}}>
                                <Picker
                                    selectedValue={tempCol}
                                    onValueChange={(e)=>{setTempCol(e)}}
                                    dropdownIconColor={props.theme=='dark'?'white':'black'}
                                    style={{
                                        color: props.theme=='dark' ? 'white' : 'black'
                                    }}
                                    >
                                    <Picker.Item style={{backgroundColor: props.theme=='dark'?'black':'white', color: props.theme=='dark'?'white':'black'}} label="Coluna 1" value={1} />
                                    <Picker.Item style={{backgroundColor: props.theme=='dark'?'black':'white', color: props.theme=='dark'?'white':'black'}} label="Coluna 2" value={2} />
                                    <Picker.Item style={{backgroundColor: props.theme=='dark'?'black':'white', color: props.theme=='dark'?'white':'black'}} label="Coluna 3" value={3} />
                                </Picker>
                            </View>
                        </View>

                    <View style={{marginTop:25, flex: 1, gap: 5,  display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 10}}>
                        
                        <TouchableOpacity onPress={()=>{updateTask(editingTask)}} style={{flex: 0.9, display:'flex', flexDirection: 'row', gap:4, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 20, borderRadius: 5, width: '100%'}}>
                            <Text style={{color: props.theme=='dark'?'white':'black', fontSize: 18}}>Salvar</Text>
                            <Feather name="check-circle" size={24} color={props.theme=='dark'?'white':'black'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{setEdit(false)}} style={{flex: 0.1,display:'flex', justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 20, borderRadius: 5, width: '100%'}}>
                            <Text style={{color: props.theme=='dark'?'white':'black'}}>
                                <AntDesign name="back" size={24} color={props.theme=='dark'?'white':'black'} />

                            </Text>
                        </TouchableOpacity>


                    </View>

                </View>
            </View>
        </Modal>
    </View>

  )
}

export default Column