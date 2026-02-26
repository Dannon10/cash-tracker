module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
        ],
        overrides: [
            {
                test: /node_modules\/(openai|uuid|react-native-worklets)/,
                plugins: [
                    ['@babel/plugin-transform-modules-commonjs'],
                ],
            },
        ],
    };
};