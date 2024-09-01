import React, { ReactNode } from 'react'

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { ProviderUserContext } from '@/components/contexts/userContext';
import { ProviderTaskContext } from '@/components/contexts/tasksContext';

function Provider({ children, ...props }: ThemeProviderProps) {
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