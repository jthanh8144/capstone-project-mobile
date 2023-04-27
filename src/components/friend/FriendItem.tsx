import React from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'
import { images } from '../../assets/images'
import { Colors } from '../../constants/colors'
import { User } from '../../models/user'

function FriendItem({ friend }: { friend: User }) {
  const handlePress = () => {}
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}>
      <Image
        source={
          friend?.avatarUrl
            ? { uri: friend.avatarUrl }
            : images.avatarPlaceholder
        }
        style={styles.image}
      />
      <Text style={styles.name}>{friend?.fullName}</Text>
    </Pressable>
  )
}

export default FriendItem

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.textDark,
  },
})
