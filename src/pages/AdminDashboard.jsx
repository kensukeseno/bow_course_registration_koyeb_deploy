import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authentication";

const API_URL = '/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState("Fall");
  const [termCourses, setTermCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses from MongoDB API
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const courses = await response.json();
          
          // Filter courses by selected term using partial matching
          const filteredCourses = courses.filter(course => 
            course.term && course.term.toLowerCase().includes(selectedTerm.toLowerCase())
          );
          setTermCourses(filteredCourses);
        } else {
          console.error('Failed to fetch courses');
          setTermCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setTermCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [selectedTerm]);

  // Admin notifications state (load from localStorage for persistence)
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_notifications');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore parse errors
    }
    // Start with empty notifications instead of mock data
    return [];
  });

  // Persist notifications when they change
  useEffect(() => {
    try {
      localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    } catch (e) {
      // ignore storage errors
    }
  }, [notifications]);

  // Listen for course management events
  useEffect(() => {
    const handleCourseAdded = (e) => {
      if (e.detail && e.detail.courseName) {
        const newNotification = {
          icon: "📚",
          title: `New course added: ${e.detail.courseName}`,
          date: new Date().toLocaleDateString(),
          type: "course_added"
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    };

    const handleCourseEdited = (e) => {
      if (e.detail && e.detail.courseName) {
        const newNotification = {
          icon: "✏️",
          title: `Course updated: ${e.detail.courseName}`,
          date: new Date().toLocaleDateString(),
          type: "course_edited"
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    };

    const handleCourseDeleted = (e) => {
      if (e.detail && e.detail.courseName) {
        const newNotification = {
          icon: "🗑️",
          title: `Course deleted: ${e.detail.courseName}`,
          date: new Date().toLocaleDateString(),
          type: "course_deleted"
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    };

    const handleCourseRefresh = () => {
      // Reload courses when this event is triggered
      loadCoursesDirectly();
    };

    const loadCoursesDirectly = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const courses = await response.json();
          const filteredCourses = courses.filter(course => 
            course.term && course.term.toLowerCase().includes(selectedTerm.toLowerCase())
          );
          setTermCourses(filteredCourses);
        }
      } catch (error) {
        console.error('Error refreshing courses:', error);
      }
    };

    // Listen for custom events
    window.addEventListener('courseAdded', handleCourseAdded);
    window.addEventListener('courseEdited', handleCourseEdited);
    window.addEventListener('courseDeleted', handleCourseDeleted);
    window.addEventListener('courseRefresh', handleCourseRefresh);

    return () => {
      window.removeEventListener('courseAdded', handleCourseAdded);
      window.removeEventListener('courseEdited', handleCourseEdited);
      window.removeEventListener('courseDeleted', handleCourseDeleted);
      window.removeEventListener('courseRefresh', handleCourseRefresh);
    };
  }, [selectedTerm]);

  // Handle navigation to course details page
  const handleViewCourseDetails = (courseCode) => {
    navigate(`/course-details/${courseCode}`);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {currentUser.firstName + " " + currentUser.lastName}!</h1>
      </div>

      {/* Quick Actions Section*/}
      <div>
        <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/course-management"
            className="flex flex-col items-center p-6 border-[1px] border-[var(--system-purple)] rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-1 rounded-md flex items-center justify-center mb-3">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Manage Courses</h3>
            <p className="text-xs text-[var(--system-gray)] text-center">
              Search, add, edit, delete courses
            </p>
          </Link>

          <Link
            to="/student-list"
            className="flex flex-col items-center p-6 border-[1px] border-[var(--system-purple)] rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-1 rounded-md flex items-center justify-center mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">View Students</h3>
            <p className="text-xs text-[var(--system-gray)] text-center">
              See list of registered students
            </p>
          </Link>

          <Link
            to="/submitted-forms"
            className="flex flex-col items-center p-6 border-[1px] border-[var(--system-purple)] rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-1 rounded-md flex items-center justify-center mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">View Submitted Forms</h3>
            <p className="text-xs text-[var(--system-gray)] text-center">
              Read submitted core and electives
            </p>
          </Link>

          <Link
            to="/profile"
            className="flex flex-col items-center p-6 border-[1px] border-[var(--system-purple)] rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-1 rounded-md flex items-center justify-center mb-3">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Profile</h3>
            <p className="text-xs text-[var(--system-gray)] text-center">
              View and update info
            </p>
          </Link>
        </div>
      </div>

      {/* Term Selection */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Select Term</h3>
        <div className="flex flex-wrap gap-3">
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

      {/* Course Management Section - showing courses for selected term */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-bold">Courses for {selectedTerm}</h2>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Available Courses</h3>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading courses...</p>
          ) : termCourses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No courses available for {selectedTerm}.
            </p>
          ) : (
            <table className="min-w-full border-[1px] border-[var(--system-purple)]">
              <thead className="bg-1 text-white">
                <tr className="text-xs font-medium">
                  <td className="p-3">Course Code</td>
                  <td className="p-3">Course Name</td>
                  <td className="p-3">Instructor</td>
                  <td className="p-3">Term</td>
                  <td className="p-3">Actions</td>
                </tr>
              </thead>
              <tbody>
                {termCourses.map((course, index) => (
                  <tr
                    key={course.id || course.code || `course-${index}`}
                    className="text-xs border-b border-[var(--system-purple)] hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3">{course.code}</td>
                    <td className="p-3">{course.name}</td>
                    <td className="p-3">{course.instructor || 'TBD'}</td>
                    <td className="p-3">{course.term}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleViewCourseDetails(course.code)}
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

      {/* Notifications */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold">Notifications</h2>
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
