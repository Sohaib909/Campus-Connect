import React, { useState, useEffect } from "react";
import axios from "axios";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const StudentReminders = () => {
  const [userReminders, setUserReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReminder, setEditingReminder] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [editedReminderMsg, setEditedReminderMsg] = useState("");
  const [editedReminderDate, setEditedReminderDate] = useState("");
  const [editedRoomNo, setEditedRoomNo] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const authTokenFromStorage = localStorage.getItem("authToken");
    setAuthToken(authTokenFromStorage);

    const fetchUserReminders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/reminders/user",
          {
            headers: {
              Authorization: `Bearer ${authTokenFromStorage}`,
            },
          }
        );

        if (response.data.status === "success") {
          setUserReminders(response.data.data.reminders);
        } else {
          console.error("Failed to fetch user reminders");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    if (authTokenFromStorage) {
      fetchUserReminders();
    }
  }, [authToken]);

  const handleEdit = (id) => {
    setEditingReminder(id);
    const reminderToEdit = userReminders.find(
      (reminder) => reminder._id === id
    );

    setEditedReminderMsg(reminderToEdit ? reminderToEdit.reminderMsg : "");
    setEditedReminderDate(
      reminderToEdit ? moment(reminderToEdit.remindAt).toDate() : ""
    );
    setEditedRoomNo(reminderToEdit ? reminderToEdit.roomNo : "");
  };

  const handleSaveEdit = async (id, updatedReminder) => {
    try {
      const authTokenFromStorage = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:4000/api/v1/reminders/${id}`,
        updatedReminder,
        {
          headers: {
            Authorization: `Bearer ${authTokenFromStorage}`,
          },
        }
      );

      if (response.data.status === "success") {
        setUserReminders((prevReminders) =>
          prevReminders.map((reminder) =>
            reminder._id === id ? response.data.data.reminder : reminder
          )
        );
        setEditingReminder(null);
        setEditedReminderMsg("");
        setEditedReminderDate("");
        setEditedRoomNo("");
      } else {
        console.error("Failed to save edited reminder");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReminder(null);
  };

  const handleDelete = async (id) => {
    try {
      const authTokenFromStorage = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:4000/api/v1/reminders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authTokenFromStorage}`,
          },
        }
      );

      if (response.data.status === "success") {
        const updatedReminders = await axios.get(
          "http://localhost:4000/api/v1/reminders/user",
          {
            headers: {
              Authorization: `Bearer ${authTokenFromStorage}`,
            },
          }
        );

        if (updatedReminders.data.status === "success") {
          setUserReminders(updatedReminders.data.data.reminders);
        } else {
          console.error("Failed to fetch updated user reminders");
        }
      } else if (
        response.data.status === "fail" &&
        response.data.message.includes("not found")
      ) {
        console.error("Reminder not found:", response.data.message);
      } else {
        console.error("Failed to delete reminder");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Your Reminders
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          <h2 className="text-lg font-bold mb-2">Your Reminders</h2>
        </center>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {userReminders && userReminders.length > 0 ? (
              userReminders.map((reminder) => (
                <div key={reminder._id} className="border rounded p-4 mb-4">
                  {editingReminder === reminder._id ? (
                    <div>
                      <div className="mb-4">
                        <label className="block text-blue font-bold">
                          Room Number:
                        </label>
                        <input
                          type="text"
                          value={editedRoomNo}
                          onChange={(e) => setEditedRoomNo(e.target.value)}
                          className="block w-full p-2 rounded bg-gray-100 text-gray-900"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-blue font-bold">
                          Select Date and Time:
                        </label>
                        <Datetime
                          value={editedReminderDate}
                          onChange={(date) => setEditedReminderDate(date)}
                          isValidDate={(current) =>
                            current.isAfter(Datetime.moment())
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-blue font-bold">
                          Reminder Message:
                        </label>
                        <input
                          type="text"
                          value={editedReminderMsg}
                          onChange={(e) => setEditedReminderMsg(e.target.value)}
                          className="block w-full p-2 rounded bg-gray-100 text-gray-900"
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleSaveEdit(reminder._id, {
                            reminderMsg: editedReminderMsg,
                            remindAt: editedReminderDate,
                            roomNo: editedRoomNo,
                          })
                        }
                        className="bg-blue-500 text-white p-2 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white p-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-black mb-2">
                        - This was your reminder message for:
                      </p>
                      <p className="text-blue-900 mb-2">
                        {reminder.reminderMsg}
                      </p>
                      <p className="text-gray-500">
                        on {moment(reminder.remindAt).format("MMMM D, YYYY")}
                      </p>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleEdit(reminder._id)}
                          className="text-blue-500 hover:underline mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reminder._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-blue-900 text-center">No reminders found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReminders;
