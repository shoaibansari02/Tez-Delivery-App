// app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import {
  HomeIcon,
  UserIcon,
  ClockIcon,
  CogIcon,
} from "react-native-heroicons/outline";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D62F2F",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: "#D62F2F",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          headerTitle: "tez",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
          //   headerTitle: "Profile",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <ClockIcon size={24} color={color} />,
          headerTitle: "History",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <CogIcon size={24} color={color} />,
          headerTitle: "Settings",
        }}
      />
    </Tabs>
  );
}
