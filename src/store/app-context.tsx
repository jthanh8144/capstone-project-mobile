import React, { Dispatch, SetStateAction, createContext, useState } from 'react'

import { ChildProps } from '../types'
import { User } from '../models/user'
import { FriendRequest } from '../models/friend-request'

type AppContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  receivedList: FriendRequest[]
  setReceivedList: Dispatch<SetStateAction<FriendRequest[]>>
  sendedList: FriendRequest[]
  setSendedList: Dispatch<SetStateAction<FriendRequest[]>>
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  receivedList: [],
  setReceivedList: () => {},
  sendedList: [],
  setSendedList: () => {},
})

function AppProvider({ children }: ChildProps) {
  const [user, setUser] = useState<User | null>(null)
  const [receivedList, setReceivedList] = useState<FriendRequest[]>([])
  const [sendedList, setSendedList] = useState<FriendRequest[]>([])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        receivedList,
        setReceivedList,
        sendedList,
        setSendedList,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
