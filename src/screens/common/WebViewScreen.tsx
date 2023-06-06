import React, { useLayoutEffect } from 'react'
import { Linking, StyleSheet } from 'react-native'
import { WebView, WebViewNavigation } from 'react-native-webview'

import { WebViewStackProp } from '../../types'

export default function WebViewScreen({ navigation, route }: WebViewStackProp) {
  const { url, title, openingOnBrowser } = route.params

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStateChange = (event: WebViewNavigation) => {
    Linking.openURL(event.url)
  }

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={openingOnBrowser ? handleStateChange : () => {}}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
