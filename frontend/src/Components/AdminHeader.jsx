import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

function AdminHeader() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [clickedNotifications, setClickedNotifications] = useState([]);
  const [viewingUnseen, setViewingUnseen] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setDropdownOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const handleSignout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      setShowLogoutPopup(false);
      navigate("/Login");
    }, 2000);
    window.history.replaceState(null, null, "/");
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        "http://localhost:4000/api/v1/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        const sortedNotifications = response.data.data.notifications.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    if (!clickedNotifications.includes(notificationId)) {
      try {
        const token = localStorage.getItem("authToken");

        await axios.patch(
          `http://localhost:4000/api/v1/notifications/markAsRead`,
          { notificationIds: [notificationId] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClickedNotifications([...clickedNotifications, notificationId]);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://localhost:4000/api/v1/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedNotifications = notifications.filter(
        (n) => n._id !== notificationId
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const moveUnseenToSeen = async () => {
    const unseenIds = notifications
      .filter((n) => !clickedNotifications.includes(n._id))
      .map((n) => n._id);

    try {
      const token = localStorage.getItem("authToken");

      await axios.patch(
        `http://localhost:4000/api/v1/notifications/markAsRead`,
        { notificationIds: unseenIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedClickedNotifications = [
        ...clickedNotifications,
        ...unseenIds,
      ];
      setClickedNotifications(updatedClickedNotifications);
    } catch (error) {
      console.error("Error moving unseen notifications to seen:", error);
    }
  };

  const renderNotificationItem = (notification) => {
    const isUnread = !clickedNotifications.includes(notification._id);

    return (
      <li
        key={notification._id}
        className={`py-2 px-4 ${
          isUnread ? "bg-gray-300" : "hover:bg-gray-300 dark-hover:bg-gray-700"
        } notification-item`}
        onClick={() => handleNotificationClick(notification)}
        style={{ cursor: "pointer" }}
      >
        <div
          className={`text-sm font-semibold ${
            isUnread ? "font-bold" : ""
          } text-black`}
        >
          {notification.type}
        </div>
        <div className="text-sm text-black">{notification.message}</div>
      </li>
    );
  };

  const handleNotificationClick = async (notification) => {
    if (viewingUnseen) {
      markNotificationAsRead(notification._id);
      navigate("/ManageSocieties");
    } else {
      deleteNotification(notification._id);
    }
  };
  const unseenNotifications = notifications.filter(
    (n) => !clickedNotifications.includes(n._id) && !n.seen
  );

  const seenNotifications = notifications.filter(
    (n) => clickedNotifications.includes(n._id) || n.seen
  );

  const renderUnseenNotifications = (notifications) => {
    return (
      <ul className="divide-y divide-gray-200 dark-text-gray-300">
        {notifications.length === 0 ? (
          <li className="py-2 px-4 text-gray-400">No new notifications</li>
        ) : (
          notifications.map((notification) =>
            renderNotificationItem(notification)
          )
        )}
      </ul>
    );
  };

  const renderSeenNotifications = (notifications) => {
    return (
      <ul className="divide-y divide-gray-200 dark-text-gray-300">
        {notifications.length === 0 ? (
          <li className="py-2 px-4 text-gray-400">No seen notifications</li>
        ) : (
          notifications.map((notification) => (
            <li
              key={notification._id}
              className={`relative py-2 px-4 hover-bg-gray-300 dark-hover-bg-gray-700 notification-item`}
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`text-sm font-semibold ${
                  notification.seen ? "" : "font-bold"
                } text-black`}
              >
                {notification.type}
              </div>
              <div className="text-sm text-black">{notification.message}</div>
              <button
                className={`delete-button ${
                  notification.seen ? "red-delete-button" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification._id);
                }}
                style={{
                  backgroundColor: notification.seen ? "#ff0000" : "",
                  color: notification.seen ? "#fff" : "red",
                  border: "none",
                  borderRadius: "2px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    );
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (!dropdownRef.current || !dropdownRef.current.contains(event.target)) {
      closeDropdown();
      closeNotifications();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-900 dark-bg-black">
      <style>
        {`
          /* width */
          ::-webkit-scrollbar {
            width: 10px;
          }
          /* Track */
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          /* Handle */
          ::-webkit-scrollbar-thumb {
            background: #888;
          }
          /* Handle on hover */
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>

      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4 relative">
        <Link to="/AdminDashboard" className="flex items-center">
          <img
            src="fptasset-12x-1@2x.png"
            className="h-12 mr-3"
            alt="Flowbite Logo"
          />
        </Link>
        <div className="flex items-center md:order-2">
          <div className="relative mr-4 text-gray-300">
            <button onClick={toggleNotifications} className="flex items-center">
              <span className="sr-only">Open notifications</span>
              <FaBell size={24} />
              {unseenNotifications.length > 0 && (
                <div className="bg-red-600 rounded-full h-3 w-3 absolute -right-1 -top-1" />
              )}
            </button>
            {showNotifications && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg z-30 dark-bg-gray-800 z-10"
                style={{
                  width: "auto",
                  minWidth: "200px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <div className="flex justify-center text-lg mt-1">
                  <span
                    className={`px-4 py-2 cursor-pointer ${
                      viewingUnseen
                        ? "text-blue-900 font-bold"
                        : "text-gray-300 dark-text-gray-700"
                    }`}
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => setViewingUnseen(true)}
                  >
                    Unseen
                  </span>
                  <span
                    className={`px-4 py-2 cursor-pointer ${
                      !viewingUnseen
                        ? "text-blue-900 font-bold"
                        : "text-gray-300 dark-text-gray-700"
                    }`}
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => setViewingUnseen(false)}
                  >
                    Seen
                  </span>
                </div>
                {viewingUnseen
                  ? renderUnseenNotifications(unseenNotifications)
                  : renderSeenNotifications(seenNotifications)}
                {viewingUnseen && unseenNotifications.length > 0 && (
                  <div className="flex justify-center text-blue-900 p-2 cursor-pointer">
                    <span
                      onClick={moveUnseenToSeen}
                      style={{ fontSize: "0.85rem" }}
                    >
                      Mark All as Seen
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative text-sm bg-gray-800 rounded-full focus-ring-4 focus-ring-gray-300 dark-focus-ring-gray-600">
            <button onClick={toggleDropdown} className="flex items-center">
              <span className="sr-only">Open user menu</span>
              <CgProfile
                size={60}
                className="bg-gray-300 h-10 w-10 rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg z-20 dark-bg-gray-800"
                style={{ width: "auto", minWidth: "150px" }}
              >
                <ul className="divide-y divide-gray-200 dark:text-gray-300">
                  <li className="py-2 px-4 hover:bg-gray-100 dark:hover-bg-gray-700 rounded">
                    <Link to="/UserProfile" onClick={closeDropdown}>
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
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover-bg-gray-100 focus-outline-none focus-ring-2 focus-ring-gray-200 dark-text-gray-400 dark-hover-bg-gray-700 dark-focus-ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="flex flex-col font-bold md:flex-row md:space-x-8 dark-bg-gray-800 dark-border-gray-700">
            <Link to="/FolderUpload" className="text-white">
              Course Material
            </Link>
            {/* <Link to="/CourseUpload" className="text-white">
              Course Material
            </Link> */}
            <Link to="/CampusNews" className="text-white">
              Campus News
            </Link>
            <Link to="/SocietiesPage" className="text-white">
              Societies
            </Link>
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

export default AdminHeader;
