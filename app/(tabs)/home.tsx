import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { CheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import CustomStatusBar from "../../components/StatusBar";
import { useRouter } from "expo-router";

const Home = () => {
  const Router = useRouter();

  const onDetails = () => {
    Router.navigate("/orderDetails");
  };
  // Array of items with their details
  const items = [
    {
      id: 1,
      name: "Samiksha Sharma",
      orderNumber: "19928",
    },
    {
      id: 2,
      name: "RK Deo",
      orderNumber: "19929",
    },
    {
      id: 3,
      name: "Prajwal Kumar",
      orderNumber: "19941",
    },
    {
      id: 4,
      name: "Ankit Singh",
      orderNumber: "19942",
    },
    {
      id: 5,
      name: "Neha Patel",
      orderNumber: "19943",
    },
    {
      id: 6,
      name: "Rahul Gupta",
      orderNumber: "19944",
    },
    {
      id: 7,
      name: "Rahul Gupta",
      orderNumber: "19944",
    },
    {
      id: 8,
      name: "Rahul Gupta",
      orderNumber: "19944",
    },
    {
      id: 9,
      name: "Rahul Gupta",
      orderNumber: "19944",
    },
    {
      id: 10,
      name: "Rahul Gupta",
      orderNumber: "19944",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>tez</Text>
      </View> */}

      {/* List of Items */}
      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item) => (
          <TouchableOpacity
            style={styles.item}
            key={item.id}
            onPress={onDetails}
          >
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.orderNumber}>
                Order Number: {item.orderNumber}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.checkButton}>
                <CheckIcon color="#fff" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.crossButton}>
                <XMarkIcon color="#fff" size={20} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    // paddingTop: Platform.OS === "ios" ? 30 : StatusBar.currentHeight,
  },
  header: {
    backgroundColor: "#D62F2F",
    padding: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    paddingBottom: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
    borderRadius: 10,
  },
  textContainer: {
    flex: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderNumber: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  crossButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 25,
  },
});

export default Home;
