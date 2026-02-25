const mods = [
  ['@react-navigation/native', ['ThemeProvider', 'DarkTheme', 'DefaultTheme']],
  ['react-native-gesture-handler', ['GestureHandlerRootView']],
  ['expo-router', ['Stack']],
];
mods.forEach(([mod, exports]) => {
  const m = require(mod);
  exports.forEach(k => {
    const v = m[k];
    console.log(mod, k, '->', typeof v, typeof v === 'object' && !Array.isArray(v) ? 'OBJECT ⚠️' : '✅');
  });
});