import React from "react";
import { Link } from "react-router-dom";

const AppointmentsPage = () => {
  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Appointments
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl mb-4">
        <div className="flex flex-col items-center">
          <Link to="/ManageAppointments" className="w-full">
            <button className="w-full bg-blue-950 text-white font-semibold py-2 rounded focus-outline-none focus-shadow-outline hover:bg-blue-700">
              Manage Appointments
            </button>
          </Link>
          <Link to="/ApprovedAppointments" className="w-full mt-4">
            <button className="w-full bg-blue-950 text-white font-semibold py-2 rounded focus-outline-none focus-shadow-outline hover:bg-blue-700">
              Approved Appointments
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
