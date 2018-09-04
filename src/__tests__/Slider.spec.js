import React from 'react'
import { shallow } from 'enzyme'
import ShallowRenderer from 'react-test-renderer/shallow'
import { View, Image } from 'react-native'

import Slider from '../index'

describe('Test Slider component', () => {
  it('should render correctly', () => {
    const renderer = new ShallowRenderer()
    const result = renderer.render(<Slider />)
    expect(result).toMatchSnapshot()
  })

  describe('Test value props', () => {
    it('should set starting value in Slider. If have props value.', () => {
      const wrapper = shallow(<Slider value={0.5} />)
      const sliderStartingValue = wrapper.instance().state.sliderAnim._startingValue
      const sliderValue = wrapper.instance().state.sliderAnim._value

      expect(sliderStartingValue).toBe(0.5)
      expect(sliderValue).toBe(0.5)
    })

    it('should set value in Slider. If props value has change.', () => {
      const wrapper = shallow(<Slider />)
      const sliderValue = wrapper.instance().state.sliderAnim._value

      expect(sliderValue).toBe(0)

      wrapper.setProps({ value: 0.5 })
      const newSliderValue = wrapper.instance().state.sliderAnim._value
  
      expect(newSliderValue).toBe(0.5)
    })
  })

  describe('When change value props', () => {
    it('It should set this._lastedPosition value by value props. When user start touch thumb button and value props changed.', () => {
      const wrapper = shallow(<Slider />)
      const instance = wrapper.instance()
      expect(instance._lastedPosition).toBe(0) 
      
      wrapper.setProps({ value: 0.6 })
      instance.handlePanResponderGrant()
      expect(instance._lastedPosition).toBe(0.6)
    })
  })

  describe('When user started sliding', () => {
    it('It should call onSlidingStart props. When user started sliding.', () => {
      const wrapper = shallow(<Slider onSlidingStart={jest.fn()} />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance.props, 'onSlidingStart')

      instance.handlePanResponderGrant()
      expect(spy).toHaveBeenCalledWith(0)
    })
  })

  describe('When user finished sliding.', () => {
    it('It should call onSlidingComplete props. When user finished sliding.', () => {
      const wrapper = shallow(<Slider onSlidingComplete={jest.fn()} />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance.props, 'onSlidingComplete')

      instance.handlePanResponderRelease()
      expect(spy).toHaveBeenCalledWith(0)
    })

    it('It should not call onSlidingComplete props. When have disabled props equal to true.', () => {
      const wrapper = shallow(<Slider onSlidingComplete={jest.fn()} disabled />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance.props, 'onSlidingComplete')

      instance.handlePanResponderRelease()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('When user moving Slider', () => {
    it('should set current position value to sliderAnim instance every time. When moving occur.', () => {
      const wrapper = shallow(<Slider />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'setCurrentValue')
      const gestureState = { dx: 100 }

      instance.handlePanResponderMove('event', gestureState)
      expect(spy).toHaveBeenCalledWith(0.3076923076923077)
      expect(instance._lastedMoveValue).toBe(0.3076923076923077)
    })

    it('should not moving Slider. When have props disabled equal to true.', () => {
      const wrapper = shallow(<Slider disabled />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'setCurrentValue')
      const gestureState = { dx: 100 }
      const result = instance.handlePanResponderMove('event', gestureState)
  
      expect(result).toBeUndefined()
      expect(spy).not.toHaveBeenCalled()
    })

    it('should set value in sliderAnim instance to equal minimumValue. When moving slider value less than minimumValue.', () => {
      const wrapper = shallow(<Slider />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'setCurrentValue')
      const gestureState = { dx: -1000 }

      instance.handlePanResponderMove('event', gestureState)
      expect(spy).toHaveBeenCalledWith(0)
    })

    it('should set value in sliderAnim instance to equal maximumValue. When moving slider value more than maximumValue.', () => {
      const wrapper = shallow(<Slider />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'setCurrentValue')
      const gestureState = { dx: 1000 }

      instance.handlePanResponderMove('event', gestureState)
      expect(spy).toHaveBeenCalledWith(1)
    })

    it('should set value in sliderAnim instance to equal value from step formula.', () => {
      const wrapper = shallow(<Slider minimumValue={0} maximumValue={100} step={10} />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'setCurrentValue')
      const gestureState = { dx: 200 }

      instance.handlePanResponderMove('event', gestureState)
      expect(spy).toHaveBeenCalledWith(60)
    })
  })

  describe('Test How to render ThumbButton component', () => {
    it('should use image from thumbImage props to render thumbButton', () => {
      const wrapper = shallow(<Slider thumbImage={'555'} />)

      expect(wrapper.contains(<Image style={{ width: 24, height: 24 }} source={{ uri: '555' }} />)).toBe(true)
    })

    it('should use component from thumbButton props to render thumbButton', () => {
      const thumbButton = (
        <View style={{ width: 24, height: 24, backgroundColor: 'red' }} />
      )
      const wrapper = shallow(<Slider thumbButton={thumbButton} />)

      expect(wrapper.contains(<View style={{ width: 24, height: 24, backgroundColor: 'red' }} />)).toBe(true)
    })
  })

  describe('Test disabledHoverEffect props', () => {
    it('should show hover effect when disabledHoverEffect props is equal to false', () => {
      const wrapper = shallow(<Slider disabledHoverEffect={false} />)
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'startButtonHoverAnim')
      instance.handlePanResponderGrant()

      expect(spy).toHaveBeenCalled()
    })
  })
})
