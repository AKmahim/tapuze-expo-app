const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Node.js compatibility
config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts.push('cjs');

// Add resolver fields for better compatibility
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Disable symlinks to avoid module resolution issues
config.resolver.unstable_enableSymlinks = false;

module.exports = config;