import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface OrderItem {
  product_name: string;
  quantity: number;
}

interface Order {
  order_id: number;
  status: string;
  customer_name: string;
  customer_address: string;
  updated_at: string;
  order_items: OrderItem[];
  total: number;
}

const Ongoing = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOngoingOrders();
  }, []);

  const fetchOngoingOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        "https://tezapi.demogames.cloud/api/v2/deliveryBoy/OrderInProgress",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOngoingOrders();
  };

  const handleOrderPress = (orderId: number) => {
    router.push(`/checkItems?orderId=${orderId}`);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderContainer}
      onPress={() => handleOrderPress(item.order_id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderIdText}>Order #{item.order_id}</Text>
        <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
      </View>
      <Text style={styles.customerText}>Customer: {item.customer_name}</Text>
      <View style={styles.itemsContainer}>
        {item.order_items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.product_name} (Qty: {orderItem.quantity})
          </Text>
        ))}
      </View>
      <Text style={styles.totalText}>Total: ₹{item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order_id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ongoing orders</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2D3436"]}
            tintColor="#2D3436"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  orderContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusText: {
    color: "green",
    textTransform: "capitalize",
  },
  customerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemsContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 12,
    color: "#666",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});

export default Ongoing;
