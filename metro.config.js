const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Web-specific configuration to fix dev tools issue
config.resolver.alias = {
  'react-native/Libraries/Core/setUpReactDevTools': path.resolve(__dirname, 'src/utils/emptyComponent.js'),
};

module.exports = config;