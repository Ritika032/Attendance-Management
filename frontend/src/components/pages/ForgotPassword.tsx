import { useState, ChangeEvent, FormEvent, useEffect } from "react";
//@ts-ignore
import { Link, useNavigate } from "react-router-dom";
import { forgotPasssword } from "../../api-helper/api-helper";

interface ForgotPasswordData {
  [key: string]: string;
  email: string;
}

function ForgotPassword() {
  const navigate = useNavigate();

  const [forgotPasswordData, setForgotPasswordData] =
    useState<ForgotPasswordData>({ email: "" });
  const [errors, setErrors] = useState<Partial<ForgotPasswordData>>({});
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiResponse) {
      console.log(apiResponse);
    }
  }, [apiResponse]);

  //Handle Input Changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForgotPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Validate Form
  const validateForm = () => {
    let valid = true;
    const newErrors: Partial<ForgotPasswordData> = {};
    if (!forgotPasswordData.email.trim()) {
      newErrors.email = "Please enter your email.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  //Hnadle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await forgotPasssword(forgotPasswordData.email);
        console.log("API Response:", response);
        setApiResponse(response.data.message);
        const resetToken = response.data.resetToken;
        navigate(`/password/reset`);
      } catch (error: any) {
        console.error("Error sending forgot password request:", error.message);
        setApiResponse("Error sending forgot password request.");
      } finally {
        setLoading(false);
      }
    }
    alert("Check your Inbox");
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
            Forgot Password
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
                value={forgotPasswordData.email}
                onChange={handleInputChange}
                className={`mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              className={`bg-orange-700 text-white p-3 rounded-md w-full hover:bg-orange-800 focus:outline-none focus:ring focus:border-blue-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <div className="text-center mt-4">
              <Link to="/" className="text-blue-500 hover:underline">
                Back to Login
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

export default ForgotPassword;
