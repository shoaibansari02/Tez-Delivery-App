import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrderDetailsType {
  order_id: number;
  order_date: string;
  sub_total: string;
  total: string;
  customer_name: string;
  customer_phone_number: string;
  customer_address: string;
  "customer_street "?: string;
  "customer_landmark "?: string;
  "customer_zip_code "?: string;
  customer_street?: string;
  customer_landmark?: string;
  customer_zip_code?: string;
  customer_city: string;
  payment_method: string | null;
  inventory_name: string;
  inventory_address: string;
  "inventory_street "?: string;
  inventory_street?: string;
  inventory_landmark: string;
  inventory_city: string;
  inventory_zip_code?: string;
  inventory_zip_code?: string;
  inventory_phone_number: string;
}

const OrderDetails = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await axios.get(
        `https://tezapi.demogames.cloud/api/v2/deliveryBoy/OrderDetails/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        router.replace("/");
      }

      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to fetch order details"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const formatCompleteAddress = (
    baseAddress: string,
    street: string | null | undefined,
    landmark: string | null | undefined,
    city: string,
    zipCode: string | null | undefined
  ) => {
    const cleanStreet =
      street?.trim() ||
      (
        orderDetails &&
        (orderDetails["customer_street "] || orderDetails["inventory_street "])
      )?.trim();
    const cleanLandmark =
      landmark?.trim() ||
      (
        orderDetails &&
        (orderDetails["customer_landmark "] || orderDetails.inventory_landmark)
      )?.trim();
    const cleanZipCode =
      zipCode?.trim() ||
      (
        orderDetails &&
        (orderDetails["customer_zip_code "] ||
          orderDetails["inventory_zip_code"])
      )?.trim();

    const addressComponents = [
      baseAddress,
      street && `Street: ${street}`,
      landmark && `Landmark: ${landmark}`,
      city && `City: ${city}`,
      zipCode && `Zip Code: ${zipCode}`,
    ].filter(Boolean);

    return addressComponents.join("\n");
  };

  const handleOrderAction = async (action: "accept" | "deny") => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        router.replace("/");
        return;
      }

      let response;
      if (action === "accept") {
        response = await axios.post(
          `https://deliveryboy.demogames.cloud/api/OrderAccept/${orderId}`,
          {
            action: action,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        router.push(`/checkItems?orderId=${orderId}`);
      } else {
        response = await axios.post(
          `https://tezapi.demogames.cloud/api/v2/deliveryBoy/OrderDeclined/${orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        router.replace("/");
        return;
      }

      Alert.alert(
        "Error",
        error.response?.data?.message || `Unable to ${action} order`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCall = () => {
    if (orderDetails?.customer_phone_number) {
      Linking.openURL(`tel:${orderDetails.customer_phone_number}`);
    }
  };

  const handleMaps = () => {
    if (orderDetails) {
      const addressComponents = [
        orderDetails.customer_address,
        orderDetails.customer_street || orderDetails["customer_street "],
        orderDetails.customer_landmark || orderDetails["customer_landmark "],
        orderDetails.customer_city,
        orderDetails.customer_zip_code || orderDetails["customer_zip_code "],
      ]
        .filter(Boolean)
        .map((component) => component.trim())
        .filter((component) => component !== "");

      const fullAddress = addressComponents.join(", ");

      const alternateAddresses = [
        fullAddress,
        `${orderDetails.customer_address}, ${orderDetails.customer_city}`,
        `${orderDetails.customer_landmark}, ${orderDetails.customer_city}`,
        orderDetails.customer_city,
      ];

      const openMapsWithAddress = (address: string) => {
        const encodedAddress = encodeURIComponent(address);
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
        ).catch(() => {
          const nextIndex = alternateAddresses.indexOf(address) + 1;
          if (nextIndex < alternateAddresses.length) {
            openMapsWithAddress(alternateAddresses[nextIndex]);
          } else {
            Alert.alert(
              "Navigation Error",
              "Unable to locate the exact address. Please check the address details."
            );
          }
        });
      };

      openMapsWithAddress(alternateAddresses[0]);
    } else {
      Alert.alert("Error", "Order details not available");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!orderDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Unable to load order details</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const showConfirmationAlert = (action: "accept" | "deny") => {
    const message =
      action === "accept"
        ? "Are you ready to go for this order?"
        : "Are you sure you want to deny this order?";

    Alert.alert(
      "Confirm Action",
      message,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleOrderAction(action),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
              <View style={styles.profileNameContainer}>
                <Text style={styles.profileName}>
                  {orderDetails.customer_name}
                </Text>
                <Text style={styles.profileSubtitle}>
                  Order #{orderDetails.order_id}
                </Text>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.callButton]}
                  onPress={handleCall}
                >
                  <Text style={styles.actionButtonText}>📞 Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.mapButton]}
                  onPress={handleMaps}
                >
                  <Text style={styles.actionButtonText}>🗺️ Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Delivery Address</Text>
              <View style={styles.addressDetailsContainer}>
                <Text style={styles.addressText}>
                  {formatCompleteAddress(
                    orderDetails.customer_address,
                    orderDetails.customer_street ||
                      orderDetails["customer_street "],
                    orderDetails.customer_landmark ||
                      orderDetails["customer_landmark "],
                    orderDetails.customer_city,
                    orderDetails.customer_zip_code ||
                      orderDetails["customer_zip_code "]
                  )}
                </Text>
                <Text style={styles.phoneText}>
                  {orderDetails.customer_phone_number}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <View style={styles.cardContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Order Date</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(orderDetails.order_date)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>MRP Total</Text>
                <Text style={styles.summaryValue}>
                  ₹ {orderDetails.sub_total}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Order Total</Text>
                <Text style={styles.summaryValue}>₹ {orderDetails.total}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>FREE</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment Method</Text>
                <Text style={styles.summaryValue}>
                  {orderDetails.payment_method || "Not Specified"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Inventory Details</Text>
            <View style={styles.cardContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Name</Text>
                <Text style={styles.summaryValue}>
                  {orderDetails.inventory_name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Address</Text>
                <Text style={styles.summaryValue}>
                  {formatCompleteAddress(
                    orderDetails.inventory_address,
                    orderDetails.inventory_street ||
                      orderDetails["inventory_street "],
                    orderDetails.inventory_landmark,
                    orderDetails.inventory_city,
                    orderDetails.inventory_zip_code ||
                      orderDetails["inventory_zip_code"]
                  )}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Contact</Text>
                <Text style={styles.summaryValue}>
                  {orderDetails.inventory_phone_number}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[
              styles.orderActionButton,
              styles.acceptButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() => showConfirmationAlert("accept")}
            disabled={isProcessing}
          >
            <Text style={styles.orderActionText}>
              {isProcessing ? "Processing..." : "Accept Order"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.orderActionButton,
              styles.denyButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() => showConfirmationAlert("deny")}
            disabled={isProcessing}
          >
            <Text style={styles.orderActionText}>
              {isProcessing ? "Processing..." : "Deny Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  bottomSpacing: {
    height: 100,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileContainer: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 15,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  profileNameContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  contactActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  callButton: {
    backgroundColor: "#e6f2ff",
  },
  mapButton: {
    backgroundColor: "#e6f2ff",
  },
  actionButtonText: {
    color: "#007bff",
    fontWeight: "600",
  },
  addressContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  addressText: {
    color: "#555",
    fontSize: 14,
    lineHeight: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  cardContent: {
    padding: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f5f7fa",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    maxWidth: 160, // Limit button width
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  denyButton: {
    backgroundColor: "#dc3545",
  },
  orderActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  addressContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 8,
  },
  addressDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  addressText: {
    flex: 0.7,
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
  },
  phoneText: {
    flex: 0.4,
    color: "#666",
    fontSize: 14,
    textAlign: "right",
  },
});

export default OrderDetails;
