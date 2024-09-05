import { View, Text, Button, Switch, TouchableOpacity, Modal, ActivityIndicator, Linking} from 'react-native'
import { ScrollView } from 'react-native-virtualized-view'

import React, {useState} from 'react'

import { useUserContext } from "../components/contexts/userContext";
import { useTaskContext } from "../components/contexts/tasksContext";

import SetUserModal from './setUserModal';

import { useColorScheme } from 'nativewind';

import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';

import Workspace from './dragNdrop/workspace';

import {Dimensions} from 'react-native';
import RatioGraph from './graphs/ratioGraph';
import DoneLineGraph from './graphs/doneLineGraph';
import TopBar from './topBar/topBar';
import SaveColumns from './saveColumns';
import GraphDrawer from './graphs/graphDrawer';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const Main = () => {

  const [graphModal, setGraphModal] = useState<boolean>(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const {
    user, setUser, id, setId, 
    setColumn1_name, column1_name,
    setColumn2_name, column2_name,
    setColumn3_name,column3_name,
    setColumn1, column1,
    setColumn2, column2,
    setColumn3, column3,
    loadingTasks, setLoadingTasks
  } = useUserContext();

  const {setTasks} = useTaskContext();

    //

  return (
    <View style={{overflow: 'scroll'}} className={`h-full w-full dark:bg-black p-8 relative`}>

        <SetUserModal theme={colorScheme=='dark'?'dark':'light'}/> 

        <TopBar/>
        <ScrollView>
        <SaveColumns/>
        <Workspace theme={colorScheme=='dark' ? 'dark' : 'light'}/>
        <GraphDrawer/>

        </ScrollView>
    </View>
  )
}

export default Main