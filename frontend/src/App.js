import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import TeacherHeader from "./Components/TeacherHeader";
import AdminHeader from "./Components/AdminHeader";
import TeacherFooter from "./Components/TeacherFooter";
import SignUp from "./Components/SignUp";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import UserProfile from "./Components/UserProfile";
import HomePage from "./Components/HomePage";
import TeacherHomePage from "./Components/TeacherHomePage";
import { isAuthenticated } from "./auth";
import CourseMaterial from "./Components/CourseMaterial";
import CourseUpload from "./Components/CourseUpload";
import SocietyRegistration from "./Components/SocietyRegistration";
import CampusNews from "./Components/CampusNews";
import BookAppointment from "./Components/BookAppointment";
import LectureReminder from "./Components/LectureReminder";
import AppointmentsPage from "./Components/AppointmentsPage";
import SocietiesPage from "./Components/SocietiesPage";
import SocietyCard from "./Components/SocietyCard";
import SocietyRequests from "./Components/SocietyRequests";
import Societies from "./Components/Societies";
import ManageAppointments from "./Components/ManageAppointments";
import ManageSocieties from "./Components/ManageSocieties";
import ManageRequests from "./Components/ManageRequests";
import ApprovedAppointments from "./Components/ApprovedAppointments";
import StudentAppointments from "./Components/StudentAppointments";
import StudentReminders from "./Components/StudentReminders";
import ApprovedUsers from "./Components/ApprovedUsers";
import ApprovedSocieties from "./Components/ApprovedSocieties";
import Folder from "./Components/Folder";
import SubjectFolder from "./Components/SubjectFolder";
import SubFolder from "./Components/SubFolder";
import StudentSubFolder from "./Components/StudentSubFolder";
import FolderUpload from "./Components/FolderUpload";
import StudentFolder from "./Components/StudentFolder";
import AdminDashboard from "./Components/AdminDashboard";
import StudentForm from "./Components/StudentForm";
import AddStudent from "./Components/AddStudent";
import TeacherForm from "./Components/TeacherForm";
import AddTeacher from "./Components/AddTeacher";
import SocietyForm from "./Components/SocietyForm";
import CreatePost from "./Components/CreatePost";
import Cookies from "js-cookie";

function App() {
  const location = useLocation();
  const isLoginOrSignUpOrResetPassword =
    location.pathname === "/Login" ||
    location.pathname === "/Forgot" ||
    location.pathname === "/UserProfile" ||
    location.pathname.includes("/reset-password/") ||
    location.pathname === "/SignUp";

  const [userRole, setUserRole] = useState(Cookies.get("userRole") || "");

  useEffect(() => {
    const storedUserRole = Cookies.get("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const isStudent = userRole === "student";

  const updateUserRole = (newRole) => {
    setUserRole(newRole);
    Cookies.set("userRole", newRole);
  };

  return (
    <div className="App">
      {!isLoginOrSignUpOrResetPassword &&
        (userRole === "admin" ? (
          <AdminHeader />
        ) : isStudent ? (
          <Header />
        ) : (
          <TeacherHeader />
        ))}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              isStudent ? (
                <HomePage />
              ) : (
                <TeacherHomePage />
              )
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route path="/Login" element={<Login setUserRole={updateUserRole} />} />
        <Route path="/Login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Forgot" element={<ForgotPassword />} />
        <Route path="/HomePage" exact element={<HomePage />} />
        <Route path="/TeacherHomePage" exact element={<TeacherHomePage />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/CourseMaterial" element={<CourseMaterial />} />
        <Route path="/CourseUpload" element={<CourseUpload />} />
        <Route path="/SocietyRegistration" element={<SocietyRegistration />} />
        <Route path="/CampusNews" element={<CampusNews />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/AppointmentsPage" element={<AppointmentsPage />} />
        <Route path="/SocietiesPage" element={<SocietiesPage />} />
        <Route path="/SocietyRequests" element={<SocietyRequests />} />
        <Route path="/Societies" element={<Societies />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/TeacherForm" element={<TeacherForm />} />
        <Route path="/AddTeacher" element={<AddTeacher />} />
        <Route path="/StudentForm" element={<StudentForm />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/SocietyForm" element={<SocietyForm />} />
        <Route path="/ManageAppointments" element={<ManageAppointments />} />
        <Route path="/ManageSocieties" element={<ManageSocieties />} />
        <Route path="/ApprovedSocieties" element={<ApprovedSocieties />} />
        <Route
          path="/societies/:societyId/manage-requests"
          element={<ManageRequests />}
        />
        <Route
          path="/societies/:societyId/all-members"
          element={<ApprovedUsers />}
        />
        <Route path="/ApprovedUsers" element={<ApprovedUsers />} />
        <Route
          path="/ManageAppointments/:appointmentId"
          element={<ManageAppointments />}
        />
        <Route
          path="/ApprovedAppointments"
          element={<ApprovedAppointments />}
        />
        <Route path="/StudentAppointments" element={<StudentAppointments />} />
        <Route path="/LectureReminder" element={<LectureReminder />} />
        <Route path="/StudentReminders" element={<StudentReminders />} />
        <Route path="/Folder" element={<Folder />} />
        <Route path="/FolderUpload" element={<FolderUpload />} />
        <Route
          path="/subject-folder/:folderId/:folderType?"
          element={<SubjectFolder />}
        />
        <Route
          path="/sub-folder/:folderId/:folderType?"
          element={<SubFolder />}
        />
        <Route
          path="/student-sub-folder/:folderId/:folderType?"
          element={<StudentSubFolder />}
        />
        <Route
          path="/course-materials/:folderId/:folderType?"
          element={<CourseMaterial />}
        />
        <Route
          path="/course-upload/:folderId/:folderType?"
          element={<CourseUpload />}
        />
        <Route path="/StudentFolder" element={<StudentFolder />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/course-upload/:folderId" element={<CourseUpload />} />
        <Route path="/course-upload" element={<CourseUpload />} />
        <Route path="/course-materials" element={<CourseMaterial />} />
        <Route path="/folder/:folderId" element={<CourseUpload />} />
        <Route path="/societies/:id" element={<SocietyCard />} />
        <Route path="/post/:postId" element={<SocietyCard />} />
        <Route
          path="/societies/:societyId/create-post"
          element={<CreatePost />}
        />
        <Route
          path="/societies/:societyId/society-requests"
          element={<SocietyRequests />}
        />
      </Routes>
      {!isLoginOrSignUpOrResetPassword &&
        (isStudent ? <Footer /> : <TeacherFooter />)}
    </div>
  );
}

export default App;
