import React from "react";
import { Link } from "react-router-dom";

const SocitiesPage = () => {
  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Socities
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl mb-4">
        <div className="flex flex-col items-center">
          <Link to="/ManageSocieties" className="w-full">
            <button className="w-full bg-blue-950 text-white font-semibold py-2 rounded focus-outline-none focus-shadow-outline hover:bg-blue-700">
              Manage Societies
            </button>
          </Link>
          <Link to="/ApprovedSocieties" className="w-full mt-4">
            <button className="w-full bg-blue-950 text-white font-semibold py-2 rounded focus-outline-none focus-shadow-outline hover:bg-blue-700">
              Approved Societies
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocitiesPage;
