import React, { Dispatch, SetStateAction, createContext, useState } from 'react'

import { ChildProps } from '../types'
import { User } from '../models/user'
import { SignalProtocolStore } from './signal'
import { LocalMessage } from '../services/database'

type AppContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  signalStore: SignalProtocolStore
  localMessages: LocalMessage[]
  setLocalMessages: Dispatch<SetStateAction<LocalMessage[]>>
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  signalStore: new SignalProtocolStore(),
  localMessages: [],
  setLocalMessages: () => {},
})

function AppProvider({ children }: ChildProps) {
  const [user, setUser] = useState<User | null>(null)
  const [signalStore] = useState(new SignalProtocolStore())
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>()

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        signalStore,
        localMessages,
        setLocalMessages,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
