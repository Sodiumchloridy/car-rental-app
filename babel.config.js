module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};