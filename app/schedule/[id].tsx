// app/tabs/schedule/[id].tsx
import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Polyline, Marker } from "react-native-maps";
import { getScheduleById, updateScheduleStatus } from "@/lib/api/schedules";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScheduleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Schedule Details",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace("/tabs/schedule")}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getScheduleById(id as string);
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchedule();
    }
  }, [id]);

  const handleStatusUpdate = async (status: "completed" | "cancelled") => {
    try {
      await updateScheduleStatus(id as string, status);
      Alert.alert("Success", `Schedule marked as ${status}.`);
      router.back(); // go back to schedule list
    } catch (err) {
      Alert.alert("Error", "Failed to update schedule.");
    }
  };

  const coordinates = schedule?.route?.steps?.map((step: any) => ({
    latitude: step.location[1],
    longitude: step.location[0],
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <ActivityIndicator size="large" color="#96d127" />;
  if (!schedule) return <Text>Schedule not found.</Text>;

  return (
    <View contentContainerStyle={styles.container}>
      {/* Info */}
      <View style={styles.info}>
        <View style={{ flex: 0, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Schedule No:</Text>
          <Text>{schedule.scheduleNo}</Text>
        </View>
        <View style={{ flex: 0, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Schedule Date:</Text>
          <Text>{formatDate(schedule.scheduledDate)}</Text>
        </View>
        <View style={{ flex: 0, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Status:</Text>
          <Text>{schedule.status}</Text>
        </View>
      </View>

      {/* Map */}
      {coordinates && coordinates.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates[0].latitude,
            longitude: coordinates[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Polyline
            coordinates={coordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
          <Marker coordinate={coordinates[0]} title="Start" pinColor="green" />
          <Marker
            coordinate={coordinates[coordinates.length - 1]}
            title="End"
            pinColor="red"
          />
        </MapView>
      )}

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <Pressable
          style={{
            backgroundColor: "#568203",
            padding: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            // Android
            elevation: 5,
          }}
          onPress={() => handleStatusUpdate("completed")}
        >
          <Text style={{ fontSize: 14, fontWeight: "semibold", color: "#fff", textTransform: "uppercase" }}>Mark Completed</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#A91101",
            padding: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            // Android
            elevation: 5,
          }}
          onPress={() => handleStatusUpdate("cancelled")}
        >
          <Text style={{ fontSize: 14, fontWeight: "semibold", color: "#fff", textTransform: "uppercase" }}>Cancel Trip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    backgroundColor: "#96d127",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  info: {
    padding: 15,
    backgroundColor: "#f2f2f2",
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  map: {
    flex: 1,
    marginVertical: 10,
  },
  buttonGroup: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 15,
  },
});
