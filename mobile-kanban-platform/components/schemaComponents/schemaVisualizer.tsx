import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Fontisto from '@expo/vector-icons/Fontisto';
import { useColorScheme } from 'nativewind';
import { GraphQLSchema } from 'graphql';
import { getTasksFunction_GQL, getUserFunction_GQL } from '../../utils/graphQl_functions';
import { useUserContext } from '../contexts/userContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { User } from './schemaWrapper';



interface SchemaVisualizerProps{
  schema?: GraphQLSchema
  theme: string
}

const SchemaVisualizer = ({schema, theme} : SchemaVisualizerProps) => {
    const {user, id} = useUserContext();
    const { colorScheme } = useColorScheme();
    //
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [userQuery, setUserQuery] = useState<string>("{}"); // Evitar erro com JSON.parse
    const [tasksQuery, setTasksQuery] = useState<string>("{}"); // ^ =
    const [doneTasksQuery, setDoneTasksQuery] = useState<string>("{}"); // ^ =

    const handleOpen = async () => {
      const resUser: User = await getUserFunction_GQL(user, schema);
      const resTasks = await getTasksFunction_GQL(id, false, schema);
      const resDoneTasks = await getTasksFunction_GQL(id, true, schema);

      if(resUser && resTasks){
        const tasksInColumns = [...resUser.column1, ...resUser.column2, ...resUser.column3];
        
        const presentTasks = resTasks.filter(elem => tasksInColumns.includes( 
          typeof elem.id === "string" ? parseInt(elem.id) : elem.id
        ));

        setUserQuery(JSON.stringify({name: resUser.name, id: resUser.id}));
        setTasksQuery(JSON.stringify(presentTasks));
        setDoneTasksQuery(JSON.stringify(resDoneTasks));
      }
    }
    //

    const QueryResContainer = ({title, queryString} : {title: string, queryString: string}) => {
      return (
        <View style={{marginBottom: 10, width: '100%'}}>
          <Text style={{color: 'black', fontSize: 16, marginVertical: 10}}>{title}</Text>
          <View style={{backgroundColor: 'black', width: '100%', height: 'auto', overflow: 'scroll', padding: 5, borderRadius: 15}}>
            <Text style={{color: 'rgba(0,255,0,1)', fontSize: 13}}>{
              JSON.stringify(JSON.parse(queryString), null, 4)
            }</Text>
          </View>
        </View>
      );
    }

    const Divisor = () => {
      return (
        <View style={{width: '100%', height: 1, backgroundColor: 'rgba(110,110,110,0.8)', marginVertical: 10}}></View>
      );
    }
    
  return (
    <>
    <TouchableOpacity onPress={()=>{handleOpen();setOpenModal(true)}} className={`border rounded-md flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: 'gray'}}>
        <Text className={`text-lg`} style={{color: colorScheme=='dark' ? 'white' : 'black'}} >View GraphQL</Text>
        <Fontisto name="graphql" size={24} style={{color: colorScheme=='dark' ? '#ec4899' : '#f472b6'}} />
    </TouchableOpacity>
    <Modal 
            statusBarTranslucent
            visible={openModal}
            transparent={true}
            animationType="slide"
    >

      <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <ScrollView nestedScrollEnabled contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} style={{width: '100%', height: '90%', overflow: 'scroll', display: 'flex', backgroundColor: theme=='dark' ? 'black' : 'white', borderWidth: 1, borderColor: 'gray', padding: 20, borderRadius: 15}}>
          <View style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Status da base local GraphQL</Text>
            <View style={{flex: 1}}/>
            <TouchableOpacity onPress={()=>{setOpenModal(false)}} style={{borderWidth: 1, borderColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 5}}>
              <AntDesign name="back" size={24} color={theme=='dark'?'white':'black'} />
            </TouchableOpacity>
          </View>

          <Divisor/>

          <QueryResContainer title="Query - Dados do usuário atual" queryString={userQuery} />

          <Divisor/>

          <QueryResContainer title="Query - Tarefas atuais" queryString={tasksQuery} />

          <Divisor/>

          <QueryResContainer title="Query - Tarefas concluídas" queryString={doneTasksQuery} />

          <Divisor/>
          
        </ScrollView>
      </View>

    </Modal>
    </>

  )
}

export default SchemaVisualizer