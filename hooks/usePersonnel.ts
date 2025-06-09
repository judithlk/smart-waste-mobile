import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersonnel() {
  const [personnel, setPersonnel] = useState<any>(null);

  useEffect(() => {
    const fetchPersonnel = async () => {
      const stored = await AsyncStorage.getItem('personnel');
      if (stored) {
        setPersonnel(JSON.parse(stored));
      }
    };
    fetchPersonnel();
  }, []);

  return { personnel };
}
