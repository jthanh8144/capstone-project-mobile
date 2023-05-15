import React, { useMemo, useRef, useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  CurvedBottomBar,
  ICurvedBottomBarRef,
} from 'react-native-curved-bottom-bar'
import BottomSheet from '@gorhom/bottom-sheet'

import Icon from '../components/ui/Icon'
import { Colors } from '../constants/colors'
import { ADD_FRIEND, CHAT, FRIEND, PERSON, PLUS } from '../constants/icons'
import FriendRequestScreen from '../screens/friend/FriendRequestScreen'
import FriendListScreen from '../screens/friend/FriendListScreen'
import ChatListScreen from '../screens/chat/ChatListScreen'
import ProfileScreen from '../screens/user/ProfileScreen'
import NewChat from '../components/chat/NewChat'

const ThemeScreen = () => {
  const ref = useRef<ICurvedBottomBarRef>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [type, setType] = useState<'DOWN' | 'UP'>('DOWN')

  const _renderIcon = (routeName: string, selectedTab: string) => {
    let icon = ''
    switch (routeName) {
      case 'ChatList':
        icon = CHAT
        break
      case 'FriendRequest':
        icon = ADD_FRIEND
        break
      case 'FriendList':
        icon = FRIEND
        break
      case 'Profile':
        icon = PERSON
        break
    }

    return (
      <Icon
        svgText={icon}
        size={28}
        color={routeName === selectedTab ? Colors.primary : Colors.gray}
      />
    )
  }

  const main = useMemo(() => {
    return (
      <View style={styles.container}>
        <CurvedBottomBar.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerTitleAlign: 'left',
            headerShadowVisible: false,
          }}
          shadowStyle={styles.shadow}
          ref={ref}
          type={type}
          circlePosition="CENTER"
          height={65}
          circleWidth={50}
          bgColor="white"
          borderTopLeftRight={true}
          initialRouteName="ChatList"
          renderCircle={({ routeName, selectedTab, navigate }) => (
            <>
              <TouchableOpacity
                style={[
                  type === 'DOWN' ? styles.btnCircle : styles.btnCircleUp,
                ]}
                onPress={() => {
                  if (bottomSheetRef.current) {
                    bottomSheetRef.current.expand()
                  }
                  if (routeName !== selectedTab) {
                    if (routeName === 'NewChat') {
                      setType('UP')
                    } else {
                      navigate(routeName)
                      setType('DOWN')
                    }
                  }
                }}>
                <Icon
                  svgText={PLUS}
                  size={25}
                  color={
                    selectedTab === routeName ? Colors.primary : Colors.textDark
                  }
                />
              </TouchableOpacity>
              <NewChat bottomSheetRef={bottomSheetRef} />
            </>
          )}
          tabBar={({ routeName, selectedTab, navigate }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (routeName !== selectedTab) {
                    // navigate(routeName)
                    if (routeName !== 'NewChat') {
                      navigate(routeName)
                      setType('DOWN')
                    } else {
                      Alert.alert('click')
                      setType('UP')
                    }
                  }
                }}
                style={styles.tabBarIcon}>
                {_renderIcon(routeName, selectedTab)}
              </TouchableOpacity>
            )
          }}>
          <CurvedBottomBar.Screen
            name="ChatList"
            position="LEFT"
            component={ChatListScreen}
          />
          <CurvedBottomBar.Screen
            name="FriendRequest"
            component={FriendRequestScreen}
            position="LEFT"
          />
          <CurvedBottomBar.Screen
            name="FriendList"
            position="RIGHT"
            component={FriendListScreen}
          />
          <CurvedBottomBar.Screen
            name="Profile"
            component={ProfileScreen}
            position="RIGHT"
          />
        </CurvedBottomBar.Navigator>
      </View>
    )
  }, [type])

  return main
}

function BottomTabNavigation() {
  return <ThemeScreen />
}

export default BottomTabNavigation

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  btnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    bottom: 28,
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
    bottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  tabBarIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
