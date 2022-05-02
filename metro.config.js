const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push(['db', 'ts', 'tsx', 'js', 'jsx', 'json', 'android.ts', '.native', '.native.ts', 'android.tsx', 'android.js']);

module.exports = defaultConfig;