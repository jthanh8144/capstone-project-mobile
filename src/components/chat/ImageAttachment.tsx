import React from 'react'
import { Image, Pressable, StyleSheet } from 'react-native'

function ImageAttachment({ url }: { url: string }) {
  return (
    <>
      <Pressable
        style={[
          styles.imageContainer,
          // attachments.length === 1 && { flex: 1 },
        ]}>
        <Image source={{ uri: url }} style={styles.image} />
      </Pressable>
    </>
  )
}

export default ImageAttachment

const styles = StyleSheet.create({
  imageContainer: {
    width: '50%',
    aspectRatio: 1,
    padding: 3,
    flex: 1,
  },
  image: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
})
