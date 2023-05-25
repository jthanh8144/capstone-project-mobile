import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { SearchBar } from '@rneui/themed'

import Icon from '../../components/ui/Icon'
import IconButton from '../../components/ui/IconButton'
import { SEARCH, X_MARK_IOS } from '../../constants/icons'
import { SearchConservationStackProp } from '../../types'
import FriendList from '../../components/friend/FriendList'
import { User } from '../../models/user'
import { useDebounce } from '../../hooks'
import { useQuery } from '@tanstack/react-query'
import { getFriendsList } from '../../services/http'
import { Colors } from '../../constants/colors'
import { isDarkMode } from '../../utils'

export default function SearchConservationScreen({}: SearchConservationStackProp) {
  const ref = useRef(null)
  const [value, setValue] = useState('')
  const [friends, setFriends] = useState<User[]>([])

  const debouncedValue = useDebounce(value, 200)

  const { isLoading, refetch } = useQuery<User[], Error>(
    ['searchConservation'],
    async () => {
      try {
        const res = await getFriendsList(1, debouncedValue)
        if (res.friends) {
          setFriends(res.friends)
        }
        return res.friends
      } catch (err: any) {
        throw new Error(err?.message)
      }
    },
  )

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  useLayoutEffect(() => {
    ref.current?.focus()
  }, [])

  const onChangeText = (text: string) => {
    setValue(text)
  }
  const onClear = () => {
    setValue('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        ref={ref}
        platform="default"
        clearIcon={
          <IconButton
            svgText={X_MARK_IOS}
            size={20}
            onPress={onClear}
            color={Colors.textDark}
          />
        }
        searchIcon={<Icon svgText={SEARCH} size={20} color={Colors.textDark} />}
        placeholder="Type query here..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        lightTheme={!isDarkMode}
        showLoading={isLoading}
        style={styles.searchBar}
      />
      <View style={styles.wrapper}>
        <FriendList friends={friends} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  wrapper: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
  searchBar: {
    color: Colors.textDark,
  },
})
