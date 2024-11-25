import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  addNotification,
  markNotificationsAsRead,
  selectNotifications,
} from "./notificationSlice.js";

function Header() {
  const [showUserProfileDropdown, setShowUserProfileDropdown] = useState(false);
  const [showSignoutDropdown, setShowSignoutDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userProfilePhoto, setUserProfilePhoto] = useState("");

  const API_BASE_URL = "http://localhost:4000/api/v1/users";

  const toggleUserProfileDropdown = () => {
    setShowUserProfileDropdown(!showUserProfileDropdown);
    setShowSignoutDropdown(false);
  };

  const toggleSignoutDropdown = () => {
    setShowSignoutDropdown(!showSignoutDropdown);
    setShowUserProfileDropdown(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserProfileDropdown(false);
    setShowSignoutDropdown(false);
  };

  const closeDropdowns = () => {
    setShowUserProfileDropdown(false);
    setShowSignoutDropdown(false);
    setShowNotifications(false);
  };

  const handleMarkAsRead = () => {
    dispatch(markNotificationsAsRead());
  };

  const handleSignout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      setShowLogoutPopup(false);
      navigate("/Login");
    }, 2000);
    window.history.replaceState(null, null, "/");
  };

  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    setUnreadNotificationCount(unreadCount);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdowns();
      }
    };

    if (showUserProfileDropdown || showSignoutDropdown || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserProfileDropdown, showSignoutDropdown, showNotifications]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      axios
        .get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUserProfilePhoto(response.data.data.user.photo);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  return (
    <nav className="bg-blue-900 dark:bg-black">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4 relative">
        <Link to="/HomePage" className="flex items-center">
          <img
            src="fptasset-12x-1@2x.png"
            className="h-12 mr-3"
            alt="Flowbite Logo"
          />
        </Link>
        <div className="flex items-center md:order-2">
          <div className="relative mr-4 text-gray-300">
            <button
              onClick={toggleNotifications}
              className="flex items-center transition duration-300 transform hover:scale-110"
            >
              <span className="sr-only">Open notifications</span>
              <FaBell size={24} />
              {unreadNotificationCount > 0 && (
                <div className="bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs absolute -right-1 -top-1">
                  {unreadNotificationCount}
                </div>
              )}
            </button>
            {showNotifications && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg dark-bg-gray-800 z-50"
                style={{
                  width: "auto",
                  minWidth: "200px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <ul className="divide-y divide-gray-200 dark-text-gray-300">
                  {notifications.length === 0 ? (
                    <li className="py-2 px-4 text-gray-400">
                      No new notifications
                    </li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification._id}
                        className={`py-2 px-4 ${
                          notification.isRead
                            ? "hover:bg-gray-300 dark:hover-bg-gray-700"
                            : "bg-gray-300"
                        } notification-item`}
                        onClick={() => handleMarkAsRead(notification._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="text-sm font-semibold text-black">
                          {notification.type}
                        </div>
                        <div className="text-sm text-black">
                          {notification.message}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="relative text-sm bg-gray-800 rounded-full focus-ring-4 focus-ring-gray-300 dark-focus-ring-gray-600">
            <button
              onClick={toggleUserProfileDropdown}
              className="flex items-center transition duration-300 transform hover:scale-110"
            >
              <span className="sr-only">Open user menu</span>
              <img
                src={userProfilePhoto}
                alt="User Profile"
                className={`bg-gray-300 h-10 w-10 rounded-full ${
                  location.pathname === "/UserProfile" ? "bg-blue-500" : ""
                }`}
              />
            </button>
            {showUserProfileDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg z-20 dark-bg-gray-800"
                style={{ width: "auto", minWidth: "150px" }}
              >
                <ul className="divide-y divide-gray-200 dark:text-gray-300">
                  <li className="py-2 px-4 hover:bg-gray-100 dark-hover-bg-gray-700 rounded">
                    <Link to="/UserProfile" onClick={closeDropdowns}>
                      UserProfile
                    </Link>
                  </li>
                  <li className="py-2 px-4 hover:bg-red-500 rounded">
                    <button onClick={handleSignout}>Signout</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="flex flex-col font-bold md:flex-row md:space-x-8 dark-bg-gray-800 dark-border-gray-700">
            <li>
              <Link
                to="/StudentFolder"
                className={`text-white ${
                  location.pathname === "/StudentFolder"
                    ? "transition-transform transform  text-lg focus:text-[#FF9503] text-white"
                    : ""
                }`}
              >
                Course Material
              </Link>
            </li>
            <li>
              <Link
                to="/LectureReminder"
                className={`text-white ${
                  location.pathname === "/LectureReminder"
                    ? "transition-transform transform  text-lg focus:text-[#FF9503] text-white"
                    : ""
                }`}
              >
                Lecture Reminder
              </Link>
            </li>
            <li>
              <Link
                to="/CampusNews"
                className={`text-white ${
                  location.pathname === "/CampusNews"
                    ? "transition-transform transform text-lg focus:text-[#FF9503] text-white"
                    : ""
                }`}
              >
                Campus News
              </Link>
            </li>
            <li>
              <Link
                to="/Societies"
                className={`text-white ${
                  location.pathname === "/Societies"
                    ? "transition-transform transform  text-lg focus:text-[#FF9503] text-white"
                    : ""
                }`}
              >
                Societies
              </Link>
            </li>
            <li>
              <Link
                to="/BookAppointment"
                className={`text-white ${
                  location.pathname === "/BookAppointment"
                    ? "transition-transform transform text-[#FF9503] text-lg focus:text-[#FF9503] "
                    : "text-[#FF9503]"
                }`}
              >
                Book Appointments
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {showLogoutPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <p className="text-red-600 mb-2 font-bold">
              You have been logged out.
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
