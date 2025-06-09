// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { loginPersonnel } from "@/lib/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// In your Login or App init screen (React Native)
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data; // This is the push token
  } else {
    alert("Must use physical device for Push Notifications");
  }
};

export default function Login() {
  const [personnelId, setPersonnelId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await loginPersonnel(personnelId, password);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("personnel", JSON.stringify(data.personnel));
      const token = await registerForPushNotificationsAsync();
      await fetch(
        `https://smart-waste-backend-wsmj.onrender.com/api/personnel/push-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      router.replace("/tabs"); // redirects to main tabs screen
    } catch (error: any) {
      console.log(
        "FULL ERROR",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      Alert.alert(
        "Login failed",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/coverimage.jpg")} // ✅ use relative path
        style={styles.background}
        resizeMode="cover"
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            width: "90%",
            padding: 20,
            borderRadius: 15,
          }}
        >
          <Text style={styles.title}>Welcome, SmartWaster</Text>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 15,
              fontSize: 18,
              fontWeight: "400",
              color: "#cecece",
            }}
          >
            Login below
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Personnel ID"
            onChangeText={setPersonnelId}
            value={personnelId}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          {!loading ? (
            <Button color="#568203" title="Login" onPress={handleLogin} />
          ) : (
            <Button
              color="#568203"
              title="Logging in"
              onPress={handleLogin}
              disabled
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#cecece",
  },
});
