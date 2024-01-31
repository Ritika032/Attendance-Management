import axios, { AxiosResponse } from "axios";
import { SHA256, enc } from "crypto-js";

// axios.defaults.withCredentials = true;
const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
// console.log(import.meta.env.VITE_BACKEND_URL)
//LogIn
export const login = async (email: string, password: string) => {
  try {
    // const deviceId = `${navigator.userAgent}-${navigator.platform}-${window.screen.width}x${window.screen.height}`;
    //@ts-ignore
    // const hash = SHA256(deviceId).toString(enc.Hex);
    const hash = "dumu";
    const obj = { email: email, password: password, hash: hash };

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    const config = { headers: { "Content-Type": "application/json" } };

    const response = await api.post("/api/v1/login", obj);

    return response;
  } catch (error: any) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<AxiosResponse> => {
  try {
    const response = await api.get("/api/v1/logout");

    return response;
  } catch (error: any) {
    console.error(
      "Logout failed:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Forgot Password
export const forgotPasssword = async (
  email: string
): Promise<AxiosResponse> => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await api.post("/api/v1/password/forgot", { email });

    return response;
  } catch (error: any) {
    console.error(
      "Failed",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Reset password
export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<AxiosResponse> => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await api.put(`/api/v1/password/reset`, {
      password: newPassword,
      confirmPassword: confirmPassword,
      token: token,
    });

    return response;
  } catch (error: any) {
    console.error(
      "Failed to reset password:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Get All students (Admin)
export const getAdminStudentsData = async (
  page: number
): Promise<
  AxiosResponse<
    {
      id: number;
      name: string;
      email: string;
      number: number;
      rollNumber: number;
    }[]
  >
> => {
  try {
    const response = await api.get(`api/v1/admin/students?page=${page}`);

    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch students data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Get Attendance Counts (Admin)
export const getAdminCounts = async (): Promise<
  AxiosResponse<
    {
      totalStudentsCount: number;
      presentStudentsCount: number;
      absentStudentsCount: number;
    }[]
  >
> => {
  try {
    const response = await api.get("/api/v1/admin/todaysCounts");
    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
// search student (admin)
export const searchStudent = async (word: string) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await api.post("/api/v1/admin/search", { word });
    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
//Get attendnace by day (admin)
export const getAdminDate = async (date: string): Promise<AxiosResponse> => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await api.post(`/api/v1/admin/day?date=${date}`);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch admin/day data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//QR Code Generation
export const qrcodegenerator = async (): Promise<
  AxiosResponse<
    {
      text: string;
    }[]
  >
> => {
  try {
    const response = await api.get("/api/v1/qr/get");

    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Get attendnace Count (Student)
export const getMyCounts = async (): Promise<
  AxiosResponse<{
    totalAttendanceDays: number;
    presentDays: number;
    absentDays: number;
  }>
> => {
  try {
    const response = await api.get("/api/v1/student/myCounts");

    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch my counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
//Check Attendance By Date
export const checkStudentPresence = async (
  studentId: string,
  date: string
): Promise<AxiosResponse<{ success: boolean; isPresent: boolean }>> => {
  try {
    const response = await api.post("/api/v1/student/date", {
      student: studentId,
      date: date,
    });

    return response;
  } catch (error: any) {
    console.error(
      "Failed to check student presence:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
