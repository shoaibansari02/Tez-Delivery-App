import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

const CheckItems = () => {
  const router = useRouter();
  const onOrder = () => {
    router.navigate("/confirmCorder");
  };
  const items = [
    {
      id: "1",
      name: "Wagh Bakri Premium Leaf Tea",
      weight: "250 gm",
      price: "₹204",
      originalPrice: "₹250",
      quantity: 1,
    },
    {
      id: "2",
      name: "Taj Mahal Premium Tea",
      weight: "250 gm",
      price: "₹204",
      originalPrice: "₹250",
      quantity: 3,
    },
    {
      id: "3",
      name: "Wagh Bakri Premium Leaf Tea",
      weight: "250 gm",
      price: "₹204",
      originalPrice: "₹250",
      quantity: 1,
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemWeight}>{item.weight}</Text>
      </View>
      <View style={styles.itemPrice}>
        <Text style={styles.itemCurrentPrice}>{item.price}</Text>
        {/* <Text style={styles.itemOriginalPrice}>{item.originalPrice}</Text> */}
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>Samiksha Sharma</Text>
          <Text style={styles.userContact}>+91 7709690475</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerInfo}>3 Items</Text>
          <Text style={styles.headerInfo}>5 Pieces</Text>
        </View>
      </View>

      {/* Item List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={onOrder}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CheckItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userContact: {
    fontSize: 14,
    color: "gray",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerInfo: {
    fontSize: 14,
    color: "gray",
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemWeight: {
    fontSize: 14,
    color: "gray",
  },
  itemPrice: {
    alignItems: "flex-end",
  },
  itemCurrentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  itemOriginalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "gray",
  },
  itemQuantity: {
    fontSize: 14,
    color: "gray",
  },
  continueButton: {
    backgroundColor: "red",
    paddingVertical: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
