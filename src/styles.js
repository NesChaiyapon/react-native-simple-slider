import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderBackground: {
    borderRadius: 3,
  },
  sliderProgress: {
    width: 0,
    borderRadius: 3,
    position: 'absolute',
    zIndex: 1,
  },
  thumbButton: {
    marginLeft: 0,
    position: 'absolute',
    zIndex: 3
  },
  thumbButtonHover: {
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
    position: 'absolute',
    zIndex: 2
  },
})

export default styles
