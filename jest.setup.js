// Basic test setup: mock AsyncStorage
// jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'))
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    getItem: jest.fn((key) => Promise.resolve(store.get(key) ?? null)),
    setItem: jest.fn((key, value) => { store.set(key, value); return Promise.resolve(); }),
    removeItem: jest.fn((key) => { store.delete(key); return Promise.resolve(); }),
    clear: jest.fn(() => { store.clear(); return Promise.resolve(); }),
    getAllKeys: jest.fn(() => Promise.resolve([...store.keys()])),
    multiGet: jest.fn((keys) => Promise.resolve(keys.map(k => [k, store.get(k) ?? null]))),
    multiSet: jest.fn((pairs) => { pairs.forEach(([k, v]) => store.set(k, v)); return Promise.resolve(); }),
  };
});

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

jest.mock('react-native/Libraries/Utilities/DevSettings', () => ({ reload: jest.fn() }))

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    RotationGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    TapGestureHandler: View,
    FlatList: View,
    gestureHandlerRootHOC: (Component: any) => Component,
    Directions: {},
  };
});

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})