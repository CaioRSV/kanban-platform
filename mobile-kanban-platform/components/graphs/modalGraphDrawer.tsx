import { View, Text, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { SetStateAction } from 'react'
import DoneLineGraph from './doneLineGraph';
import RatioGraph from './ratioGraph';

import { useUserContext } from '../contexts/userContext';
import { useColorScheme } from 'nativewind';

interface ModalGraphDrawerProps{
  graphModal: boolean;
  setGraphModal: React.Dispatch<SetStateAction<boolean>>;
  doneLabels: string[];
  doneSeries: number[];
}

const ModalGraphDrawer = ( props: ModalGraphDrawerProps ) => {
    const {
        column1_name,
        column2_name,
        column3_name,
        column1,
        column2,
        column3,
        loadingTasks
    } = useUserContext();

    const { colorScheme } = useColorScheme();

  return (
    <Modal
      visible={props.graphModal}
      animationType="slide"
      transparent={true}
    >
      <View className={`w-full h-full flex justify-center`} style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        <TouchableOpacity onPress={()=>{props.setGraphModal(false)}} className={`w-full flex items-center rounded-t-full p-2 border-t border-l border-r`} style={{backgroundColor: colorScheme=='dark'?'black':'white', borderColor: colorScheme=='dark'?'white':'black'}}>
          <View className={`h-[3px] bg-slate-300 mt-2 w-[25%] rounded-full opacity-50 mb-3`} />
          <Text className={`text-lg`} style={{color: colorScheme=='dark'?'white':'black'}}>Relatórios</Text>
          <Text className={`text-slate-500`}>Informações sobre suas atividades no aplicativo.</Text>
        </TouchableOpacity>

        <View className={`flex-1 h-32 border-l border-r flex items-center`} style={{backgroundColor: colorScheme=='dark'?'black':'white', borderColor: colorScheme=='dark'?'white':'black'}}>
          {
            loadingTasks
              ?
              <View className={`w-full h-full flex flex-row justify-center items-center`}>
                <ActivityIndicator size="large" color={colorScheme=='dark'? 'white' : 'black'} />
              </View>
              :
              <>
                <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'black'}}/>
                <Text style={{color: colorScheme=='dark'?'white':'black'}}>Distribuição de suas tarefas por coluna</Text>
                <RatioGraph column1_name={column1_name ?? 'A fazer'} column1={column1 ?? []} column2_name={column2_name ?? 'Em progresso'} column2={column2 ?? []} column3_name={column3_name ?? 'Finalizadas'} column3={column3 ?? []}/>

                <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'gray'}}/>
                <Text style={{color: colorScheme=='dark'?'white':'black'}}>Tarefas realizadas por período de tempo</Text>
                <DoneLineGraph theme={colorScheme=='dark'?'dark':'light'} labels={props.doneLabels} series={props.doneSeries} />
                <View className={`w-[80%] h-[1px] mb-2`} style={{backgroundColor: colorScheme=='dark' ?'white':'gray'}}/>
              </>
          }
        </View>
      </View>
  </Modal>
  )
}

export default ModalGraphDrawer