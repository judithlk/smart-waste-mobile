import { api } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper to include token in headers
const authHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Get schedules by personnel ID
export const getSchedulesByPersonnelId = async (personnelId: string) => {
  const config = await authHeader();
  const response = await api.get(`schedules/by-personnel/${personnelId}`, config);
  return response.data;
};

// 2. Get schedule by ID
export const getScheduleById = async (scheduleId: string) => {
  const config = await authHeader();
  const response = await api.get(`schedules/${scheduleId}`, config);
  return response.data;
};

// 3. Update schedule status
export const updateScheduleStatus = async (scheduleId: string, status: string) => {
  const config = await authHeader();
  const response = await api.patch(`/schedules/${scheduleId}/status`, { status }, config);
  return response.data;
};

// 4. Get history by personnel ID
export const getHistoryByPersonnelId = async (personnelId: string) => {
  const config = await authHeader();
  const response = await api.get(`/history/personnel/${personnelId}`, config);
  return response.data;
};
