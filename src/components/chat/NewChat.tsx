import React, { MutableRefObject, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Portal, PortalHost } from '@gorhom/portal'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'

import { User } from '../../models/user'
import { getFriendsList } from '../../services/http'
import FriendList from '../friend/FriendList'
import { useDebounce } from '../../hooks'

export default function NewChat({
  bottomSheetRef,
}: {
  bottomSheetRef: MutableRefObject<BottomSheet>
}) {
  const [value, setValue] = useState('')
  const [friendsList, setFriendsList] = useState<User[]>([])

  const debouncedValue = useDebounce(value, 200)

  const snapPoints = useMemo(() => ['80%'], [])

  const { isLoading, refetch } = useQuery<User[], Error>(
    ['friendsList'],
    async () => {
      try {
        const res = await getFriendsList(1, debouncedValue)
        if (res.friends) {
          setFriendsList(res.friends)
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

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} pressBehavior="collapse" opacity={1} />
  )

  return (
    <>
      <Spinner visible={isLoading} />
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          style={styles.sheetContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.bottomSheetTitle}>Add new message</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>To:</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Enter name..."
                value={value}
                onChangeText={text => setValue(text)}
                style={styles.input}
              />
            </View>
            <FriendList
              friends={friendsList}
              onPressItem={() => {
                bottomSheetRef.current.close()
              }}
            />
          </View>
        </BottomSheet>
      </Portal>
      <PortalHost name="add-conservation" />
    </>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: 'transparent',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    elevation: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginRight: 6,
  },
  input: {
    fontSize: 16,
    flex: 1,
    padding: 2,
  },
})
