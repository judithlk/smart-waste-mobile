import { api } from "./api";

 export async function loginPersonnel(personnelId: string, password: string) {
    try {
        const response = await api.post('personnel/login', {
            personnelId,
            password,
        });

        return response.data;
    } catch (error: any) {
        throw error?.response?.data.message || "Login failed";
    }
 }