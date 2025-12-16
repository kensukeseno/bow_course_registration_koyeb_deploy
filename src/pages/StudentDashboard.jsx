//Import React and necessary hooks and components
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authentication";

const API_URL = '/api';

// this is the Student Dashboard component
// it displays the student's name, registered courses, term selection, and notifications
export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  // const [studentName] = useState("John Doe");
  const [selectedTerm, setSelectedTerm] = useState("Fall");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  // this state holds notifications fetched from the API
  const [notifications, setNotifications] = useState([]);

  // this will fetch notifications from the API when the component mounts, it will set the notifications state
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/student/notifications`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const apiNotifications = await response.json();
          console.log('API Response - Notifications:', apiNotifications);
          setNotifications(apiNotifications);
        } else {
          console.error('Failed to fetch notifications:', response.status, response.statusText);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []); // Run once on component mount

  // this will fetch enrolled courses from the API when the component mounts or selectedTerm changes
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/student/enrolled-courses`, {
          method: 'GET',
          credentials: 'include', // Include auth cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const allRegisteredCourses = await response.json();
          console.log('API Response - All registered courses:', allRegisteredCourses);
          
          // filter by selected term (same logic as before)
          const coursesForTerm = allRegisteredCourses.filter(
            course => course.term && course.term.toLowerCase().includes(selectedTerm.toLowerCase())
          );
          console.log('Filtered courses for term', selectedTerm, ':', coursesForTerm);
          setEnrolledCourses(coursesForTerm);
        } else {
          console.error('Failed to fetch courses:', response.status, response.statusText);
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setEnrolledCourses([]); // this is important to clear on error, it prevents stale data from being shown
      }
    };

    fetchEnrolledCourses();
  }, [selectedTerm]);

  // Listen for course added event to show notification
  useEffect(() => {
    const handleCourseAdded = (e) => {
      if (e.detail && e.detail.courseName) {
        setNotifications((prev) => [
          {
            icon: "🔔",
            title: `You registered for ${e.detail.courseName}`,
            date: new Date().toLocaleDateString(),
          },
          ...prev,
        ]);
      }
    };
    window.addEventListener('courseAdded', handleCourseAdded);
    return () => window.removeEventListener('courseAdded', handleCourseAdded);
  }, []);

  // Handle navigation to course details page, passing the course code as state
  const handleViewDetails = (courseCode) => {
    navigate(`/course-details/${courseCode}`, { state: { fromStudent: true } });
  };
  // main container with vertical layout and spacing. it includes sections for welcome message, term selection, registered courses, class schedule, and notifications.*Note: Notifications needs a route to Contact page, or we can create a separate Message page.
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">Welcome, {currentUser.firstName + " " + currentUser.lastName}!</h1>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Select Term</h3>
        <div className="flex gap-3">
          {["Fall", "Winter", "Spring", "Summer"].map(
            (term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`px-4 py-2 text-sm rounded-md ${
                  selectedTerm === term
                    ? "bg-1 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Your Registered Courses</h2>
          <div className="flex gap-2">
            <Link
              to="/course-registration"
              className="btn-primary-fill py-2 px-4 text-sm"
            >
              Add Course
            </Link>
            <Link
              to="/profile"
              className="btn-primary-fill py-2 px-4 text-sm"
            >
              View Profile
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Current Courses</h3>
          {enrolledCourses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No courses registered for {selectedTerm}.
            </p>
          ) : (
            <table className="min-w-full border-[1px] border-[var(--system-purple)]">
              <thead className="bg-1 text-white">
                <tr className="text-xs font-medium">
                  <td className="p-3">Code</td>
                  <td className="p-3">Course Name</td>
                  <td className="p-3">Instructor</td>
                  <td className="p-3">Term</td>
                  <td className="p-3">Status</td>
                  <td className="p-3">Actions</td>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((course, index) => (
                  <tr
                    key={course.id || course.code || `course-${index}`}
                    className="text-xs border-b border-[var(--system-purple)]"
                  >
                    <td className="p-3 font-semibold">{course.code}</td>
                    <td className="p-3">{course.name}</td>
                    <td className="p-3">{course.instructor}</td>
                    <td className="p-3">{course.term}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {course.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleViewDetails(course.code)}
                        className="btn-primary-outlined text-xs"
                      >
                        <p className="py-1 px-3">View Details</p>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-6 flex items-center gap-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
        <div>
          <h3 className="font-bold mb-1">Class Schedule</h3>
          <p className="text-sm text-[var(--system-gray)]">
            View your upcoming classes in the calendar format.
          </p>
        </div>
      </div>
      {/* Notifications */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold">Notifications</h2>
          {/* Blue circle badge showing number of notifications */}
          <span className="bg-[var(--system-blue)] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {notifications.length}
          </span>
        </div>
        <div className="border-[1px] border-[var(--system-purple)] rounded-md">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id || `notification-${index}`}
                className={`flex items-start gap-3 p-4 ${
                  index !== notifications.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <span className="text-xl">{notification.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-[var(--system-gray)] mt-1">
                    {notification.date}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
