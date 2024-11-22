import { View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const CustomStatusBar = () => {
  return (
    <View>
      <StatusBar style="light" backgroundColor="#D62F2F" />
    </View>
  );
};

export default CustomStatusBar;
