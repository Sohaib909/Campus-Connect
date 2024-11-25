import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkTokenValidity = async () => {
    try {
      setError("");

      const response = await axios.get(
        `http://localhost:4000/api/v1/users/resetPassword/${token}/checkValidity`
      );

      setTokenValid(response.status === 200);
    } catch (error) {
      console.error("An error occurred while checking token validity:", error);
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, [token]);

  const handleResetPassword = async () => {
    try {
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setShowPopup(true);
        return;
      }

      if (!tokenValid) {
        setError("Token is invalid or expired");
        setShowPopup(true);
        return;
      }

      setIsLoading(true);

      const response = await axios.patch(
        `http://localhost:4000/api/v1/users/resetPassword/${token}`,
        {
          password,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        console.log("Password reset successfully");
        setShowPopup(true);
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
        window.history.replaceState(null, null, "/Login");
        window.onpopstate = function () {
          window.history.replaceState(null, null, "/Login");
        };
      } else {
        console.log("Failed to reset password");
        setError("Failed to reset password");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("An error occurred while resetting the password:", error);
      setError("An error occurred while resetting the password");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-900">
      <img
        src="http://localhost:3000/fptasset-12x-1@2x.png"
        alt="Logo"
        className="mb-8"
      />
      <div className="bg-blue p-8 rounded shadow-md w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Reset Password
        </h2>
        {(error || showPopup) && (
          <div
            className={`bg-${
              error ? "red" : "green"
            }-500 text-white text-center p-2 mb-2 rounded`}
          >
            {error || "Password reset successful. Redirecting to login..."}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            New Password
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className={`bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
