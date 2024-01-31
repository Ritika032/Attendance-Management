import axios from "axios";

const api = axios.create({
  baseURL: "https://attendancebackendservice.onrender.com",
});

//login
export const login = async (email, password) => {
  try {
    const hash = "dummy";
    const obj = {
      email: email,
      password: password,
      hash: hash,
    };
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await api.post("/api/v1/login", obj, config);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error in login:", error.message);
    throw error;
  }
};

//Scan QR
export const scanQR = async (hash) => {
  try {
    const obj = {
      hash: hash,
    };
    // const config = { headers: { "Content-Type": "application/json" } };
    const response = await api.post("/api/v1/qr/scan", obj, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error in scanQR:", error.message);
    throw error;
  }
};
