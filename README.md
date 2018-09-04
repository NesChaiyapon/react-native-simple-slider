# React Native Simple Slider

This is a simple javascript slider component for react native.

This package is compatible both **Android** and **iOS**.

![Slider component preview image](https://raw.githubusercontent.com/NesChaiyapon/react-native-simple-slider/master/images/slider-preview.png)

## Installation

`$ yarn add react-native-simple-slider`

or

`$ npm install react-native-simple-slider --save`

## Usage

```jsx
state = { value: 0 }

<Slider
  value={this.state.value}
  onValueChange={value => this.setState({ value })}
  disabledHoverEffect={false}
/>
```

## Props

| Attributes            | Type          | Default       | Description  |
| :---------            | :--:          | :-----:       | :----------- |
| value                 | `number`      | `0`           | Value of the slider. |
| minimumValue          | `number`      | `0`           | Minimum value of the slider. |
| maximumValue          | `number`      | `1`           | Maximum value of the slider. |
| onSlidingStart        | `func`        | `() => {}`    | Callback function that is called when the user begin touch the slider. |
| onValueChange         | `func`        | `() => {}`    | Callback fucntion that is called while the user is dragging the slider. |
| onSlidingComplete     | `func`        | `() => {}`    | Callback function that is called when the user releases the slider. |
| disabled              | `boolean`     | `false`       | If true the user won't be able to move the slider. |
| disabledHoverEffect   | `boolean`     | `true`        | If true the slider do not show hover effect. |
| step                  | `number`      | `0`           | Step value of the slider. The value should be between minimumValue to maximumValue. |
| minimumTrackTintColor | `string`      | `#3F51B5`     | The color used for the track on the left side of thumb button. |
| maximumTrackTintColor | `string`      | `#BDBDBD`     | The color used for the track on the right side of thumb button. |
| thumbTintColor        | `string`      | `#3F51B5`     | Foreground color of thumb button. |
| thumbButtonSize       | `number`      | `24`          | Size of thumb button. |
| sliderWidth           | `number`      | `325`         | Width of slider component. |
| sliderHeight          | `number`      | `6`           | Height of slider component. |
| sliderBorderRadius    | `number`      | `3`           | Border radius of slider component. |
| thumbImage            | `image(string/number)`        | `null`        | Sets an image for the thumb button. Only static images are supported. |
| thumbButton           | `element`     | `null`        | Sets an react component for override the thumb button. |

## Contributing

Contributions are welcome. Should run `npm run test` before push.

## License

MIT License
Copyright (c) 2018-present, NesChaiyapon.