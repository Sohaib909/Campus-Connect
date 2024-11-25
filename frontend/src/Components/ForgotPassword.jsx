import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = () => {
    setError("");
  };

  const handleForgotPassword = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/forgotPassword",
        {
          email,
        }
      );

      if (response.status === 200) {
        const resetToken = response.data.resetToken;
        const resetUrl = `${window.location.origin}/reset-password/${resetToken}`;
        setResetSuccess(true);

        setTimeout(() => {
          setResetSuccess(false);
          setShowSessionExpired(true);
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = function () {
            window.history.pushState(null, null, window.location.href);
          };
        }, 5000);
      } else {
        console.error("Failed to send password reset email");
        setError("Failed to send password reset email");
      }
    } catch (error) {
      console.error("An error occurred while sending the reset email:", error);
      setError("An error occurred while sending the reset email");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let sessionExpiredTimeout;
    if (showSessionExpired) {
      window.history.replaceState(null, null, "/Login");

      sessionExpiredTimeout = setTimeout(() => {
        navigate("/Login");
      }, 2000);
    }

    return () => {
      if (sessionExpiredTimeout) {
        clearTimeout(sessionExpiredTimeout);
      }
    };
  }, [showSessionExpired, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-900 text-white relative">
      <Link
        to="/Login"
        className="font-semibold absolute top-0 left-0 mt-6 ml-6"
      >
        &lt; Back
      </Link>
      <div className="block text-gray-700 absolute top-20 left-1/2 transform -translate-x-1/2 my-6">
        <img
          src="http://localhost:3000/fptasset-12x-1@2x.png"
          alt="Logo"
          style={{ maxWidth: "200px" }}
        />
      </div>
      <div className="bg-blue p-8 rounded shadow-md w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleForgotPassword}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Reset Password"}
        </button>
        {isLoading && <div className="mt-2 spinner"></div>}
      </div>
      {resetSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-green-500 mb-2">
              Password reset email sent successfully.
            </p>
          </div>
        </div>
      )}
      {showSessionExpired && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-green-500 mb-2">Redirecting to Login...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
