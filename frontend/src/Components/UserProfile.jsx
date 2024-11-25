import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const API_BASE_URL = "http://localhost:4000/api/v1/users";

function FormField({ label, type, name, value, onChange }) {
  return (
    <div className="mb-10">
      <label
        className="block text-blue-900 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={name}
        type={type}
        placeholder={label}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={name === "email"}
      />
    </div>
  );
}

function UserProfileForm() {
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoadingPhoneNumber, setIsLoadingPhoneNumber] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleUpdate = () => {
    setIsLoadingPhoneNumber(true);
    setIsLoadingPassword(true);
    setIsLoadingPhoto(true);

    const authToken = localStorage.getItem("authToken");

    axios
      .patch(
        `${API_BASE_URL}/updatePhoneNumber`,
        { phoneNumber: newPhoneNumber },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        setMessage({
          type: "success",
          content: "Phone number updated successfully",
        });
        setIsLoadingPhoneNumber(false);
      })
      .catch(() => {
        setMessage({ type: "error", content: "Error updating phone number" });
        setIsLoadingPhoneNumber(false);
      });

    axios
      .patch(
        `${API_BASE_URL}/updatePassword`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        setMessage({
          type: "success",
          content: "Password updated successfully",
        });
        setIsLoadingPassword(false);
      })
      .catch(() => {
        setMessage({ type: "error", content: "Error updating password" });
        setIsLoadingPassword(false);
      });

    const formData = new FormData();
    formData.append("photo", photo);

    axios
      .patch(`${API_BASE_URL}/updateProfilePhoto`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setMessage({
          type: "success",
          content: "Profile photo updated successfully",
        });
        setIsLoadingPhoto(false);
      })
      .catch(() => {
        setMessage({ type: "error", content: "Error updating profile photo" });
        setIsLoadingPhoto(false);
      });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="bg-white border rounded p-6 shadow-md mb-8 flex-grow">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
        User Profile
      </h2>

      {message.type === "success" && (
        <p className="text-green-500 text-center">{message.content}</p>
      )}

      {message.type === "error" && (
        <p className="text-red-500 text-center">{message.content}</p>
      )}

      <FormField
        label="New Phone Number"
        type="text"
        name="newPhoneNumber"
        value={newPhoneNumber}
        onChange={(e) => setNewPhoneNumber(e.target.value)}
      />

      <FormField
        label="New Password"
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <FormField
        label="Update Profile Photo"
        type="file"
        name="photo"
        onChange={handlePhotoChange}
      />

      <button
        className="bg-blue-900 text-white font-bold py-2 px-4 rounded w-full mb-4"
        onClick={handleUpdate}
        disabled={isLoadingPhoneNumber || isLoadingPassword || isLoadingPhoto}
      >
        {isLoadingPhoneNumber || isLoadingPassword || isLoadingPhoto
          ? "Updating..."
          : "Update"}
      </button>
    </div>
  );
}

function JoinedSocietiesForm() {
  const [joinedSocieties, setJoinedSocieties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJoinedSocieties = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:4000/api/v1/societies/joined-societies",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setJoinedSocieties(response.data.data.joinedSocieties);
      } catch (error) {
        console.error("Error fetching joined societies:", error);
      }
    };

    if (localStorage.getItem("authToken")) {
      fetchJoinedSocieties();
    }
  }, []);

  return (
    <div className="bg-white border rounded p-6 shadow-md mb-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
        Joined Societies
      </h2>

      <div className="flex flex-col items-center">
        {joinedSocieties && joinedSocieties.length > 0 ? (
          <table className="w-full mt-4">
            <tbody>
              {joinedSocieties.map((society) => (
                <tr
                  key={society._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <td className="flex items-center">
                    <img
                      src={society.logo}
                      alt={society.name}
                      className="w-12 h-12 rounded-full object-cover mr-2"
                    />
                    {society.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-blue-900 text-center">
            Not joined in any societies.
          </p>
        )}
      </div>
    </div>
  );
}

function UserRemindersForm() {
  const [userReminders, setUserReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserReminders = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:4000/api/v1/reminders/user",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserReminders(response.data.data.reminders);
      } catch (error) {
        console.error("Error fetching user reminders:", error);
      }
    };

    if (localStorage.getItem("authToken")) {
      fetchUserReminders();
    }
  }, []);

  return (
    <div className="bg-white border rounded p-6 shadow-md mb-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">
        My Reminders
      </h2>

      {userReminders && userReminders.length > 0 ? (
        <div>
          {userReminders.map((reminder) => (
            <div
              key={reminder._id}
              className="mb-6 p-4 bg-gray-100 border rounded"
            >
              <p className="text-black mb-2">
                - This was your reminder message for:
              </p>
              <p className="text-blue-900 mb-2">
                {reminder.reminderMsg} Class
              </p>
              <p className="text-gray-500">
                on {moment(reminder.remindAt).format("MMMM D, YYYY")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-blue-900 text-center">No reminders found.</p>
      )}
    </div>
  );
}

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [formToShow, setFormToShow] = useState("userProfileForm");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUserProfile(profileResponse.data.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (localStorage.getItem("authToken")) {
      fetchUserProfile();
    }
  }, []);

  return (
    <div className="bg-blue-900 min-h-screen flex flex-col md:flex-row">
      <div className="bg-white border rounded h-80 p-6 shadow-md mb-8 md:w-1/4 md:mr-4">
        {userProfile && (
          <>
            <img
              src={userProfile.photo ? userProfile.photo : "default-image.jpg"}
              alt=""
              className="object-cover w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="text-blue-900 text-lg font-bold text-center">
              {userProfile.name}
            </p>
            <p className="text-blue-900 mt-1 text-center">{userProfile.email}</p>
            <p className="text-blue-900 mt-1 text-center">
              {userProfile.department}
            </p>
            <p className="text-blue-900 mt-1 text-center">{userProfile.phone}</p>
          </>
        )}
      </div>

      {/* Form Section */}
      <div className="flex-grow">
        <div className="bg-white border rounded p-6 shadow-md mb-8 w-full md:w-3/4">
          {formToShow === "userProfileForm" && <UserProfileForm />}
          {formToShow === "joinedSocietiesForm" && <JoinedSocietiesForm />}
          {formToShow === "userRemindersForm" && <UserRemindersForm />}
        </div>

        {/* Form Buttons */}
        <div className="flex mt-4 justify-center">
          <button
            className={`${
              formToShow === "userProfileForm"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-900"
            } font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline`}
            onClick={() => setFormToShow("userProfileForm")}
          >
            Update Profile
          </button>

          <button
            className={`${
              formToShow === "joinedSocietiesForm"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-900"
            } font-bold py-2 px-4 mx-4 focus:outline-none focus:shadow-outline`}
            onClick={() => setFormToShow("joinedSocietiesForm")}
          >
            My Societies
          </button>

          <button
            className={`${
              formToShow === "userRemindersForm"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-900"
            } font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline`}
            onClick={() => setFormToShow("userRemindersForm")}
          >
            My Reminders
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
