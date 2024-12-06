import React from "react";
import { View, Dimensions, Platform } from "react-native";
import { Tabs } from "expo-router";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  HomeIcon,
  UserIcon,
  ClockIcon,
  CogIcon,
  PlayIcon,
} from "react-native-heroicons/outline";

const { width } = Dimensions.get("window");

const ProfessionalTabBar = ({ state, descriptors, navigation }) => {
  const tabWidth = width / state.routes.length;

  const tabIcons = [
    { icon: HomeIcon, name: "Home" },
    { icon: UserIcon, name: "Profile" },
    { icon: PlayIcon, name: "Ongoing" },
    { icon: ClockIcon, name: "History" },
    { icon: CogIcon, name: "Settings" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        height: 70,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        paddingBottom: Platform.OS === "ios" ? 20 : 10,
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const { icon: Icon, name } = tabIcons[index];

        return (
          <View
            key={route.key}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[
                {
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 12,
                  transform: [
                    {
                      scale: isFocused ? 1.1 : 1,
                    },
                  ],
                },
              ]}
            >
              <Icon
                size={24}
                color={isFocused ? "#D62F2F" : "#8E8E93"}
                onPress={onPress}
                style={{
                  opacity: isFocused ? 1 : 0.6,
                }}
              />
              {isFocused && (
                <View
                  style={{
                    height: 3,
                    width: 24,
                    backgroundColor: "#D62F2F",
                    marginTop: 4,
                    borderRadius: 2,
                  }}
                />
              )}
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <ProfessionalTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#D62F2F",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#D62F2F",
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
          color: "#fff",
        },
        headerTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ongoing"
        options={{
          title: "Ongoing",
          headerTitle: "Ongoing Projects",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerTitle: "Activity Log",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "App Preferences",
        }}
      />
    </Tabs>
  );
}
