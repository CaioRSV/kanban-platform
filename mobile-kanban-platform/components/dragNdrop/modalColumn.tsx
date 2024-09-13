import React, { SetStateAction } from "react";
import { View, TouchableOpacity, Text, Modal, TextInput, Alert } from "react-native";

import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

import {Picker} from '@react-native-picker/picker';
import { useTaskContext } from "../contexts/tasksContext";
import { useUserContext } from "../contexts/userContext";

import { Task, Id } from "./column";
import { deleteTask_GQL, updateTask_GQL } from "../../utils/graphQl_functions";
import { GraphQLSchema } from "graphql";

export interface ColumnProps{
  name: string;
  idServer: number;
  isDone: boolean;
  theme: string;
  schema?: GraphQLSchema

  editingTask: { id: number, serverId: number };
  updateLocalAll (param: Task[]): void;

  edit: boolean;
  setEdit: React.Dispatch<SetStateAction<boolean>>

  tempName: string;
  setTempName: React.Dispatch<SetStateAction<string>>

  tempDesc: string;
  setTempDesc: React.Dispatch<SetStateAction<string>>

  tempColor: string;
  setTempColor: React.Dispatch<SetStateAction<string>>

  tempCol: number;
  setTempCol: React.Dispatch<SetStateAction<number>>
}

const ModalColumn = (props: ColumnProps) => {
    // Desconstruct as props necessárias
    const { 
        editingTask, updateLocalAll,
        edit, setEdit, 
        tempName, setTempName, 
        tempDesc, setTempDesc, 
        tempColor, setTempColor, 
        tempCol, setTempCol 
    } = props

    // Contextos
    const {
        id,
        setColumn1,
        setColumn2,
        setColumn3,
    } = useUserContext();

    const {tasks, setTasks} = useTaskContext();

    //
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

    function deleteTask(serverId: Id, localId: Id){
        const newTasks = tasks.filter(task => task.id != localId);
        setTasks(newTasks);
        updateLocal(newTasks);
        deleteTask_GQL(typeof serverId === "string" ? parseInt(serverId) : serverId, id.toString(), props.schema); // GraphQL
        console.log(serverId)
        console.log(id.toString())
    }

    function updateTask(localId: Id){
        const serverId_chosen = tasks.find(item => item.id==localId)?.serverId

        if(localId || tempName.length==0){
            // REST request (apenas envio por virtude de manutenção do banco, não afeta localmente)
            fetch(process.env.EXPO_PUBLIC_SERVER_URL+`/api/tasks/update?id=${serverId_chosen}&name=${tempName}&description=${tempDesc}&color=${tempColor}`)
            
            // Local
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

            // GraphQL
            if(serverId_chosen){
                // Aplicação não ideal, mas no futuro com mais calma se adaptará a função atual e seus parâmetros
                updateTask_GQL(serverId_chosen, "name", tempName, props.schema);
                updateTask_GQL(serverId_chosen, "description", tempDesc, props.schema);
                updateTask_GQL(serverId_chosen, "color", tempColor, props.schema);
            }

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

    const confirmDelete = () => {
        Alert.alert('Deletar item', 'Você tem certeza que deseja deletar este item?',
            [
                {
                    text: 'Deletar',
                    onPress: () => {
                        deleteTask(editingTask.serverId, editingTask.id);
                        setEdit(false);
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
  

  return (
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
                            placeholder={tasks.find(item => item.id == editingTask.id) ? tasks.find(item => item.id == editingTask.id).name : ''}
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
                        />

                    </View>

                    <View style={{flex: 1, width: '100%', display: 'flex', gap: 5}}>
                        <Text onPress={()=>{setEdit(false)}} style={{color: props.theme=='dark'?'white':'black'}}>Descrição</Text>
                        <TextInput onChangeText={(e)=>{setTempDesc(e)}}
                            placeholder={tasks.find(item => item.id == editingTask.id) ? tasks.find(item => item.id == editingTask.id).description : ''}
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
                        />
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
                        
                        <TouchableOpacity onPress={()=>{updateTask(editingTask.id)}} style={{flex: 0.9, display:'flex', flexDirection: 'row', gap:4, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 20, borderRadius: 5, width: '100%'}}>
                            <Text style={{color: props.theme=='dark'?'white':'black', fontSize: 18}}>Salvar</Text>
                            <Feather name="check-circle" size={24} color={props.theme=='dark'?'white':'black'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{setEdit(false)}} style={{flex: 0.1,display:'flex', justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 20, borderRadius: 5, width: '100%'}}>
                            <AntDesign name="back" size={24} color={props.theme=='dark'?'white':'black'} />
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        </Modal>

  )
}

export default ModalColumn