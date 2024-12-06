import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const CheckItems = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [checkItemsDetails, setCheckItemsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAddressField = (obj, fieldName) => {
    // Try both regular and space-suffixed versions of the key
    return obj[fieldName] || obj[`${fieldName} `] || "";
  };

  const formatCompleteAddress = (
    baseAddress,
    street,
    landmark,
    city,
    zipCode
  ) => {
    const addressComponents = [
      baseAddress,
      street && `Street: ${street.trim()}`,
      landmark && `Landmark: ${landmark.trim()}`,
      city && `City: ${city.trim()}`,
      zipCode && `Zip Code: ${zipCode.trim()}`,
    ].filter(Boolean);

    return addressComponents.join("\n");
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const orderDetailsResponse = await axios.get(
          `https://tezapi.demogames.cloud/api/v2/deliveryBoy/OrderDetails/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const checkItemsResponse = await axios.get(
          `https://tezapi.demogames.cloud/api/v2/deliveryBoy/OrderCheckItems/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (orderDetailsResponse.data && checkItemsResponse.data.success) {
          // Normalize the object keys to remove trailing spaces
          const normalizeKeys = (obj) => {
            return Object.fromEntries(
              Object.entries(obj).map(([key, value]) => [key.trim(), value])
            );
          };

          const cleanedOrderDetails = normalizeKeys(orderDetailsResponse.data);

          setOrderDetails(cleanedOrderDetails);
          setCheckItemsDetails(checkItemsResponse.data);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching details:", err);

        if (err.response?.status === 401) {
          await AsyncStorage.removeItem("userToken");
          router.replace("/");
          return;
        }

        setError(err.message);
        setLoading(false);

        Alert.alert(
          "Error",
          err.response?.data?.message || "Unable to fetch order details"
        );
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const onOrder = () => {
    router.navigate("/confirmCorder");
  };

  const handleCustomerCall = () => {
    if (orderDetails?.customer_phone_number) {
      Linking.openURL(`tel:${orderDetails.customer_phone_number}`);
    }
  };

  const handleCustomerMaps = () => {
    if (orderDetails) {
      const addressComponents = [
        orderDetails.customer_address,
        orderDetails.customer_street,
        orderDetails.customer_landmark,
        orderDetails.customer_city,
        orderDetails.customer_zip_code,
      ]
        .filter(Boolean)
        .map((component) => component.trim())
        .filter((component) => component !== "");

      const fullAddress = addressComponents.join(", ");
      const encodedAddress = encodeURIComponent(fullAddress);
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      );
    }
  };

  const handleInventoryCall = () => {
    if (orderDetails?.inventory_phone_number) {
      Linking.openURL(`tel:${orderDetails.inventory_phone_number}`);
    }
  };

  const handleInventoryMaps = () => {
    if (orderDetails) {
      const addressComponents = [
        orderDetails.inventory_address,
        orderDetails.inventory_street,
        orderDetails.inventory_landmark,
        orderDetails.inventory_city,
        orderDetails.inventory_zip_code,
      ]
        .filter(Boolean)
        .map((component) => component.trim())
        .filter((component) => component !== "");

      const fullAddress = addressComponents.join(", ");
      const encodedAddress = encodeURIComponent(fullAddress);
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      );
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.itemContainer, { marginBottom: 12 }]}>
      <View style={styles.itemIndexContainer}>
        <Text style={styles.itemIndex}>{index + 1}</Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.product_name}</Text>
          <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.unitPrice}>₹{item.unit_price}</Text>
          <Text style={styles.totalPrice}>
            ₹{item.quantity * item.unit_price}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={48} color="#FF4D4D" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.customerCard}>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>
                    {orderDetails?.customer_name}
                  </Text>
                  <Text style={styles.customerPhone}>
                    {orderDetails?.customer_phone_number}
                  </Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>Delivery Address</Text>
                    <Text style={styles.addressText}>
                      {formatCompleteAddress(
                        orderDetails?.customer_address,
                        orderDetails?.customer_street,
                        orderDetails?.customer_landmark,
                        orderDetails?.customer_city,
                        orderDetails?.customer_zip_code
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCustomerCall}
                  >
                    <FontAwesome name="phone" size={20} color="#FF4D4D" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCustomerMaps}
                  >
                    <FontAwesome name="map-marker" size={20} color="#FF4D4D" />
                    <Text style={styles.actionButtonText}>Maps</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.orderSummary}>
                <View style={styles.summaryItem}>
                  <FontAwesome name="shopping-bag" size={20} color="#666" />
                  <Text style={styles.summaryText}>
                    {checkItemsDetails?.order_items} Items
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <FontAwesome name="cube" size={20} color="#666" />
                  <Text style={styles.summaryText}>
                    {checkItemsDetails?.total_pieces} Pieces
                  </Text>
                </View>
              </View>
            </View>
          </>
        }
        data={checkItemsDetails?.products_details}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <>
            <View style={styles.inventoryCard}>
              <Text style={styles.inventoryTitle}>
                <FontAwesome name="building" size={20} color="#333" /> Inventory
                Details
              </Text>
              <View style={styles.inventoryContent}>
                <View style={styles.inventoryInfo}>
                  <Text style={styles.inventoryText}>
                    <Text style={styles.label}>Name: </Text>
                    {orderDetails?.inventory_name}
                  </Text>
                  <Text style={styles.inventoryText}>
                    <Text style={styles.label}>Phone: </Text>
                    {orderDetails?.inventory_phone_number}
                  </Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>Address</Text>
                    <Text style={styles.addressText}>
                      {formatCompleteAddress(
                        orderDetails?.inventory_address,
                        orderDetails?.inventory_street ||
                          orderDetails?.["inventory_street "],
                        orderDetails?.inventory_landmark,
                        orderDetails?.inventory_city,
                        orderDetails?.inventory_zip_code ||
                          orderDetails?.["inventory_zip_code"]
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleInventoryCall}
                  >
                    <FontAwesome name="phone" size={20} color="#FF4D4D" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleInventoryMaps}
                  >
                    <FontAwesome name="map-marker" size={20} color="#FF4D4D" />
                    <Text style={styles.actionButtonText}>Maps</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() =>
                router.navigate(`/confirmCorder?orderId=${orderId}`)
              }
            >
              <Text style={styles.continueButtonText}>Continue Order</Text>
              <FontAwesome name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 16,
  },
  customerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  customerPhone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
  },
  actionButtonText: {
    color: "#FF4D4D",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  itemIndexContainer: {
    backgroundColor: "#FF4D4D",
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  itemIndex: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  unitPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4D4D",
  },
  totalPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  inventoryCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  inventoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inventoryContent: {
    // flexDirection: "row",
    justifyContent: "space-between",
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  inventoryActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  inventoryButton: {
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#FF4D4D",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addressContainer: {
    marginTop: 12,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default CheckItems;
