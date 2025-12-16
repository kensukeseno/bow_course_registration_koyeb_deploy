import React, { useState, useEffect, useMemo } from 'react';

const API_URL = '/api';

function CourseRegistration() {
  const [selectedTerm, setSelectedTerm] = useState('Fall');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // store all courses from API

  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // available terms - simple season options without year limitations
  const terms = ['All Terms', 'Fall', 'Winter', 'Spring', 'Summer'];


  // this is the new API version, fetch courses from backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/api/courses', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const courses = await response.json();
          console.log('API Response - All courses:', courses);
          
          // only show Active courses for registration
          const activeCourses = courses.filter(course => course.status === 'Active');
          console.log('Active courses for registration:', activeCourses);
          setAllCourses(activeCourses);
        } else {
          console.error('Failed to fetch courses:', response.status, response.statusText);
          setAllCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setAllCourses([]);
      }
    };

    // load courses initially
    loadCourses();
  }, []);

  // load registered courses from API
  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        console.log('Loading registered courses from API...');
        
        const response = await fetch('/api/student/enrolled-courses', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const enrolledCourses = await response.json();
          console.log('API Response - Enrolled courses:', enrolledCourses);
          setRegisteredCourses(enrolledCourses);
        } else {
          console.error('Failed to load registered courses:', response.status);
          setRegisteredCourses([]);
        }
      } catch (error) {
        console.error('Error loading registered courses:', error);
        setRegisteredCourses([]);
      }
    };

    fetchRegisteredCourses();
  }, []);
  // useEffect(() => {
  //   const handleRegisteredCoursesChange = (e) => {
  //     // Only update if the event is from external source (not our own saves)
  //     if (e.type === 'storage' || (e.detail && e.detail.key === 'registeredCourses')) {
  //       const savedRegistered = localStorage.getItem('registeredCourses');
  //       if (savedRegistered) {
  //         const parsed = JSON.parse(savedRegistered);
  //         // Only update if data is different to avoid infinite loop
  //         setRegisteredCourses(prev => {
  //           if (JSON.stringify(prev) !== savedRegistered) {
  //             return parsed;
  //           }
  //           return prev;
  //         });
  //       }
  //     }
  //   };
  //
  //   window.addEventListener('storage', handleRegisteredCoursesChange);
  //   window.addEventListener('localStorageChange', handleRegisteredCoursesChange);
  //
  //   return () => {
  //     window.removeEventListener('storage', handleRegisteredCoursesChange);
  //     window.removeEventListener('localStorageChange', handleRegisteredCoursesChange);
  //   };
  // }, []);

  // filter courses based on selected term
  // this updates whenever the term changes or new courses are added by admin
  useEffect(() => {
    const filtered = allCourses.filter((course) => {
      // more flexible term matching - includes partial matches
      if (selectedTerm === 'All Terms') {
        return true; // show all courses if "All Terms" is selected
      }
      
      // extract the season from selected term (e.g., "Fall" from "Fall 2025")
      const selectedSeason = selectedTerm.split(' ')[0];
      
      // check if course term includes the selected season
      return course.term && course.term.toLowerCase().includes(selectedSeason.toLowerCase());
    });
    setAvailableCourses(filtered);
  }, [selectedTerm, allCourses]);

  
  // useEffect(() => {
  //   localStorage.setItem(
  //     'registeredCourses',
  //     JSON.stringify(registeredCourses)
  //   );
  //
  //   // Other components listen to direct localStorage changes
  // }, [registeredCourses]);

  // filter available courses by search term
  const filteredAvailableCourses = availableCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // merge registered courses with latest catalog details for display
  const catalogByCode = useMemo(() => {
    return allCourses.reduce((acc, c) => {
      acc[c.code] = c;
      return acc;
    }, {});
  }, [allCourses]);

  const displayedRegisteredCourses = useMemo(() => {
    return registeredCourses.map(reg => ({
      ...reg,
      ...(catalogByCode[reg.code] || {})
    }));
  }, [registeredCourses, catalogByCode]);

  // this is the new API version
  const addCourse = async (course) => {
    // check if course is already registered
    if (registeredCourses.find((regCourse) => regCourse.code === course.code)) {
      
      return;
    }

    try {
      console.log('Registering for course:', course.code);
      
      // this function calls the API to register for the course
      const response = await fetch('/api/student/register-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ courseCode: course.code })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful:', result);

        // refresh enrolled courses from API to get latest data
        const enrolledResponse = await fetch('/api/student/enrolled-courses', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (enrolledResponse.ok) {
          const enrolledCourses = await enrolledResponse.json();
          console.log('Refreshed enrolled courses:', enrolledCourses);
          setRegisteredCourses(enrolledCourses);
        }

        // Previously: Update local state manually (replaced with API refresh)
        // const newRegisteredCourse = {
        //   code: course.code,
        //   name: course.name,
        //   instructor: course.instructor || 'TBD',
        //   term: course.term,
        //   status: 'In Progress',
        // };
        // const updatedRegisteredCourses = [...registeredCourses, newRegisteredCourse];
        // setRegisteredCourses(updatedRegisteredCourses);

        // this is a simple alert, can be replaced with a better notification system

      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        
      }
    } catch (error) {
      console.error('Error registering for course:', error);
      
    }
  };

  // remove course from registered courses
  const removeCourse = async (courseCode) => {
    try {
      console.log('Unenrolling from course:', courseCode);
      
      // call API to unenroll from course
      const response = await fetch(`${API_URL}/student/unenroll-course`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseCode })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Unenrollment successful:', result);

        // refresh enrolled courses from API to get latest data
        const enrolledResponse = await fetch(`${API_URL}/student/enrolled-courses`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        // this is a simple alert.
        if (enrolledResponse.ok) {
          const enrolledCourses = await enrolledResponse.json();
          console.log('Refreshed enrolled courses after unenrollment:', enrolledCourses);
          setRegisteredCourses(enrolledCourses);
        }
      } else {
        console.error('Failed to unenroll from course:', response.status);
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-xl font-bold">Course Registration</h1>
        <h3 className="text-xs">
          Manage your course selections for the upcoming term.
        </h3>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Select Term</h2>
          <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {terms.map((term) => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">Available Courses</h2>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search by Course Name or Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)] focus:border-transparent"
            />
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          Courses available for the selected term.
        </p>

        {/* Available Courses List */}
        <div className="space-y-3">
          {filteredAvailableCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No courses available for the selected term.
            </p>
          ) : (
            filteredAvailableCourses.map((course) => (
              <div key={course.code} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">{course.code.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.code}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-3 md:mt-0">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{course.term}</span> |{' '}
                    {course.start} - {course.end}
                  </div>
                  <button onClick={() => addCourse(course)} className="btn-primary-fill px-4 py-2 text-sm">Add Course</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="font-semibold">Registered Courses</h2>
        <p className="text-gray-600 text-sm">
          Courses you have registered for this term.
        </p>

        {/* Current Courses Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <h3 className="font-semibold p-4 bg-gray-50 border-b border-gray-200">
            Current Courses
          </h3>

          {displayedRegisteredCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No courses registered for this term.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 border-[1px] border-[var(--system-purple)] mt-2">
              <thead className="bg-1 text-white">
                <tr className="text-xs font-medium">
                  <td className="p-2">Code</td>
                  <td className="p-2">Course Name</td>
                  <td className="p-2">Instructor</td>
                  <td className="p-2">Term</td>
                  <td className="p-2">Status</td>
                  <td className="p-2">Actions</td>
                </tr>
              </thead>
              <tbody>
                {displayedRegisteredCourses.map((course) => (
                  <tr key={course.code} className="text-xs border-b border-[var(--system-purple)]">
                    <td className="p-3">{course.code}</td>
                    <td className="p-3">{course.name}</td>
                    <td className="p-3">{course.instructor}</td>
                    <td className="p-3">{course.term}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{course.status}</span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => removeCourse(course.code)} className="btn-delete px-3 py-1 text-xs">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseRegistration;
