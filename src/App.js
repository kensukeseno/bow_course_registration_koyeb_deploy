import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import DesingLibrary from "./pages/DesignLibrary";
import HomePage from "./pages/HomePage";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import SubmittedForms from "./pages/SubmittedForms";
import ContactPage from "./pages/ContactPage";
import CourseRegistration from "./pages/CourseRegistration";
import CourseManagement from "./pages/CourseManagement";
import CourseDetails from "./pages/CourseDetails";
import StudentListPage from "./pages/StudentListPage";

// Router setup for authenticated navigation
import { AuthProvider } from "./auth/authentication";
import RoleRoute from "./auth/roleRoute";
import ProtectionRoute from "./auth/protectionRoute";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header /> {/* Persistent header on all pages */}
          <div className="px-3 py-3 md:px-[100px] flex-1">
            <Routes>
              <Route path="/">
                <Route index={true} element={<HomePage />} />
                <Route path="/design-library" element={<DesingLibrary />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                {/* Connecting Routes to their appropriate Roles and pages */}
                <Route element={<ProtectionRoute />}>
                  <Route element={<RoleRoute allow={["student"]} />}>
                    <Route
                      path="/student-dashboard"
                      element={<StudentDashboard />}
                    />
                  </Route>
                  <Route
                    path="/course-registration"
                    element={<CourseRegistration />}
                  />

                  <Route
                    path="/course-details/:courseCode"
                    element={<CourseDetails />}
                  />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route element={<RoleRoute allow={["admin"]} />}>
                    <Route
                      path="/admin-dashboard"
                      element={<AdminDashboard />}
                    />
                    <Route
                      path="/course-management"
                      element={<CourseManagement />}
                    />
                    <Route
                      path="/student-list"
                      element={<StudentListPage />}
                    />
                    <Route
                      path="/submitted-forms"
                      element={<SubmittedForms />}
                    />
                  </Route>
                </Route>
                <Route element={<RoleRoute allow={["student", "admin"]} />}>
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<div>404 Not Found</div>} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
