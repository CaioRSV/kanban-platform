import React, { ReactNode } from 'react'

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import { ProviderUserContext } from '@/components/contexts/userContext';

function Provider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
    <ProviderUserContext>
          {children}
    </ProviderUserContext>
    </>
  )
}

export default Provider