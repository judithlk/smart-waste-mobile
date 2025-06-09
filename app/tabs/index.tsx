// app/index.tsx
import React from "react";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { usePersonnel } from "@/hooks/usePersonnel";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getSchedulesByPersonnelId,
  getHistoryByPersonnelId,
} from "@/lib/api/schedules";

export default function Home() {
  const { personnel } = usePersonnel();
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [latestTrip, setLatestTrip] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const personnel = await AsyncStorage.getItem("personnel");
        const parsed = JSON.parse(personnel || "{}");

        const schedules = await getSchedulesByPersonnelId(parsed.personnelId);
        const history = await getHistoryByPersonnelId(parsed.personnelId);

        // Count pending from schedules
        const pending = schedules.filter(
          (s: any) => s.status === "pending"
        ).length;
        setPendingCount(pending);

        // Get latest scheduled trip
        const latest = schedules.sort(
          (a: any, b: any) =>
            new Date(b.scheduledDate).getTime() -
            new Date(a.scheduledDate).getTime()
        )[0];
        setLatestTrip(latest || null);

        // Count completed/cancelled from history
        const completed = history.filter(
          (h: any) => h.status === "completed"
        ).length;
        const cancelled = history.filter(
          (h: any) => h.status === "cancelled"
        ).length;
        setCompletedCount(completed);
        setCancelledCount(cancelled);
      } catch (err) {
        console.log("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#96d127" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("@/assets/images/mapBg.jpg")} // ✅ use relative path
        style={styles.background}
        resizeMode="cover"
      >
        {personnel ? (
          <View style={styles.overlay}>
            <Text style={styles.title}>Welcome, {personnel.name}</Text>
            {/* Add more content here */}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ImageBackground>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 25,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: 20,
          width: "100%",
          marginTop: -10,
          height: "70%",
          // iOS
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          // Android
          elevation: 5,
        }}
      >
        <View>
          <Text style={styles.subtitle}>Trips Snapshot</Text>
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#E9D66B",
                padding: 10,
                paddingVertical: 15,
                borderRadius: 10,
                margin: 3,
                width: "30%",
                flex: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 14, color: "#B8860B", fontWeight: "500" }}
              >
                Pending
              </Text>
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 28,
                  color: "#B8860B",
                  fontWeight: "500",
                }}
              >
                {pendingCount}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#FA8072",
                padding: 10,
                paddingVertical: 15,
                borderRadius: 10,
                margin: 3,
                width: "30%",
                flex: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 14, color: "#841617", fontWeight: "500" }}
              >
                Cancelled
              </Text>
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 28,
                  color: "#841617",
                  fontWeight: "500",
                }}
              >
                {cancelledCount}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#93C572",
                padding: 10,
                paddingVertical: 15,
                borderRadius: 10,
                margin: 3,
                width: "30%",
                flex: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 14, color: "#008000", fontWeight: "500" }}
              >
                Completed
              </Text>
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 28,
                  color: "#008000",
                  fontWeight: "500",
                }}
              >
                {completedCount}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.subtitle}>Latest Activity</Text>
            <View style={styles.card}>
              {latestTrip ? (
                <>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {latestTrip.scheduleNo}
                  </Text>
                  <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#888888",
                      }}
                    >
                      Date:{" "}
                      {new Date(latestTrip.scheduledDate).toLocaleDateString()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#888888",
                        textTransform: "capitalize",
                      }}
                    >
                      Status: {latestTrip.status}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={{textAlign: "center", marginVertical: 8, color: "#888888"}}>No scheduled trips</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)", // optional dark overlay
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f1f1f1",
    padding: 16,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#888888",
    textAlign: "center",
    marginVertical: 10,
  },
});
