import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SocietyForm = () => {
  const [societies, setSocieties] = useState([]);
  const [editSociety, setEditSociety] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/getAllSocieties"
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid response format:", response);
        return;
      }

      const fetchedSocieties = response.data.data;

      if (!fetchedSocieties || !Array.isArray(fetchedSocieties)) {
        console.error(
          "Invalid data format - expected an array:",
          fetchedSocieties
        );
        setSocieties([]);
        return;
      }

      setSocieties(fetchedSocieties);
      setEditSociety(null);
    } catch (error) {
      console.error("Error fetching society data:", error);
    }
  };

  const handleEdit = (society) => {
    setEditSociety(society);
    setIsEditFormOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/v1/admin/updateSociety/${editSociety._id}`,
        updatedData
      );
      const updatedSociety = response.data.data;

      setSocieties((prevSocieties) =>
        prevSocieties.map((society) =>
          society._id === updatedSociety._id ? updatedSociety : society
        )
      );

      setEditSociety(null);
      setIsEditFormOpen(false);

      fetchData();
    } catch (error) {
      console.error("Error updating society data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/admin/deleteSociety/${id}`
      );
      if (response.status === 204) {
        setSocieties((prevSocieties) =>
          prevSocieties.filter((society) => society._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting society:", error);
    }
  };

  const handleCancel = () => {
    setEditSociety(null);
    setIsEditFormOpen(false);
  };

  const handleGetSociety = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/admin/getOneSociety/${searchTerm}`
      );

      const responseData = response.data;

      if (!responseData || !responseData.data) {
        console.error("Invalid response format:", response);
        return;
      }

      const fetchedSocieties = Array.isArray(responseData.data.societies)
        ? responseData.data.societies
        : [];

      setSocieties(fetchedSocieties);
    } catch (error) {
      console.error("Error searching for societies:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchData();
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-r from-blue-900 to-white text-white p-6 mt-10">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-bold text-white mb-4 mt-4 ml-2">
            {" "}
            Society Records
          </h1>
          <button
            onClick={() => navigate("/ManageSocieties")}
            className="bg-[#FF9503] font-bold text-white py-2 px-4 rounded hover:bg-[#FFA726] focus:outline-none focus:ring focus:ring-[#FFA726]"
          >
            New Requests
          </button>
        </div>
        <center>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by name"
              className="w-1/2 py-2 px-4 mt-2 text-black border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[#64B5F6]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="ml-2 bg-gray-500 text-white py-1 px-2 rounded hover:bg-[#64B5F6] focus:outline-none focus:ring focus:ring-[#64B5F6]"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleGetSociety}
              className="ml-2 bg-[#2196F3] text-white py-1 px-2 rounded hover:bg-[#1976D2] focus:outline-none focus:ring focus:ring-[#1976D2]"
            >
              Search
            </button>
          </div>
        </center>
      </div>

      {/* Society Table */}
      <div className="overflow-x-auto mt-4">
        <table className="md:w-full w-32 mb-20 bg-white text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-300">
                Society Name
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-300">Logo</th>
              <th className="px-4 py-2 border-b-2 border-gray-300">
                Description
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {societies.map((society, index) => (
              <tr
                key={society._id}
                className={`border shadow-md rounded-md bg-${
                  index % 2 === 0 ? "gray-100" : "gray-200"
                } text-black transition-all duration-300 ease-in-out`}
              >
                <td className="border px-4 py-2">{society.name}</td>
                <td className="border px-4 py-2">
                  <img
                    src={society.logo}
                    alt={society.name}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="border px-4 py-2">{society.description}</td>
                <td className="border px-4 py-2 space-x-2 flex items-center">
                  <button
                    onClick={() => handleEdit(society)}
                    className="bg-[#2196F3] hover:bg-[#1976D2] text-white py-1 px-2 rounded focus:outline-none focus:ring focus:ring-[#1976D2]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(society._id)}
                    className="bg-[#EF5350] hover:bg-[#D32F2F] text-white py-1 px-2 rounded focus:outline-none focus:ring focus:ring-[#D32F2F]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditFormOpen && editSociety && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <h2 className="text-2xl font-bold mb-4 text-[#2196F3]">
              ✏️ Edit Society
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  name: e.target.name.value,
                  description: e.target.description.value,
                };
                handleUpdate(updatedData);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label className="text-[#2196F3]">Society Name:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-[#2196F3]"
                  type="text"
                  name="name"
                  defaultValue={editSociety.name}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[#2196F3]">Description:</label>
                <input
                  className="text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-[#2196F3]"
                  type="text"
                  name="description"
                  defaultValue={editSociety.description}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-[#4CAF50] hover:bg-[#388E3C] text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-[#388E3C]"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-[#EF5350] hover:bg-[#D32F2F] text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-[#D32F2F]"
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

export default SocietyForm;
