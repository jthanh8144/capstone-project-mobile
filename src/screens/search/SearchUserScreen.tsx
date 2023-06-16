import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { SearchBar } from '@rneui/themed'

import Icon from '../../components/ui/Icon'
import IconButton from '../../components/ui/IconButton'
import SearchUserList from '../../components/search/SearchUserList'
import { SEARCH, X_MARK_IOS } from '../../constants/icons'
import { SearchUserStackProp } from '../../types'
import { useDebounce } from '../../hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchUser } from '../../services/http'
import { SearchUserResponse } from '../../models/response'
import { isDarkMode } from '../../utils'
import { Colors } from '../../constants/colors'

export default function SearchUserScreen({}: SearchUserStackProp) {
  const ref = useRef(null)
  const [value, setValue] = useState('')
  const [page, setPage] = useState(1)

  const debouncedValue = useDebounce(value, 200)

  const {
    isLoading,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
    data,
  } = useInfiniteQuery<SearchUserResponse, Error>(
    ['searchUser'],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      try {
        if (debouncedValue) {
          return await searchUser(debouncedValue, pageParam)
        } else {
          return {
            success: false,
            nextPage: undefined,
            users: [],
            totalPage: 0,
          }
        }
      } catch (err) {
        throw new Error(err?.message)
      }
    },
    {
      getNextPageParam: ({ nextPage }) => nextPage,
    },
  )
  const handleLoadMore = async () => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage({ pageParam: page + 1 })
      setPage(prevPage => prevPage + 1)
    }
  }
  const users = data?.pages.flatMap(pageData => pageData.users) || []

  useEffect(() => {
    setPage(1)
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
        autoFocus={true}
      />
      <SearchUserList users={users} onLoadMore={handleLoadMore} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  searchBar: {
    color: Colors.textDark,
  },
})
