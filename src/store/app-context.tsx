import React, { Dispatch, SetStateAction, createContext, useState } from 'react'

import { ChildProps } from '../types'
import { User } from '../models/user'

type AppContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
})

function AppProvider({ children }: ChildProps) {
  const [user, setUser] = useState<User | null>(null)

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
