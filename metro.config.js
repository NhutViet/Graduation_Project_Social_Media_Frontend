const {getDefaultConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.alias = {
  ...defaultConfig.resolver.alias,
  '@services': path.resolve(__dirname, 'services'),
  '@assets': path.resolve(__dirname, 'assets'),
};

module.exports = defaultConfig;
