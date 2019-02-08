import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder,
  Image,
  Easing
} from 'react-native'
import PropTypes from 'prop-types'

import styles from './styles'

class Slider extends Component {
  static propTypes = {
    
    /**
     * Set value of the slider. The value should be between minimumValue
     * and maximumValue, which default value is 0.
     */
    value: PropTypes.number,
    
    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,
    
    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,
    
    /**
     * Callback that is called when the user begin touch the slider,
     * The current value is passed as an argument to the callback handler.
     */
    onSlidingStart: PropTypes.func,
    
    /**
     * Callback continuously called while the user is dragging the slider,
     * The current value is passed as an argument to the callback handler.
     */
    onValueChange: PropTypes.func,
    
    /**
     * Callback that is called when the user releases the slider,
     * regardless if the value has changed. The current value is passed
     * as an argument to the callback handler.
     */
    onSlidingComplete: PropTypes.func,
    
    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * If true the slider do not show hover effect.
     * Default value is true.
     */
    disabledHoverEffect: PropTypes.bool,
    
    /**
     * Step value of the slider. The value should be
     * between minimumValue to maximumValue).
     * Default value is 0.
     */
    step: PropTypes.number,
    
    /**
     * The color used for the track on the left side of thumb button.
     * Overrides the default '#08b4c0' color.
     */
    minimumTrackTintColor: PropTypes.string,
    
    /**
     * The color used for the track on the right side of thumb button.
     * Overrides the default '#d8d8d8' color.
     */
    maximumTrackTintColor: PropTypes.string,
    
    /**
     * Foreground color of thumb button.
     */
    thumbTintColor: PropTypes.string,
    
    /**
     * Size of thumb button.
     */
    thumbButtonSize: PropTypes.number,
    
    /**
     * Width of slider component.
     */
    sliderWidth: PropTypes.number,
    
    /**
     * Height of slider component.
     */
    sliderHeight: PropTypes.number,
    
    /**
     * Border radius of slider component.
     */
    sliderBorderRadius: PropTypes.number,
    
    /**
     * Sets an image for the thumb button. Only static images are supported.
     */
    thumbImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    
    /**
     * Sets an react component for override the thumb button.
     */
    thumbButton: PropTypes.element
  }

  static defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 1,
    onSlidingStart() {},
    onValueChange() {},
    onSlidingComplete() {},
    disabled: false,
    disabledHoverEffect: true,
    step: 0,
    minimumTrackTintColor: '#3F51B5',
    maximumTrackTintColor: '#BDBDBD',
    thumbTintColor: '#3F51B5',
    thumbButtonSize: 24,
    sliderWidth: 325,
    sliderHeight: 6,
    sliderBorderRadius: 3,
    thumbImage: null,
    thumbButton: null
  }

  constructor(props) {
    super(props)
    this.state = {
      sliderAnim: new Animated.Value(props.value),
      buttonHoverAnim: new Animated.Value(0)
    }
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderRelease
    })
    
    /**
     * Lasted position of thumb button. when user sliding complete.
     */
    this._lastedPosition = props.value || 0
    
    /**
     * Lasted current position of thumb button. when user sliding thumb button.
     */
    this._lastedMoveValue = 0
    
    /**
     * Status that tell whether this component change value from value props
     */
    this._isValueChangeFromProps = false

    /**
     * Hit slop config for use in thumb button
     */
    this._hitSlopConfig = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setCurrentValue(this.props.value)
      
      /**
       * If value props change set this.isValueChangeFromProps to true.
       */
      this._isValueChangeFromProps = true
    }
  }

  /**
   * @param {number} currentValue
   * Set current value of sliderAnim instance in state.
   */
  setCurrentValue = currentValue => this.state.sliderAnim.setValue(currentValue)

  /**
   * Get current value of sliderAnim instance in state.
   */
  getCurrentValue = () => this.state.sliderAnim.__getValue()

  /**
   * @param {number} hoverBackgroundSize a value of maximum hover background size
   * @param {number} buttonSize a value of button size
   * @returns {number} a ratio between hoverBackgroundSize and buttonSize
   */
  getHoverScaleRatio = (hoverBackgroundSize, buttonSize) => hoverBackgroundSize / buttonSize

  startButtonHoverAnim = () => {
    Animated.timing(
      this.state.buttonHoverAnim,
      {
        toValue: this.getHoverScaleRatio(44, 24),
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1)
      }
    ).start()
  }

  stopButtonHoverAnim = () => {
    Animated.timing(
      this.state.buttonHoverAnim,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1)
      }
    ).start()
  }

  handlePanResponderGrant = () => {
    const { disabled, disabledHoverEffect } = this.props
    if (disabled) {
      return
    }

    if (!disabledHoverEffect) {
      this.startButtonHoverAnim()
    }

    if (this._isValueChangeFromProps) {
      
      /**
       * Set lasted position of thumb button each time. 
       * When user touch thumb button.
       * If this component change value from props.
       */
      this._lastedPosition = this.props.value
    }
    
    /**
     * Pass current value of sliderAnim instance to the onSlidingStart props. 
     * when the gesture has started.
     */
    this.props.onSlidingStart(this.getCurrentValue())
  }

  handlePanResponderMove = (evt, gestureState) => {
    const {
      minimumValue,
      maximumValue,
      disabled,
      step,
      sliderWidth
    } = this.props
    
    /**
     * Range of value between maximumValue and minimumValue.
     */
    const valueRange = maximumValue - minimumValue
    
    /**
     * Ratio between slider width and Range of value between maximumValue and minimumValue.
     */
    const ratio = sliderWidth / valueRange
    
    /**
     * Current position of thumb button.
     */
    let currentPosition = (this._lastedPosition + (gestureState.dx / ratio))
    
    if (disabled) {
      return
    }
    if (currentPosition <= minimumValue) {
      
      /**
       * If current position of thumb button out of range from minimum value.
       * Set it to minimum value.
       */
      currentPosition = minimumValue
    }
    if (currentPosition >= maximumValue) {
      
      /**
       * If current position of thumb button out of range from maximum value.
       * Set it to maximum value.
       */
      currentPosition = maximumValue
    }
    if (step) {
      
      /**
       * If step props not equal to zero.
       * Calculate current position from this formular.
       */
      currentPosition = (Math.round((currentPosition - minimumValue) / step) * step) + minimumValue
    }
    const isValueChange = this._lastedMoveValue !== currentPosition
    if (step && isValueChange) {
      
      /**
       * If value has changed and step props not equal to zero.
       * Pass current position of thumb button to handleOnValueChange method.
       */
      this.handleOnValueChange(currentPosition)
    } else if (isValueChange) {
      
      /**
       * If value has changed.
       * Pass current value of sliderAnim instance to handleOnValueChange method.
       */
      this.handleOnValueChange(this.getCurrentValue())
    }
    
    /**
     *! Set current position value to sliderAnim instance every time. When moving occur.
     */
    this.setCurrentValue(currentPosition)
    
    /**
     * After thumb button finish move one time.
     * Set current position value to _lastedMoveValue property.
     */
    this._lastedMoveValue = currentPosition
  }

  handlePanResponderRelease = () => {
    const { disabled, disabledHoverEffect } = this.props
    if (disabled) {
      return
    }

    if (!disabledHoverEffect) {
      this.stopButtonHoverAnim()
    }
    
    /**
     * When the user releases the slider.
     * Set current value to _lastedPosition property 
     */
    this._lastedPosition = this.getCurrentValue()
    this.handleOnSlidingComplete()
  }

  /**
   * @param {number}
   * Pass current value of sliderAnim instance to the onValueChange props.
   * when the gesture is sliding.
   */
  handleOnValueChange = (currentPosition) => {
    this.props.onValueChange(currentPosition)
  }

  /**
   * Pass current value of sliderAnim instance to the onSlidingStart props. 
   * when the gesture has finished.
   */
  handleOnSlidingComplete = () => {
    this.props.onSlidingComplete(this.getCurrentValue())
  }

  /**
   * Render thumb button from thumbImage props
   * @param valueRatio Animated.AnimatedInterpolation
   */
  renderImageThumbButton = valueRatio => {
    const { thumbImage, thumbButtonSize } = this.props
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        hitSlop={this._hitSlopConfig}
        style={{
          position: 'absolute',
          zIndex: 3,
          left: -(thumbButtonSize / 2),
          transform: [{ translateX: valueRatio }]
        }}>
        <Image
          style={{
            width: thumbButtonSize,
            height: thumbButtonSize
          }}
          source={typeof(thumbImage) === 'string'? { uri: thumbImage } : thumbImage}
        />
      </Animated.View>
    )
  }

  /**
   * Render thumb button from thumbButton props
   * @param valueRatio Animated.AnimatedInterpolation
   */
  renderComponentThumbButton = valueRatio => {
    const { thumbButton, thumbButtonSize } = this.props
    const cloneThumbButton = React.cloneElement(
      thumbButton,
      {
        style: {
          ...thumbButton.props.style,
          width: thumbButtonSize,
          height: thumbButtonSize
        }
      }
    )
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        hitSlop={this._hitSlopConfig}
        style={{
          transform: [{ translateX: valueRatio }],
          position: 'absolute',
          zIndex: 3,
          left: -(thumbButtonSize / 2)
        }}
      >
        {cloneThumbButton}
      </Animated.View>
    )
  }

  /**
   * Render default thumb button
   * @param valueRatio Animated.AnimatedInterpolation
   */
  renderDefaultThumbButton= valueRatio => {
    const { thumbTintColor, thumbButtonSize } = this.props
    return (
      <Animated.View
        hitSlop={this._hitSlopConfig}
        style={[
          styles.thumbButton,
          {
            transform: [
              { translateX: valueRatio }
            ],
            backgroundColor: thumbTintColor,
            width: thumbButtonSize,
            height: thumbButtonSize,
            left: -(thumbButtonSize / 2),
            borderRadius: (thumbButtonSize / 2)
          }
        ]}
        {...this._panResponder.panHandlers}
      />
    )
  }

  renderThumbButton = valueRatio => {
    const { thumbImage, thumbButton } = this.props
    if (thumbImage) {
      
      /**
       ** Thumb Button from thumbImage props
       */
      return this.renderImageThumbButton(valueRatio)
    } else if (thumbButton) {
      
      /**
       ** Thumb Button from thumbButton props
       */
      return this.renderComponentThumbButton(valueRatio)
    }
    
    /**
     ** Default Thumb Button
     */
    return this.renderDefaultThumbButton(valueRatio)
  }

  render() {
    const {
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      sliderWidth,
      sliderHeight,
      sliderBorderRadius,
      thumbButtonSize
    } = this.props
    const valueRatio = this.state.sliderAnim.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, sliderWidth]
    })
    return (
      <View style={styles.sliderContainer}>

        {/* Slider track background */}
        <View style={[
          styles.sliderBackground,
          {
            backgroundColor: maximumTrackTintColor,
            width: sliderWidth,
            height: sliderHeight,
            borderRadius: sliderBorderRadius
          }
        ]} />

        {/* Slider track progress */}
        <Animated.View style={[
          styles.sliderProgress,
          {
            width: valueRatio,
            backgroundColor: minimumTrackTintColor,
            height: sliderHeight,
            borderRadius: sliderBorderRadius
          }
        ]} />

        {/* Slider thumb button */}
        {this.renderThumbButton(valueRatio)}

        {/* Hover background */}
        <Animated.View
          style={[
            styles.thumbButtonHover,
            {
              width: thumbButtonSize,
              height: thumbButtonSize,
              borderRadius: thumbButtonSize / 2,
              left: -((thumbButtonSize) / 2),
              transform: [
                { translateX: valueRatio },
                { scale: this.state.buttonHoverAnim }
              ]
            }
          ]}
        />
      </View>
    )
  }
}

export default Slider
