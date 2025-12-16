import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "/api";

export default function CourseManagement() {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Course data state
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [termFilter, setTermFilter] = useState("All Terms/Semesters");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Modal and editing state
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);

  // Form data for adding/editing courses
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    term: "",
    instructor: "",
    start: "",
    end: "",
    desc: "",
    status: "Active",
    department: "Computer Science",
    credits: "3",
    prerequisites: "None",
  });

  // Load courses from MongoDB API on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setFilteredCourses(data);
        } else {
          console.error("Failed to fetch courses");
          setCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle navigation from other pages with edit course data
  useEffect(() => {
    if (location.state?.editCourse && location.state?.openModal) {
      const course = location.state.editCourse;
      setEditingCourse(course);
      setFormData({
        name: course.name || "",
        code: course.code || "",
        term: course.term || "",
        instructor: course.instructor || "",
        start: course.start || "",
        end: course.end || "",
        desc: course.desc || "",
        status: course.status || "Active",
        department: course.department || "Computer Science",
        credits: course.credits || "3",
        prerequisites: course.prerequisites || "None",
      });
      setShowModal(true);
    }
  }, [location.state]);

  // Filter courses based on search term, term filter, and status filter
  useEffect(() => {
    let filtered = courses.filter((course) => {
      // Check if course matches search term (backward compatible with both instructor and professor fields)
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor &&
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.professor &&
          course.professor.toLowerCase().includes(searchTerm.toLowerCase()));

      // Check if course matches term filter
      const matchesTerm =
        termFilter === "All Terms/Semesters" ||
        course.term === termFilter ||
        course.term.includes(termFilter);
      // Check if course matches status filter
      const matchesStatus =
        statusFilter === "All Statuses" || course.status === statusFilter;

      return matchesSearch && matchesTerm && matchesStatus;
    });

    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, termFilter, statusFilter, courses]);

  // Pagination calculations
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Available terms for filtering
  const filterTerms = ["Fall", "Winter", "Spring", "Summer"];

  // Open modal to add a new course
  const handleAddNewCourse = () => {
    setEditingCourse(null);
    setFormData({
      name: "",
      code: "",
      term: "",
      instructor: "",
      start: "",
      end: "",
      desc: "",
      status: "Active",
      department: "Software Development",
      credits: "3",
      prerequisites: "None",
    });
    setShowModal(true);
  };

  // Navigate to course details page
  const handleViewCourse = (course) => {
    navigate(`/course-details/${course.code}`);
  };

  // Open modal to edit an existing course
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || "",
      code: course.code || "",
      term: course.term || "",
      instructor: course.instructor || "",
      start: course.start || "",
      end: course.end || "",
      desc: course.desc || "",
      status: course.status || "Active",
      department: course.department || "Software Development",
      credits: course.credits || "3",
      prerequisites: course.prerequisites || "None",
    });
    setShowModal(true);
  };

  // Delete a course with confirmation
  const handleDeleteCourse = async (courseCode) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This will also remove it from all student registrations."
      )
    ) {
      try {
        const response = await fetch(`${API_URL}/admin/courses/${courseCode}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          // Update local state
          const updatedCourses = courses.filter(
            (course) => course.code !== courseCode
          );
          setCourses(updatedCourses);

          // Get deleted course info for notification
          const deletedCourse = courses.find((c) => c.code === courseCode);

          // Dispatch notification event
          window.dispatchEvent(
            new CustomEvent("courseDeleted", {
              detail: {
                courseName: deletedCourse?.name || courseCode,
                courseCode,
                forceRefresh: true,
              },
            })
          );

          // Trigger refresh on admin dashboard
          window.dispatchEvent(new CustomEvent("courseRefresh"));

        } else {
          await response.json();

        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // Handle form submission for adding/editing courses
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingCourse) {
        // Update existing course
        response = await fetch(
          `${API_URL}/admin/courses/${editingCourse.code}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Create new course
        response = await fetch(`${API_URL}/admin/courses`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const savedCourse = await response.json();

        // Update local state
        let updatedCourses;
        if (editingCourse) {
          updatedCourses = courses.map((course) =>
            course.code === editingCourse.code ? savedCourse : course
          );
        } else {
          updatedCourses = [...courses, savedCourse];
        }

        setCourses(updatedCourses);

        // Dispatch notification event
        if (editingCourse) {
          window.dispatchEvent(
            new CustomEvent("courseEdited", {
              detail: { courseName: formData.name, courseCode: formData.code },
            })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("courseAdded", {
              detail: { courseName: formData.name, courseCode: formData.code },
            })
          );
        }

        // Trigger refresh on admin dashboard
        window.dispatchEvent(new CustomEvent("courseRefresh"));

        setShowModal(false);
        
      } else {
        await response.json();
        
      }
    } catch (error) {
      console.error("Error submitting course:", error);

    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-xl font-bold">Course Management</h1>
        <h3 className="text-xs">
          Manage and organize course offerings for students.
        </h3>
      </div>

      {/* Add New Course Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAddNewCourse}
          className="btn-primary-fill px-6 py-2 text-sm"
        >
          + Add New Course
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by Course Name, Code, or Instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)] focus:border-transparent"
          />
        </div>
        {/* Term Filter */}
        <select
          value={termFilter}
          onChange={(e) => setTermFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
        >
          <option>All Terms/Semesters</option>
          {filterTerms.map((term) => (
            <option key={term} value={term}>
              {term}
            </option>
          ))}
        </select>
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Course List Table */}
      <div>
        <h2 className="font-semibold mb-4">Course List</h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-[var(--system-gray)] text-sm">
              Loading courses...
            </p>
          </div>
        ) : currentCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--system-gray)] text-sm">
              No courses found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full divide-y divide-gray-200 border-[1px] border-[var(--system-purple)]">
              <thead className="bg-1 text-white">
                <tr className="text-xs font-medium">
                  <td className="p-3">Course Name</td>
                  <td className="p-3">Course Code</td>
                  <td className="p-3">Term</td>
                  <td className="p-3">Instructor</td>
                  <td className="p-3">Start Date</td>
                  <td className="p-3">End Date</td>
                  <td className="p-3">Status</td>
                  <td className="p-3">Actions</td>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course, index) => (
                  <tr
                    key={course.code}
                    className="text-xs border-b border-[var(--system-purple)]"
                  >
                    <td className="p-3 font-semibold">{course.name}</td>
                    <td className="p-3">{course.code}</td>
                    <td className="p-3">{course.term}</td>
                    <td className="p-3">{course.instructor || "TBD"}</td>
                    <td className="p-3">{course.start}</td>
                    <td className="p-3">{course.end}</td>
                    <td className="p-3">
                      {/* Status Badge */}
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          course.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewCourse(course)}
                          className="btn-primary-outlined text-xs"
                        >
                          <p className="py-1 px-2">View</p>
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="btn-secondary px-2 py-1 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.code)}
                          className="btn-delete px-2 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--system-gray)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold mb-4">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h3>
              {/* Course Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Basic Course Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                </div>

                {/* Term and Instructor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Term/Semester *
                    </label>
                    <select
                      name="term"
                      value={formData.term}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    >
                      <option value="">Select Term</option>
                      <option value="Fall">Fall</option>
                      <option value="Winter">Winter</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                </div>

                {/* Course Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Start Date *
                    </label>
                    <input
                      type="text"
                      name="start"
                      value={formData.start}
                      onChange={handleInputChange}
                      placeholder="e.g., September 5, 2023"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      End Date *
                    </label>
                    <input
                      type="text"
                      name="end"
                      value={formData.end}
                      onChange={handleInputChange}
                      placeholder="e.g., December 15, 2023"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                </div>

                {/* Department and Credits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Credits
                    </label>
                    <input
                      type="text"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    />
                  </div>
                </div>

                {/* Course Status */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Prerequisites */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Prerequisites
                  </label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="e.g., PROG-101, WEB-102"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                  />
                </div>

                {/* Course Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Course Description
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-fill py-2 px-4 text-sm"
                  >
                    {editingCourse ? "Update Course" : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
