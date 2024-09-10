import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

import { useColorScheme } from 'nativewind';
import { useUserContext } from './contexts/userContext';

const SaveColumns = () => {
    const { colorScheme } = useColorScheme();

    const {
        id,
        column1,
        column2,
        column3,
      } = useUserContext();

    async function saveColumns() {
        const col1_params = `${column1.length> 0 ? `&column1=${column1.join(',')}` : ``}`;
        const col2_params = `${column2.length> 0 ? `&column2=${column2.join(',')}` : ``}`;
        const col3_params = `${column3.length> 0 ? `&column3=${column3.join(',')}` : ``}`;
        
        // Update (apenas envio, sem uso local)
        await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/user/update?id=${id}${col1_params}${col2_params}${col3_params}`);
    }

  return (
    <TouchableOpacity onPress={saveColumns} className={`border rounded-md flex flex-row gap-2 justify-center items-center m-4 p-4`} style={{borderColor: 'gray'}}>
        <Text className={`text-lg`} style={{color: colorScheme=='dark' ? 'white' : 'black'}} >Salvar</Text>
        <FontAwesome5 name="save" size={24} style={{color: colorScheme=='dark' ? 'white' : 'black'}} />
    </TouchableOpacity>
  )
}

export default SaveColumns