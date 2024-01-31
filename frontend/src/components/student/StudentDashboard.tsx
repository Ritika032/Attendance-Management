import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { logout } from "../../api-helper/api-helper";
import { login } from "../../api-helper/api-helper";
import { getMyCounts, checkStudentPresence } from "../../api-helper/api-helper";
import { AxiosResponse } from "axios";

const StudentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPresent, setIsPresent] = useState<boolean | null>(null);

  const [studentData, setStudentData] = useState({
    id: "",
    name: "",
    number: "",
    email: "",
    rollNumber: "",
  });

  const [myCounts, setMyCounts] = useState<{
    totalAttendanceDays: number;
    presentDays: number;
    absentDays: number;
  } | null>(null);

  //fetch total counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<{
          totalAttendanceDays: number;
          presentDays: number;
          absentDays: number;
        }> = await getMyCounts();

        setMyCounts(response.data);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  //Fetch student presence by date
  useEffect(() => {
    const fetchPresenceStatus = async () => {
      try {
        if (selectedDate) {
          const formattedDate = selectedDate?.toISOString();
          const studentId = studentData.id;
          const response: AxiosResponse<{
            success: boolean;
            isPresent: boolean;
          }> = await checkStudentPresence(studentId, formattedDate);

          console.log("Presence status for date:", response.data);
          setIsPresent(response.data.isPresent);
        }
      } catch (error: any) {
        console.error("Error checking presence status:", error.message);
      }
    };

    fetchPresenceStatus();
  }, [selectedDate]);

  //student details fetch
  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const userPassword = localStorage.getItem("password");

    if (userEmail && userPassword) {
      login(userEmail, userPassword)
        .then((response) => {
          const student = response.data;

          if (student) {
            const firstStudent = student.user;
            console.log("Student details:", firstStudent);

            setStudentData({
              id: firstStudent._id,
              name: firstStudent.name,
              number: firstStudent.number,
              email: firstStudent.email,
              rollNumber: firstStudent.rollNumber,
            });
          } else {
            console.error("No student data found in the API response");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch student data:", error);
        });
    }
  }, []);

  //logout
  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response.data.message);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="m-2"
      style={{
        backgroundImage: "url('/images/home-right.jpg')",
        backgroundSize: "cover",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {/* Student Details */}
      <div className=" mt-9  p-8 w-full md:w-1/3 ">
        <div className="bg-orange-100 p-3 rounded-3xl">
          <h2 className="mt-5 text-xl font-bold mb-6 bg-amber-400 p-4 rounded-3xl text-center">
            Student Details
          </h2>
          <table className="bg-orange-200 rounded-2xl text-center">
            <tbody>
              <tr>
                <td className="px-4 py-4 text-center font-bold">Name:</td>
                <td className="px-4 py-4 text-center">{studentData.name}</td>
              </tr>
              <tr>
                <td className="px-2 py-4 text-center font-bold">
                  Mobile Number:
                </td>
                <td className="px-2 py-4 text-center bg-white-100">
                  {studentData.number}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-4 text-center font-bold">Email:</td>
                <td className="px-2 py-4 text-center bg-white-100">
                  {studentData.email}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-center font-bold">
                  Roll Number:
                </td>
                <td className="px-4 py-4 text-center bg-white-100">
                  {studentData.rollNumber}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* View Attendance */}
      <div className="p-8 w-full md:w-1/3 mt-9">
        <div className="bg-orange-200 p-14 rounded-3xl m-7">
          <h2 className="text-xl font-bold mt-1 bg-orange-400 p-4 rounded-3xl text-center">
            Calendar
          </h2>
          <div className="mb-14 text-center">
            <label
              htmlFor="datepicker"
              className="p-4 text-center block text-sm font-medium text-black"
            >
              Select Date:
            </label>
            <DatePicker
              className="p-1 rounded-xl text-center bg-amber-400"
              id="datepicker"
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
            />
          </div>
          {isPresent !== null && (
            <p
              className={`font-bold text-center ${
                isPresent ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPresent
                ? `You were present on ${selectedDate?.toLocaleDateString()}`
                : `You were absent on ${selectedDate?.toLocaleDateString()}`}
            </p>
          )}
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="p-8 w-full md:w-1/3 mt-9">
        <div className="bg-orange-100 p-12 rounded-3xl">
          <h2 className="text-xl font-bold mb-6  bg-amber-400 p-4 rounded-3xl text-center">
            Attendance
          </h2>
          <div className="bg-orange-200 rounded-2xl text-center px-4">
            <table className="m-5 ml-12  ">
              <tbody>
                <tr>
                  <td className=" px-5 py-4 text-center">Total Days</td>
                  <td className="bg-white-100  px-5 py-4 text-center">
                    {myCounts?.totalAttendanceDays}
                  </td>
                </tr>
                <tr>
                  <td className=" px-4 py-5 text-center">Total Present</td>
                  <td className="bg-white-100 px-5 py-4 text-center">
                    {myCounts?.presentDays}
                  </td>
                </tr>
                <tr>
                  <td className=" px-5 py-4 text-center">Total Absent</td>
                  <td className="bg-wgite-100  px-5 py-4 text-center">
                    {myCounts?.absentDays}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        className="hover:bg-orange-500 cursor-pointer p-2 m-2 bg-orange-400 rounded-xl text-center mt-auto ml-auto"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;
