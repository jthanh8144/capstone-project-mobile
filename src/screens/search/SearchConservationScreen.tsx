import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SafeAreaView, Platform, StyleSheet, View } from 'react-native'
import { SearchBar } from '@rneui/themed'

import Icon from '../../components/ui/Icon'
import IconButton from '../../components/ui/IconButton'
import { LEFT, SEARCH, X_MARK_THIN, X_MARK_IOS } from '../../constants/icons'
import { SearchConservationStackProp } from '../../types'
import FriendList from '../../components/friend/FriendList'
import { User } from '../../models/user'
import { useDebounce } from '../../hooks'
import { useQuery } from '@tanstack/react-query'
import { getFriendsList } from '../../services/http'

export default function SearchConservationScreen({
  navigation,
}: SearchConservationStackProp) {
  const ref = useRef(null)
  const [value, setValue] = useState('')
  const [friends, setFriends] = useState<User[]>([])

  const debouncedValue = useDebounce(value, 200)

  const { isLoading, refetch } = useQuery<User[], Error>(
    ['friendsList'],
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
  const onBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' ? (
        <SearchBar
          ref={ref}
          platform="ios"
          clearIcon={
            <IconButton svgText={X_MARK_IOS} size={20} onPress={onClear} />
          }
          searchIcon={<Icon svgText={SEARCH} size={20} />}
          placeholder="Type query here..."
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          onCancel={onBack}
          showLoading={isLoading}
        />
      ) : (
        <SearchBar
          ref={ref}
          platform="android"
          clearIcon={
            <IconButton svgText={X_MARK_THIN} size={24} onPress={onClear} />
          }
          cancelIcon={<IconButton svgText={LEFT} size={24} onPress={onBack} />}
          searchIcon={<Icon svgText={SEARCH} size={20} />}
          placeholder="Type query here..."
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          showLoading={isLoading}
        />
      )}
      <View style={styles.wrapper}>
        <FriendList friends={friends} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
})