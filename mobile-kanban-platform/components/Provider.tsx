import React, { ReactNode } from 'react'

import { ProviderUserContext } from '../components/contexts/userContext';
import { ProviderTaskContext } from '../components/contexts/tasksContext';

function Provider({ children }) {
  return (
    <ProviderUserContext>
      <ProviderTaskContext>
          {children}
      </ProviderTaskContext>
    </ProviderUserContext>
  )
}

export default Provider