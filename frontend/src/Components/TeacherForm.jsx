import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/getAllTeachers"
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid response format:", response);
        return;
      }

      const fetchedTeachers = response.data.data.users;

      if (!fetchedTeachers || !Array.isArray(fetchedTeachers)) {
        console.error(
          "Invalid data format - expected an array:",
          fetchedTeachers
        );
        setTeachers([]);
        return;
      }

      setTeachers(fetchedTeachers);
      setEditTeacher(null);
      setIsEditFormOpen(false);
    } catch (error) {
      console.error("Error fetching teachers data:", error);
    }
  };

  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setIsEditFormOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      if (!editTeacher || !editTeacher._id) {
        console.error("No teacher selected for update or missing _id");
        return;
      }

      const response = await axios.patch(
        `http://localhost:4000/api/v1/admin/updateTeacher/${editTeacher._id}`,
        updatedData
      );

      const responseData = response.data;

      if (
        !responseData ||
        responseData.status !== "success" ||
        !responseData.data.teacher
      ) {
        console.error("Invalid response format:", response);
        return;
      }

      const updatedTeacher = responseData.data.teacher;

      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === updatedTeacher._id ? updatedTeacher : teacher
        )
      );

      setEditTeacher(null);
      setIsEditFormOpen(false);

      fetchData();
    } catch (error) {
      console.error("Error updating teacher data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/admin/deleteTeacher/${id}`
      );
      if (response.status === 204) {
        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const handleGetTeacher = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/admin/getOneTeacher/${searchTerm}`
      );

      const responseData = response.data;

      if (!responseData || !responseData.data) {
        console.error("Invalid response format:", response);
        return;
      }

      const fetchedTeachers = Array.isArray(responseData.data.users)
        ? responseData.data.users
        : [];

      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error("Error searching for teachers:", error);
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
          <h1 className="text-5xl font-bold mb-4">📚 Teacher Records</h1>
          <button
            onClick={() => navigate("/AddTeacher")}
            className="bg-green-600 font-bold text-white py-2 px-4 rounded hover:bg-green-800 focus:outline-none focus:ring focus:ring-green-400"
          >
            Add Teacher
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
              onClick={handleGetTeacher}
              className="ml-2 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Search
            </button>
          </div>
        </center>
      </div>

      <div className="overflow-x-auto">
        <table className="md:w-full w-32 mb-10 bg-white text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-300">Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-300">Email</th>
              <th className="px-4 py-2 border-b-2 border-gray-300">
                Specialization
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-300">
                Phone Number
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher._id}
                className={`border shadow-md rounded-md bg-${
                  index % 2 === 0 ? "gray-100" : "gray-200"
                } text-black transition-all duration-300 ease-in-out`}
              >
                <td className="border px-4 py-2">{teacher.name}</td>
                <td className="border px-4 py-2">{teacher.email}</td>
                <td className="border px-4 py-2">{teacher.specialization}</td>
                <td className="border px-4 py-2">{teacher.phone}</td>
                <td className="border px-4 py-2 space-x-2 flex items-center">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
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

      {isEditFormOpen && editTeacher && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
              ✏️ Edit Teacher
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  specialization: e.target.specialization.value,
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
                  defaultValue={editTeacher.name}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-900">Email:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="email"
                  defaultValue={editTeacher.email}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-900">Specialization:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="specialization"
                  defaultValue={editTeacher.specialization}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-900">Phone:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  name="phone"
                  defaultValue={editTeacher.phone}
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
                  onClick={() => setIsEditFormOpen(false)}
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

export default TeacherForm;
