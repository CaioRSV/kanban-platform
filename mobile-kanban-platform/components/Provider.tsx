import React, { ReactNode } from 'react'

import { ProviderUserContext } from '../components/contexts/userContext';
import { ProviderTaskContext } from '../components/contexts/tasksContext';

import {useColorScheme} from 'react-native';


function Provider({ children }) {
  
  const colorScheme = useColorScheme();
  
  return (
    <>
    <ProviderUserContext>
      <ProviderTaskContext>
          {children}
      </ProviderTaskContext>
    </ProviderUserContext>
    </>
  )
}

export default Provider