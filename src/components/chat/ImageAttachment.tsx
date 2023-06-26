import React, { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import ImageView from 'react-native-image-viewing'
import FastImage from 'react-native-fast-image'

import { images } from '../../assets/images'
import { Colors } from '../../constants/colors'

function ImageAttachment({ url }: { url: string }) {
  const [isShowImgFullScreen, setIsShowImgFullScreen] = useState(false)

  return (
    <>
      <Pressable
        style={[
          styles.imageContainer,
          // attachments.length === 1 && { flex: 1 },
        ]}
        onPress={() => {
          setIsShowImgFullScreen(true)
        }}>
        <FastImage
          source={url ? { uri: url } : images.imagePlaceholder}
          style={styles.image}
        />
      </Pressable>
      <ImageView
        images={[{ uri: url }]}
        imageIndex={0}
        visible={isShowImgFullScreen}
        onRequestClose={() => setIsShowImgFullScreen(false)}
      />
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
    width: '100%',
    height: '100%',
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
  },
})
