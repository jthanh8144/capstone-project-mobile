import { useRef, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'

export function useRefreshOnFocus(refetch: () => void) {
  const enabledRef = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (enabledRef.current) {
        refetch()
      } else {
        enabledRef.current = true
      }
    }, [refetch]),
  )
}
