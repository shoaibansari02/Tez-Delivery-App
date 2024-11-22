// app/_layout.jsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#D62F2F",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontSize: 25,
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="orderDetails"
        options={{ headerShown: true, title: "tez" }}
      />
      <Stack.Screen
        name="checkItems"
        options={{ headerShown: true, title: "tez" }}
      />
      <Stack.Screen
        name="confirmCorder"
        options={{ headerShown: true, title: "tez" }}
      />
    </Stack>
  );
}
