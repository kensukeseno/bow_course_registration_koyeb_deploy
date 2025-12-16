import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const API_URL = '/api';

export default function CourseDetails() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Determine if this is student view based on navigation state
  const isStudentView = location.state?.fromStudent;

  useEffect(() => {
    if (!courseCode) {
      setLoading(false);
      return;
    }

    // Load course data from API
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const courses = await response.json();
          const foundCourse = courses.find(c => c.code === courseCode);
          setCourse(foundCourse);
        } else {
          console.error('Failed to fetch courses:', response.status);
          setCourse(null);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setCourse(null);
      }
    };

    fetchCourseData();

    // Load enrolled students from localStorage (only for admin view)
    if (!isStudentView) {
      const savedEnrollments = localStorage.getItem('courseEnrollments');
      if (savedEnrollments) {
        const enrollments = JSON.parse(savedEnrollments);
        const courseEnrollments = enrollments.filter(enrollment => enrollment.courseCode === courseCode);
        setEnrolledStudents(courseEnrollments);
      }
    }

    setLoading(false);
  }, [courseCode, isStudentView]);

  const handleDeleteCourse = () => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
      // Remove course from localStorage
      const savedCourses = localStorage.getItem('courses');
      if (savedCourses) {
        const courses = JSON.parse(savedCourses);
        const updatedCourses = courses.filter(c => c.code !== courseCode);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
      }
      
      // Navigate back to course management
      navigate('/course-management');
    }
  };

  const handleRemoveCourse = async () => {
    if (window.confirm(`Are you sure you want to remove "${course.name}" from your registered courses?`)) {
      try {
        // Call API to unenroll from course
        const response = await fetch(`${API_URL}/student/unenroll-course`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ courseCode })
        });

        if (response.ok) {

          // Navigate back to student dashboard
          navigate('/student-dashboard');
        } else {

        }
      } catch (error) {
        console.error('Error removing course:', error);

      }
    }
  };

  const handleEditCourse = () => {
    // Navigate to course management with edit mode
    navigate('/course-management', { 
      state: { 
        editCourse: course,
        openModal: true 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="text-center py-8">
          <p className="text-[var(--system-gray)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-bold">Course Not Found</h1>
          <h3 className="text-xs">The requested course could not be found.</h3>
        </div>
        <div className="text-center py-8">
          <button 
            onClick={() => navigate(isStudentView ? '/student-dashboard' : '/course-management')}
            className="btn-primary-fill px-4 py-2"
          >
            {isStudentView ? 'Back to Dashboard' : 'Back to Course Management'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-xl font-bold">Course Details</h1>
        <h3 className="text-xs text-center">
          Review and manage course information.
        </h3>
      </div>

      {/* Course Details Card */}
      <div className="bg-gray-50 rounded-lg p-6">
        {/* Course Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
          <span className="bg-[#bbe2f8] text-[var(--system-blue)] rounded-md px-2 py-1 text-sm">
            {course.code}
          </span>
        </div>

        {/* Course Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Course Code</label>
              <p className="text-sm">{course.code}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Term/Semester</label>
              <p className="text-sm">{course.term}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Instructor</label>
              <p className="text-sm">{course.instructor || 'TBD'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Department</label>
              <p className="text-sm">{course.department || 'Computer Science'}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Start Date</label>
              <p className="text-sm">{course.start}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">End Date</label>
              <p className="text-sm">{course.end}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Credits</label>
              <p className="text-sm">{course.credits || '3'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--system-gray)] mb-1">Status</label>
              <span className={`px-2 py-1 text-xs rounded ${
                course.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {course.status}
              </span>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[var(--system-gray)] mb-2">Prerequisites</label>
          <p className="text-sm">{course.prerequisites || 'None'}</p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-[var(--system-gray)] mb-2">Course Description</label>
          <p className="text-sm text-[var(--system-gray)]">{course.desc || 'No description provided.'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => navigate(isStudentView ? '/student-dashboard' : '/course-management')}
            className="btn-secondary px-4 py-2 text-sm"
          >
            {isStudentView ? '← Back to Dashboard' : '← Back to Course Management'}
          </button>
          
          {isStudentView ? (
            // Student view - only show remove course button
            <div className="flex gap-3">
              <button 
                onClick={handleRemoveCourse}
                className="btn-delete px-4 py-2 text-sm"
              >
                Remove Course
              </button>
            </div>
          ) : (
            // Admin view - show edit and delete buttons
            <div className="flex gap-3">
              <button 
                onClick={handleEditCourse}
                className="btn-primary-outlined text-sm"
              >
                <p className="py-2 px-4">Edit Course</p>
              </button>
              <button 
                onClick={handleDeleteCourse}
                className="btn-delete px-4 py-2 text-sm"
              >
                Delete Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Students Section - Only show for admin view */}
      {!isStudentView && (
        <div>
          <h2 className="font-semibold mb-4">Enrolled Students ({enrolledStudents.length})</h2>
          {enrolledStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--system-gray)] text-sm">No students enrolled in this course.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 border-[1px] border-[var(--system-purple)]">
              <thead className="bg-1 text-white">
                <tr className="text-xs font-medium">
                  <td className="p-3">Student Name</td>
                  <td className="p-3">Student ID</td>
                  <td className="p-3">Email</td>
                  <td className="p-3">Enrollment Date</td>
                  <td className="p-3">Status</td>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((student, index) => (
                  <tr key={student.Id ||student.studentId || `student-${index}`} className="text-xs border-b border-[var(--system-purple)]">
                    <td className="p-3 font-semibold">{student.studentName}</td>
                    <td className="p-3">{student.studentId}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.enrollmentDate}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
