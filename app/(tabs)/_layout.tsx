import { Pressable, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs } from 'expo-router';
import { useState } from 'react';
import tw from 'twrnc';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useThemeStore } from '../../store/useThemeStore';
import { BlurView } from 'expo-blur';
import { useTransactionStore } from '../../store/useTransactionStore'

export { default as ErrorBoundary } from '../../components/ErrorBoundary'

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
      <View style={tw`flex-1`}>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerTitle: 'Cash Tracker',
            headerShadowVisible: false,

            // APPLY CUSTOM FONT TO HEADER
            headerTitleStyle: {
              fontFamily: 'ClashGroteskBold',
              fontSize: 22,
              color: headerText,
            },

            // Optional: Apply font to header back button text (iOS)
            headerBackTitleStyle: {
              fontFamily: 'ClashGroteskMedium',
            },

            // Glass Header
            headerBackground: () => (
              <BlurView
                intensity={90}
                tint={isDark ? 'dark' : 'light'}
                style={tw`flex-1`}
              />
            ),

            // APPLY CUSTOM FONT TO TAB LABELS
            tabBarLabelStyle: {
              fontFamily: 'ClashGroteskMedium',
              fontSize: 12,
              marginBottom: 4,
            },

            tabBarStyle: {
              height: 60,
              borderTopColor: tabBarBorder,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,        
              backgroundColor: 'transparent',
            },

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
              headerTitleStyle: {
                fontFamily: 'ClashGroteskSemiBold',
                fontSize: 22,
              },
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
              headerTitleStyle: {
                fontFamily: 'ClashGroteskSemiBold',
                fontSize: 22,
              },
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
  );
}