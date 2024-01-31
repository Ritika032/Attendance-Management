import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  getAdminDate,
  getAdminCounts,
  logout,
} from "../../api-helper/api-helper";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceManagement = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [attendanceCounts, setAttendanceCounts] = useState<
    {
      totalStudentsCount: number;
      presentStudentsCount: number;
      absentStudentsCount: number;
    }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [attendanceData, setAttendanceData] = useState<{
    length: number;
    attendanceList: any[];
  }>({
    length: 0,
    attendanceList: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Toggle
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  //count number of attendies table
  useEffect(() => {
    const fetchAttendanceCounts = async () => {
      try {
        const response = await getAdminCounts();
        console.log("API Response:", response.data);
        //@ts-ignore
        setAttendanceCounts([response.data]);
      } catch (error: any) {
        console.error(
          "Failed to fetch counts data:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchAttendanceCounts();
  }, []);

  // Fetch attendance by Date
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedDate) {
          const formattedDate = selectedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          const response = await getAdminDate(formattedDate);
          console.log("Attendance data for date:", response.data);
          setAttendanceData(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to fetch attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [selectedDate]);

  //logout
  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response.data.message);
      localStorage.removeItem("adminId");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const data = {
    labels: ["Absent", "Present"],
    datasets: [
      {
        label: "# of Students",
        data: [
          attendanceCounts[0]?.absentStudentsCount || 0,
          attendanceCounts[0]?.presentStudentsCount || 0,
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    width: 10,
    height: 10,
    position: "relative",
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <button
        className="md:hidden bg-slate-800 text-white p-2 rounded-md focus:outline-none"
        onClick={toggleMenu}
      >
        &#9776; {/* Hamburger icon */}
      </button>

      <nav
        className={`bg-slate-800 text-white sticky top-0 w-full md:w-1/6 p-4 md:p-8 
        ${isMenuOpen ? "block" : "hidden"} md:block`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-4">
          Dashboard
        </h2>

        <ul>
          <li className="mb-2 md:mb-6">
            <Link
              to="/student-management"
              className="bg-blue-900 block p-2 hover:bg-blue-800 rounded-md text-center"
            >
              Student Management
            </Link>
          </li>

          <li
            className="mb-2 md:mb-6 bg-blue-900  cursor-pointer hover:bg-blue-800 block p-2 rounded-md text-center"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </nav>

      <div className="md:w-5/6 p-8 m-0">
        <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
        <h2 className="text-blue-900 font-bold">
          Total Students - {attendanceCounts[0]?.totalStudentsCount || 0}
        </h2>

        <div className="md:flex items-start mt-4 space-x-4">
          <div className="md:w-1/2 mx-auto mb-4 md:mb-0">
            <Doughnut
              className="w-full"
              data={data}
              //@ts-ignore
              options={options}
            />
          </div>

          <div className="md:w-1/4 md:mb-4 text-center sticky p-8 rounded-3xl bg-blue-100">
            <div className="mt-8  ">
              <label className=" font-bold text-blue-900 text-center ">
                Select Date:{" "}
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                className="p-1 mt-3 border text-center border-blue-500 focus:outline-none rounded-3xl focus:border-blue-700"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {selectedDate && (
              <div>
                <h2 className="text-sm font-bold mb-2">
                  Attendance Data for {selectedDate.toDateString()}
                </h2>
                <p>Total: {attendanceData.length}</p>

                <table className="table-auto w-full border-collapse border border-gray-800 mt-2">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.attendanceList.map((attendance, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">
                          {attendance.student.name}
                        </td>
                        <td className="border p-2">
                          {attendance.status ? "Present" : "Absent"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
                    };

export default AttendanceManagement;
