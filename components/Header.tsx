// components/Header.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login'); // Redirect to login page
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>SmartWaste</Text>

      <View style={styles.icons}>
        <Pressable onPress={() => router.push('/tabs/profile')} style={styles.icon}>
          <Ionicons name="person-circle" size={30} color="#fff" />
        </Pressable>
        <Pressable onPress={handleLogout} style={styles.icon}>
          <Ionicons name="log-out" size={30} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: '#568203',
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    marginLeft: 12,
  },
});
