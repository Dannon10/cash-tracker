const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix import.meta for web
config.transformer = {
    ...config.transformer,
    unstable_allowRequireContext: true,
};

config.resolver = {
    ...config.resolver,
    unstable_enablePackageExports: false,
};

module.exports = config;