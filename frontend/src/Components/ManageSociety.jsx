import React, { useState } from "react";

const ManageSociety = () => {
  const [societies, setSocieties] = useState([
    { id: 1, name: "Society 1", approved: false },
    { id: 2, name: "Society 2", approved: false },
    { id: 3, name: "Society 3", approved: true },
  ]);

  const approveSociety = (id) => {
    const updatedSocieties = societies.map((society) =>
      society.id === id ? { ...society, approved: true } : society
    );
    setSocieties(updatedSocieties);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Societies</h1>

      <ul>
        {societies.map((society) => (
          <li
            key={society.id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center mb-2"
          >
            <span>{society.name}</span>
            {!society.approved && (
              <button
                onClick={() => approveSociety(society.id)}
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
              >
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSociety;
