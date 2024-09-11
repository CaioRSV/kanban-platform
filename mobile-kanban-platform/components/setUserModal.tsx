import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'

import AntDesign from '@expo/vector-icons/AntDesign';

import React, { useState } from 'react'

import { useUserContext } from './contexts/userContext';
import { useTaskContext } from './contexts/tasksContext';
import { ExecutionResult, graphql, GraphQLSchema } from 'graphql';
import { getTasksFunction_GQL, getUserFunction_GQL } from '../utils/graphQl_functions';

type Id = string | number;

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


interface SetUserModalProps{
  theme: string;
  schema?: GraphQLSchema;
}

const SetUserModal = ({theme, schema}: SetUserModalProps) => {
  // Contextos
  const {
    user, setUser, setId, 
    setColumn1_name, 
    setColumn2_name, 
    setColumn3_name,
    setColumn1,
    setColumn2,
    setColumn3,
    setLoadingTasks
  } = useUserContext();

  const { setTasks } = useTaskContext();

  // Variáveis de estado locais
  const [tempUserName, setTempUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  // Método de definição de user localmente
  async function setUserServer(userName:string){
    if(userName.length==0 || !schema) return;

    setLoading(true);

    // Parte REST (populating) apenas para verificação se usuário existe ou não (simplicidade)
    const userRes = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/api/user?name="+userName, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(data => data.resposta.rows);

    if(userRes.length>0){ // Fetch no banco (área de trabalho existente)
      const userFound = userRes[0];

      await loginFunction(userName, parseInt(userFound.id)); // Setando usuário e populando tasks na base
      
      const resUser = await getUserFunction_GQL(userName, schema); // Fetch user data na base
      
      if(resUser){
        const resTasks = await getTasksFunction_GQL(parseInt(resUser.id), false, schema); // Fetch tasks do user

        setLoadingTasks(true); // Loading nas colunas

        setUser(resUser.name);
        setId(parseInt(resUser.id));

        if(resUser.column1_name !== null && resUser.column1_name !==undefined) setColumn1_name(resUser.column1_name);
        if(resUser.column2_name !== null && resUser.column2_name !==undefined) setColumn2_name(resUser.column2_name);
        if(resUser.column3_name !== null && resUser.column3_name !==undefined) setColumn3_name(resUser.column3_name);

        if(resTasks){
          const col1 = resUser.column1;
          const col2 = resUser.column2;
          const col3 = resUser.column3;

          // typing
          const resTasks_Filtered = resTasks.map(elem => ({
            ...elem,
            id: typeof elem.id === 'string' ? parseInt(elem.id) : elem.id
          }))

          // Para considerar nos relatórios apenas as ainda não concluídas
          setColumn1(resUser.column1.filter(num => resTasks_Filtered.find(elem => elem.id==num)));
          setColumn2(resUser.column2.filter(num => resTasks_Filtered.find(elem => elem.id==num)));
          setColumn3(resUser.column3.filter(num => resTasks_Filtered.find(elem => elem.id==num)));

          // Atualizando localmente as tasks

          const resultingTasks = resTasks_Filtered.map( (item) => ({
            ...item,
            columnId: 
                col1.includes(item.id) ? 1 : 
                col2.includes(item.id) ? 2 :
                col3.includes(item.id) ? 3 :
                  0,
            name: item.name,
            serverId: item.id,
            id: Math.floor(Math.random()*10000),
          })
            ).sort((a,b)=> [...col1, ...col2, ...col3].findIndex(item => item==a.serverId)>[...col1, ...col2, ...col3].findIndex(item => item==b.serverId) ? 0 : -1);
          
          // Acima está garantindo a projeção das tasks recebidas na ordem que as colunas do usuário indicam

          setTasks(resultingTasks)
        
        }
        setLoadingTasks(false);
      } 

    }
    else{ // Criação de conta (Usuário não tinha área de trabalho anteriormente)
      const createUserRes = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/api/user/add?name="+userName, {
        method: 'GET' // Se cria o usuário no banco com REST (populating, necessário)
      })
      .then(res => res.json())
      .then(data => {
        return data.resposta.id
      });

      if(createUserRes != undefined){
        setUser(userName);
      }

      const userCreated = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/api/user?name="+userName, {
        method: 'GET' // Se busca mais uma vez no banco para finalmente transferir de vez para a base local GraphQL
      })
      .then(res => res.json())
      .then(data => data.resposta.rows);
  
      await loginFunction(userName, parseInt(userCreated.id))
      
      const resUser = await getUserFunction_GQL(userName, schema);

      if(resUser){
        setUser(resUser.name);
        setId(parseInt(resUser.id));
      }
    }

    setLoading(false);
  }

  const loginFunction = async (username: String, userId: number) => {
    if(schema){  
      const query = `
          mutation Login($username: String!) {
          login(username: $username)
        }
      `

      const vars = {
          "username": username
      }
  
      const result: ExecutionResult = await graphql({
          schema,
          source: query,
          variableValues: vars
      })

      // Task fetching

      const query_tasks = `
        mutation PopTasks($id: Int!) {
          populateTasks(id: $id)
        }
      `
  
      const vars_tasks = {
          "id": userId
      }
  
      const result_tasks: ExecutionResult = await graphql({
          schema,
          source: query_tasks,
          variableValues: vars_tasks
      })

      // Para debugging
      return {
        user_message: result,
        tasks_message: result_tasks
      }
    }
}

  return (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!user || user.length==0}
        >
           <View className={`w-full h-full flex justify-center p-4`} style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <View className={`${theme=='dark'?'bg-black':'bg-white'} p-4 flex gap-2 rounded-md border border-slate-500`}>
                    <Text className={`text-lg font-semibold ${theme=='dark'?'text-white':'text-black'}`}>Quem é você?</Text>
                    <Text className={`mb-2 ${theme=='dark'?'text-white':'text-black'}`}>Informe seu nome de usuário para acessar sua área de trabalho</Text>
                    
                    <TextInput onChangeText={(e)=>{setTempUserName(e)}} className={`border m-2 text-lg p-2 rounded-md ${theme=='dark'?'border-white text-white':'border-black text-black'}`}></TextInput>
                    <TouchableOpacity className={`flex flex-row justify-center border rounded-full p-3 gap-2 items-center ${theme=='dark'?'border-white':'border-black'} `} onPress={()=>{setUserServer(tempUserName)}}>
                        <AntDesign name="login" size={32} color={`${theme=='dark'?'white':'black'}`} />
                    </TouchableOpacity>

                    {
                      loading && <View className={`w-full flex flex-row justify-center`}>
                        <ActivityIndicator size="small" color={theme=='dark'? 'white' : 'black'} />
                      </View>
                    }
                </View>
            </View>
        </Modal>
  )
}

export default SetUserModal