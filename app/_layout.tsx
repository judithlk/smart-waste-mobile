// app/_layout.tsx
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true   
  }),
});


export default function Layout() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" }}>
      <Slot />
    </SafeAreaProvider>
  );
}
