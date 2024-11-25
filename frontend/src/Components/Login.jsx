import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import loginAnimation from "../Animation/_loginAnimation.json";
import { Transition } from "@headlessui/react";
import { TypeAnimation } from "react-type-animation";

function Login({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = 3500;
    const timeoutId = setTimeout(() => {
      setIsPageLoaded(true);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem("authToken", token);
    const expirationTime = new Date().getTime() + 60 * 60 * 1000;
    localStorage.setItem("authTokenExpires", expirationTime);
  };

  const handleLogin = async () => {
    setIsLoading(true);
  
    try {
      setErrorMessage("");
  
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/login",
        {
          email,
          password,
        }
      );
  
      if (response.data.status === "success") {
        const token = response.data.token;
        saveTokenToLocalStorage(token);
  
        const roleResponse = await axios.get(
          "http://localhost:4000/api/v1/users/fetchRole",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (roleResponse.data.status === "success") {
          const userRole = roleResponse.data.role;
          setUserRole(userRole);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            if (userRole === "student") {
              navigate("/HomePage");
            } else if (userRole === "teacher") {
              navigate("/TeacherHomePage");
            } else if (userRole === "admin") {
              navigate("/AdminDashboard");
            } else {
              setErrorMessage("Invalid user role");
            }
          }, 3000);
        } else {
          setErrorMessage("Failed to fetch user role");
        }
      }else {
        setErrorMessage(response.data.message || "Please enter the correct email or password.");
       
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Please enter the correct email or password.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-900">
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-green-500 mb-2 text-center font-bold">
              Login Successfull
            </p>
            <p>Redirecting to the Home Page...</p>
          </div>
        </div>
      )}

      <div className="mb-6 mt-0 relative">
        <img src="fptasset-12x-1@2x.png" alt="Logo" />
        <div className="absolute h-fit opacity-50 ml-48">
          <Lottie className="" animationData={loginAnimation} />
        </div>
      </div>
      <div className="">
        <TypeAnimation
          sequence={[
            "Welcom to Campus Connect",
            1000,
            "",
            1000,
            "",
            1000,
            "",
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: "4em",
            display: "inline-block",
            color: "white",
            marginTop: "1rem",
          }}
          repeat={Infinity}
        />
      </div>

      {isPageLoaded && (
        <div className="bg-white p-4 sm:p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
            Login
          </h2>
          {errorMessage && (
            <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
          )}
          <div className="mb-4">
            <label
              className="block text-blue-900 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-blue-900 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-blue-900 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-blue-900 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <center>
            <button
              className="bg-blue-900 hover-bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </button>
          </center>
          <div className="mt-4 text-center">
            <Link
              to="/Forgot"
              className="text-blue-900 focus:outline-none focus:shadow-outline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/SignUp" className="text-blue-900">
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
