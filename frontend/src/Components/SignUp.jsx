import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../Animation/_loginAnimation.json";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Transition } from "@headlessui/react";
import { TypeAnimation } from "react-type-animation";

const API_URL = "http://localhost:4000/api/v1/users/signup";
const SUCCESS_MESSAGE = "User created successfully.";
const ERROR_MESSAGE = "Registeration Failed";
const email_MESSAGE = "Registeration Failed! Email Already Registered";
const phone_MESSAGE = "Registeration Failed! Phone Number Already Registered";

function FormField({ label, type, name, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-bold mb-2" htmlFor={name}>
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

function RoleSelect({ formData, handleChange }) {
  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-bold mb-2" htmlFor="role">
        Sign up as
      </label>
      <select
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="role"
        name="role"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
    </div>
  );
}

function DepartmentSelect({ formData, handleChange }) {
  return (
    <div className="mb-4">
      <label
        className="block text-white text-sm font-bold mb-2"
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
        <option value="Computer Science">Computer Science (CS)</option>
        <option value="Software Engineering">Software Engineering (SE)</option>
        <option value="Electrical Engineering">
          Electrical Engineering (EE)
        </option>
        <option value="Chemical Engineering">Chemical Engineering (CE)</option>
        <option value="Business Administration">
          Business Administration (BBA)
        </option>
        <option value="Art & Design">Art & Design (BDE)</option>
      </select>
    </div>
  );
}

function SpecializationSelect({ formData, handleChange }) {
  return (
    <div className="mb-4">
      <label
        className="block text-white text-sm font-bold mb-2"
        htmlFor="specialization"
      >
        Specialization
      </label>
      <select
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="specialization"
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
      >
        <option value="">Select Specialization</option>
        <option value="Computer Science">Computer Science (CS)</option>
        <option value="Software Engineering">Software Engineering (SE)</option>
        <option value="Electrical Engineering">
          Electrical Engineering (EE)
        </option>
        <option value="Chemical Engineering">Chemical Engineering (CE)</option>
        <option value="Business Administration">
          Business Administration (BBA)
        </option>
        <option value="Art & Design">Art & Design (BDE)</option>
      </select>
    </div>
  );
}

function QualificationsSelect({ formData, handleChange }) {
  return (
    <div className="mb-4">
      <label
        className="block text-white text-sm font-bold mb-2"
        htmlFor="qualifications"
      >
        Qualifications
      </label>
      <select
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="qualifications"
        name="qualifications"
        value={formData.qualifications}
        onChange={handleChange}
      >
        <option value="">Select Qualifications</option>
        <option value="Bachelors">Bachelors</option>
        <option value="Masters">Masters</option>
        <option value="PhD">PhD</option>
      </select>
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    countryCode: "",
    phoneNumber: "",
    department: "",
    specialization: "",
    qualifications: "",
    bio: "",
    timeSlots: [],
    photo: null,
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const resetFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      specialization: "",
      qualifications: "",
      bio: "",
      timeSlots: [],
      photo: null,
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
      console.log("Original value:", value);
      const phoneNumberWithoutCode = value.replace(/^\+92/, "");
      console.log("Extracted digits:", phoneNumberWithoutCode);

      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: phoneNumberWithoutCode,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "timeSlots" ? value.split(",") : value,
      }));
    }
  };

  const handleCountryChange = (country) => {
    if (country && country.country !== formData.countryCode) {
      setFormData((prevData) => ({
        ...prevData,
        countryCode: country.country,

        phoneNumber: `${country.country} ${prevData.phoneNumber}`,
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await axios.post(API_URL, data);

      if (response.data.status === "success") {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          resetFormData();
          navigate("/Login");
        }, 3000);
      } else {
        const errorCode = response.data.errorCode;
        console.log("Error Code:", errorCode);
        console.log("Response Data:", response.data);

        if (errorCode === "EMAIL_ALREADY_REGISTERED") {
          setEmailError("Email is already registered.");
        } else if (errorCode === "PHONE_ALREADY_REGISTERED") {
          setPhoneNumberError("Phone number is already registered.");
        } else {
          setErrorMessage(ERROR_MESSAGE);
          setShowErrorPopup(true);
          setTimeout(() => {
            setShowErrorPopup(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Signup Error:", error);
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
    <div className="flex flex-col items-center h-auto bg-blue-900">
      <div className="block text-white-700 text-center mt-16">
        <img src="fptasset-12x-1@2x.png" alt="Logo" />
        <div
          className="absolute h-80 w-70 opacity-30"
          style={{ marginLeft: "70px", marginTop: "-350px" }}
        >
          <Lottie className="" animationData={loginAnimation} />
        </div>
      </div>
      <div className="bg-white p-4 sm:p-8 rounded shadow-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mt-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
          Sign Up
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                emailError ? "border-red-500" : ""
              }`}
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{email_MESSAGE}</p>
            )}
          </div>
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
              className="block text-white text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="PK"
              value={`${formData.countryCode} ${formData.phoneNumber}`}
              onChange={(value) => {
                const match = value.match(/^\+(\d{1,2})\s?(\d*)$/);
                const countryCode = match ? match[1] : "92";
                const phoneNumber = match ? match[2] : "";

                setFormData((prevData) => ({
                  ...prevData,
                  countryCode,
                  phoneNumber,
                }));
                setPhoneNumberError("");
              }}
              onCountryChange={handleCountryChange}
              inputProps={{
                name: "phoneNumber",
                required: true,
              }}
            />
            {phoneNumberError && (
              <p className="text-red-500 text-sm mt-1">{phone_MESSAGE}</p>
            )}
          </div>
          <RoleSelect formData={formData} handleChange={handleChange} />

          {formData.role === "student" && (
            <DepartmentSelect formData={formData} handleChange={handleChange} />
          )}

          {formData.role === "teacher" && (
            <>
              <SpecializationSelect
                formData={formData}
                handleChange={handleChange}
              />

              <QualificationsSelect
                formData={formData}
                handleChange={handleChange}
              />
              <FormField
                label="Bio"
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
              <FormField
                label="Time Slots (e.g: 8:30 AM, )"
                type="text"
                name="timeSlots"
                value={formData.timeSlots.join(",")}
                onChange={handleChange}
              />
            </>
          )}
          <FormField
            label="Profile Picture"
            type="file"
            name="photo"
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleSignup}
          className="bg-blue-900 hover-bg-blue-500 text-white font-bold py-2 px-4 rounded focus-outline-none focus-shadow-outline mt-4 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
        <center>
          <br />
          <Link to="/Login" className="text-blue-900 mx-4 mt-4 text-center">
            Already have an account?
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

export default SignUp;
