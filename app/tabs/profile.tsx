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
  Pressable,
  ImageBackground,
  ScrollView
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";

export default function Profile() {
  const { personnel } = usePersonnel();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View // ✅ use relative path
        style={styles.background}
        // resizeMode="cover"
      >
        {personnel ? (
          <View style={styles.overlay}>
            <Text style={styles.title}>Personnel Info</Text>
            {/* Add more content here */}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      {personnel ? (
        <View style={styles.infoBox}>
          <View style={styles.subBox}>
            <View style={{ marginRight: 20 }}>
              <MaterialIcons name="fingerprint" size={35} color="#888888" />
            </View>
            <View>
              <Text style={styles.info}>Personnel ID: </Text>
              <Text style={{ fontSize: 19, fontWeight: "500" }}>
                {personnel.personnelId}
              </Text>
            </View>
          </View>
          <View style={styles.subBox}>
            <View style={{ marginRight: 20 }}>
              <Ionicons name="person-outline" size={35} color="#888888" />
            </View>
            <View>
              <Text style={styles.info}>Full Name: </Text>
              <Text style={{ fontSize: 19, fontWeight: "500" }}>
                {personnel.name}
              </Text>
            </View>
          </View>
          <View style={styles.subBox}>
            <View style={{ marginRight: 21, marginLeft: 2 }}>
              <Fontisto name="email" size={32} color="#888888" />
            </View>
            <View>
              <Text style={styles.info}>Email: </Text>
              <Text style={{ fontSize: 19, fontWeight: "500" }}>
                {personnel.email}
              </Text>
            </View>
          </View>
          <View style={styles.subBox}>
            <View style={{ marginRight: 22, marginLeft: 3 }}>
              <Fontisto name="phone" size={30} color="#888888" />
            </View>
            <View>
              <Text style={styles.info}>Phone Number: </Text>
              <Text style={{ fontSize: 19, fontWeight: "500" }}>
                {personnel.phone}
              </Text>
            </View>
          </View>
          <View style={{ paddingTop: 25 }}>
            <Pressable
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "#0047AB",
                  fontSize: 16,
                }}
              >
                Update Info
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
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
    width: "100%",
    marginTop: -10,
    height: "80%",
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
  info: {
    fontSize: 16,
    color: "#888888",
  },
});
