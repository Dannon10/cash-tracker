import { Pressable, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs } from 'expo-router';
import { useState } from 'react';
import tw from 'twrnc';
import { TransactionProvider } from './context/TransactionContext';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useThemeStore } from '../../store/useThemeStore';
import { BlurView } from 'expo-blur';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isDark } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);

  const headerText = isDark ? '#ffffff' : '#000000';
  const tabBarBorder = isDark ? '#1a1a1a' : '#e5e7eb';

  return (
    <TransactionProvider>
      <View style={tw`flex-1`}>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerTitle: 'Cash Tracker',
            headerShadowVisible: false,
            headerTitleStyle: {
              fontSize: 22,
              fontWeight: '800',
              color: headerText,
            },
            // Glassmorphism header
            headerBackground: () => (
              <BlurView
                intensity={90}
                tint={isDark ? 'dark' : 'light'}
                style={tw`flex-1`}
              />
            ),
            tabBarStyle: {
              height: 60,
              borderTopColor: tabBarBorder,
            },
            // Glassmorphism tab bar
            tabBarBackground: () => (
              <BlurView
                intensity={90}
                tint={isDark ? 'dark' : 'light'}
                style={tw`flex-1`}
              />
            ),
            tabBarActiveTintColor: isDark ? '#ffffff' : '#000000',
            tabBarInactiveTintColor: isDark ? '#4b5563' : '#9ca3af',
            headerTitleAlign: 'left',
          }}
        >
          <Tabs.Screen
            name="transactions"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
              headerRight: () => (
                <AntDesign
                  name="setting"
                  size={22}
                  color={isDark ? '#ffffff' : '#111'}
                  style={{ marginRight: 16 }}
                  onPress={() => router.push('/settings')}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="reports"
            options={{
              title: 'Reports',
              tabBarIcon: ({ color }) => <TabBarIcon name="pie-chart" color={color} />,
              headerRight: () => (
                <AntDesign
                  name="setting"
                  size={22}
                  color={isDark ? '#ffffff' : '#111'}
                  style={{ marginRight: 16 }}
                  onPress={() => router.push('/settings')}
                />
              ),
            }}
          />
        </Tabs>

        {/* Floating "+" button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={tw`absolute bottom-5 left-1/2 -ml-7 w-14 h-14 rounded-full bg-black items-center justify-center shadow-lg`}
        >
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </TransactionProvider>
  );
}