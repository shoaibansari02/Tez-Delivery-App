import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ChevronRightIcon, ClockIcon } from "react-native-heroicons/outline";
import CustomStatusBar from "../../components/StatusBar";
import { useRouter } from "expo-router";

export default function History() {
  const router = useRouter();

  // Sample order history data
  const orderHistory = [
    {
      id: "1",
      orderNumber: "19928",
      customerName: "Samiksha Sharma",
      date: "22 Nov 2024",
      time: "14:30",
      status: "Delivered",
      amount: "₹1,499",
      items: 3,
    },
    {
      id: "2",
      orderNumber: "19929",
      customerName: "RK Deo",
      date: "21 Nov 2024",
      time: "11:15",
      status: "Cancelled",
      amount: "₹2,299",
      items: 2,
    },
    {
      id: "3",
      orderNumber: "19930",
      customerName: "Prajwal Kumar",
      date: "20 Nov 2024",
      time: "16:45",
      status: "Delivered",
      amount: "₹899",
      items: 1,
    },
    {
      id: "4",
      orderNumber: "19931",
      customerName: "Ankit Singh",
      date: "20 Nov 2024",
      time: "09:20",
      status: "Delivered",
      amount: "₹3,499",
      items: 4,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#4CAF50";
      case "Cancelled":
        return "#F44336";
      default:
        return "#FFA500";
    }
  };

  const onOrderPress = (orderId) => {
    router.push(`/orderDetails/${orderId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />

      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>View your past orders</Text>
      </View> */}

      {/* Order List */}
      <ScrollView style={styles.scrollView}>
        {orderHistory.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderNumberContainer}>
                <Text style={styles.orderNumberLabel}>Order #</Text>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <View style={styles.timeContainer}>
                <ClockIcon size={16} color="#666" />
                <Text style={styles.timeText}>
                  {order.date} • {order.time}
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderDetails}>
                <Text style={styles.itemCount}>{order.items} items</Text>
                <Text style={styles.amount}>{order.amount}</Text>
              </View>
              <ChevronRightIcon size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderNumberLabel: {
    fontSize: 14,
    color: "#666",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
