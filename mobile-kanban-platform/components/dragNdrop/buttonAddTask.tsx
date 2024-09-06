import React from "react";
import { View, TouchableOpacity, Text, Modal, TextInput, Alert, ActivityIndicator, GestureResponderEvent} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import { useUserContext } from "../contexts/userContext";

import { Task, Id } from "./column";

export interface ButtonProps{
    name: string;
    idServer: number;
    isDone: boolean;
    theme: string;
    
    confirmDone: (event: GestureResponderEvent) => void;
    addTask(columnId: Id, definedObject?: Task): void
}

const ButtonAddTask = (props: ButtonProps) => {
    const {addTask, confirmDone} = props;

    const { loadingTasks } = useUserContext();

  return (
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

  )
}

export default ButtonAddTask