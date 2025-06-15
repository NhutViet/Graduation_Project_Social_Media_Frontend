const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const config = {
  resolver: {
    extraNodeModules: {
      '@services': path.resolve(__dirname, 'services'),
    },
  },
  watchFolders: [path.resolve(__dirname, 'services')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
