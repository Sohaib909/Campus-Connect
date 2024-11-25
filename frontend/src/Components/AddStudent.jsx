import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../Animation/_loginAnimation.json";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const API_URL = "http://localhost:4000/api/v1/admin/addStudent";
const SUCCESS_MESSAGE = "Student added successfully.";
const ADD_STUDENT_FAILED_MESSAGE =
  "Failed to add student. Please check your information.";
const ERROR_MESSAGE = "An error occurred during student addition.";

function FormField({ label, type, name, value, onChange }) {
  return (
    <div className="mb-4">
      <label
        className="block text-blue-900 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      {type === "file" ? (
        <input
          className="appearance-none w-full py-2 text-gray-700 leading-tight focus:outline-none"
          id={name}
          type={type}
          name={name}
          onChange={onChange}
        />
      ) : (
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={name}
          type={type}
          placeholder={label}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function DepartmentSelect({ formData, handleChange }) {
  return (
    <div className="mb-4">
      <label
        className="block text-blue-900 text-sm font-bold mb-2"
        htmlFor="department"
      >
        Department
      </label>
      <select
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="department"
        name="department"
        value={formData.department}
        onChange={handleChange}
      >
        <option value="">Select Department</option>
        <option value="CS">Computer Science (CS)</option>
        <option value="SE">Software Engineering (SE)</option>
        <option value="EE">Electrical Engineering (EE)</option>
        <option value="CE">Chemical Engineering (CE)</option>
        <option value="BBA">Business Administration (BBA)</option>
        <option value="BDE">Art & Design (BDE)</option>
      </select>
    </div>
  );
}

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    countryCode: "",
    phoneNumber: "",
    department: "",
    image: null,
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      phoneNumber: "",
      countryCode: "",
      image: null,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
    } else if (name === "phoneNumber" && value !== undefined) {
      const phoneNumberWithoutCode = value.replace(/^\+/, "");
      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: phoneNumberWithoutCode,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCountryChange = (country) => {
    if (country && country.country !== formData.countryCode) {
      setFormData((prevData) => ({
        ...prevData,
        countryCode: country.country,
        phoneNumber: `+${country.country} ${prevData.phoneNumber}`,
      }));
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Append image as a separate field
        if (key === "image" && value instanceof File) {
          data.append("image", value);
        } else {
          data.append(key, value);
        }
      });

      const response = await axios.post(API_URL, data);

      if (response.data.status === "success") {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          resetFormData();
        }, 3000);
      } else {
        setErrorMessage(ADD_STUDENT_FAILED_MESSAGE);
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(ERROR_MESSAGE);
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-auto bg-gradient-to-r from-blue-900 to-white">
      <div className="bg-white p-4 sm:p-8 rounded shadow-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mt-10 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
          Add Student
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className="mb-4">
            <label
              className="block text-blue-900 text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="PK"
              value={`+${formData.countryCode} ${formData.phoneNumber}`}
              onChange={(value) => {
                const match = value.match(/^\+(\d{1,2})\s?(\d*)$/);
                const countryCode = match ? match[1] : "92";
                const phoneNumber = match ? match[2] : "";
                setFormData((prevData) => ({
                  ...prevData,
                  countryCode,
                  phoneNumber,
                }));
              }}
              onCountryChange={handleCountryChange}
              inputProps={{
                name: "phoneNumber",
                required: true,
              }}
            />
          </div>
          {formData.role === "student" && (
            <DepartmentSelect formData={formData} handleChange={handleChange} />
          )}
          <FormField
            label="Profile Image"
            type="file"
            name="image"
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-blue-900 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus-outline-none focus-shadow-outline mt-4 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Adding student..." : "Add Student"}
        </button>
        <center>
          <br />
          <Link
            to="/AdminDashboard"
            className="text-blue-900 mx-4 mt-4 text-center"
          >
            Back to Dashboard
          </Link>
        </center>
      </div>

      {showSuccessPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <p className="text-green-600 font-bold mb-2">{SUCCESS_MESSAGE}</p>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <p className="text-red-600 font-bold mb-2">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStudent;
