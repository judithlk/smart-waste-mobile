import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getHistoryByPersonnelId } from "@/lib/api/schedules";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const goToDetails = (scheduleId: string) => {
    router.push({
      pathname: "/schedule/[id]",
      params: { id: scheduleId },
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const personnel = await AsyncStorage.getItem("personnel");
        const parsed = JSON.parse(personnel || "{}");
        const data = await getHistoryByPersonnelId(parsed.personnelId);
        setHistory(data);
      } catch (error) {
        console.log("Error loading schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#96d127" />;

  return (
    <View style={styles.container}>
      <View // ✅ use relative path
        style={styles.background}
        // resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Trip History</Text>
        </View>
      </View>
      <View style={styles.infoBox}>
        {history.length !== 0 ? (
          <FlatList
            data={history}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }) => (
              <View style={{ padding: 10 }}>
                <TouchableOpacity>
                  <View
                    style={{
                      padding: 20,
                      backgroundColor: "#eeeeee",
                      borderRadius: 5,
                    }}
                  >
                    <View
                      style={{
                        flex: 0,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#888888" }}>
                        {item.scheduleNo}
                      </Text>
                      {item.status == "completed" ? (
                        <Text
                          style={{
                            color: "#568203",
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        >
                          {item.status}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "#A91101",
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        >
                          {item.status}
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                      Date: {formatDate(item.scheduledDate)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              paddingTop: 10,
              height: "100%",
              flex: 0,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: "#888888" }}>
              No trips in history.
            </Text>
          </View>
        )}
      </View>
    </View>
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
    // backgroundColor: "rgba(0,0,0,0.4)", // optional dark overlay
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingHorizontal: 15,
    width: "100%",
    marginTop: -10,
    height: "85%",
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Android
    elevation: 5,
  },
  subBox: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    paddingVertical: 25,
  },
});
