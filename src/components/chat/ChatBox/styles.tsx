import { StyleSheet } from 'react-native'
import { Colors } from '../../../constants/colors'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.chatBoxContainer,
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: Colors.chatBoxBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cancelWrapper: {
    alignItems: 'center',
    marginTop: 15,
  },
  attachmentsContainer: {
    alignItems: 'flex-end',
  },
  imageWrapper: {
    backgroundColor: Colors.backgroundDark,
  },
  selectedImage: {
    height: 100,
    width: 150,
    margin: 5,
  },
  removeSelectedImage: {
    position: 'absolute',
    right: 10,
    backgroundColor: Colors.background,
    borderRadius: 100,
    overflow: 'hidden',
  },
})
