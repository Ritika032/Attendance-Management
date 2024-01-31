import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin, adminLogin } from "../../store/store";
import { login } from "../../api-helper/api-helper";

interface LoginData {
  email: string;
  password: string;
}

function UserLogin() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) {
      setErrors({
        email: !loginData.email.trim() ? "Please enter your email." : "",
        password: !loginData.password.trim()
          ? "Please enter your password."
          : "",
      });
      return;
    }

    try {
      const response = await login(loginData.email, loginData.password);
      console.log("Login successful. Token:", response.data.token);

      const userType = response.data.user.type;

      if (userType === "Admin") {
        dispatch(adminLogin());
        localStorage.setItem("adminId", response.data.user.id);
        localStorage.setItem("token", response.data.token);
        navigate("/attendance-management");
      } else if (userType === "Student") {
        dispatch(userLogin());
        localStorage.setItem("userId", response.data.user.id);
        navigate("/student-dashboard");
      } else {
        console.error("Unknown user type:", userType);
      }
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="md:flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home-left.jpeg')" }}
      ></div>

      <div
        className="md:flex-1 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/home-center.jpeg')" }}
      >
        <div className="bg-white p-8 rounded-3xl shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Student Attendance
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                placeholder="Enter your Email"
                type="text"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className={`mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring
                 focus:border-blue-300 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                placeholder="Enter your Password"
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className={`mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-orange-700 text-white p-3 rounded-md w-full hover:bg-orange-800 focus:outline-none focus:ring focus:border-blue-300"
            >
              Login
            </button>
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div
        className="md:flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home-right.jpg')" }}
      ></div>
    </div>
  );
}

export default UserLogin;
