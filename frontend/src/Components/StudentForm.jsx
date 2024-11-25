import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/getAllStudents"
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid response format:", response);
        return;
      }

      const fetchedStudents = response.data.data.users;

      if (!fetchedStudents || !Array.isArray(fetchedStudents)) {
        console.error(
          "Invalid data format - expected an array:",
          fetchedStudents
        );
        setStudents([]);
        return;
      }

      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setIsEditFormOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/v1/admin/updateStudent/${editStudent._id}`,
        updatedData
      );
      const updatedStudent = response.data.data.student;

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student
        )
      );

      setEditStudent(null);
      setIsEditFormOpen(false);
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  const handleCancel = () => {
    setEditStudent(null);
    setIsEditFormOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/admin/deleteStudent/${id}`
      );
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleGetStudent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/admin/getOneStudent/${searchTerm}`
      );

      const responseData = response.data;

      if (!responseData || !responseData.data) {
        console.error("Invalid response format:", response);
        return;
      }

      const fetchedStudents = Array.isArray(responseData.data.users)
        ? responseData.data.users
        : [];

      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error searching for students:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchData();
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-r from-blue-900 to-white text-white p-6 mt-10">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-bold mb-4">🎓 Student Records</h1>
          <button
            onClick={() => navigate("/AddStudent")}
            className="bg-green-600 font-bold text-white py-2 px-4 rounded hover:bg-green-800 focus:outline-none focus:ring focus:ring-green-400"
          >
            Add Student
          </button>
        </div>
        <center>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or phone"
              className="w-1/2 py-2 px-4 mt-2 text-black border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="ml-2 bg-gray-500 text-white py-1 px-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleGetStudent}
              className="ml-2 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Search
            </button>
          </div>
        </center>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="w-full mt-10 bg-white text-black table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-300">Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-300">Email</th>
              <th className="px-4 py-2 border-b-2 border-gray-300">
                Department
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-300">
                Phone Number
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className={`border shadow-md rounded-md bg-${
                  index % 2 === 0 ? "gray-100" : "gray-200"
                } text-black transition-all duration-300 ease-in-out`}
              >
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">{student.department}</td>
                <td className="border px-4 py-2">{student.phone}</td>
                <td className="border px-4 py-2 space-x-2 flex items-center">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditFormOpen && editStudent && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
              ✏️ Edit Student
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  department: e.target.department.value,
                  phone: e.target.phone.value,
                };
                handleUpdate(updatedData);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label className="text-blue-900">Name:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="name"
                  defaultValue={editStudent.name}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-900">Email:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="email"
                  defaultValue={editStudent.email}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-900">Department:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="department"
                  defaultValue={editStudent.department}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-900">Phone:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="phone"
                  defaultValue={editStudent.phone}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentForm;
