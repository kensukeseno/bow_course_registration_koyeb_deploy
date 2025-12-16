import { useState, useEffect } from "react";
import Student from "../components/Student";

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("All Programs");
  const [filteredStudent, setFilteredStudent] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [studentShow, setStudentShow] = useState(false);

  // Load students from localStorage on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/admin/students", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch student information");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length === 0) {
      setFilteredStudent([]);
      return;
    }

    // Filter by program - simplified logic
    let result = students;
    if (selectedProgram !== "All Programs") {
      result = students.filter((s) => {
        if (!s.program) return false;

        // Simple case-insensitive includes check with null safety
        const programLower = s.program.toLowerCase();
        const selectedLower = selectedProgram.toLowerCase();

        return (
          programLower.includes(selectedLower) ||
          (selectedProgram === "Diploma" && programLower.includes("sd"))
        );
      });
    }

    // Filter by search term with null safety
    const finalResult = result.filter((r) => {
      const firstName = r.firstName || "";
      const lastName = r.lastName || "";
      const id = r.id || "";
      const searchLower = searchValue.toLowerCase();

      return (
        firstName.toLowerCase().includes(searchLower) ||
        lastName.toLowerCase().includes(searchLower) ||
        id.toLowerCase().includes(searchLower)
      );
    });

    setFilteredStudent(finalResult);
  }, [selectedProgram, searchValue, students]);

  return (
    <div className="flex flex-col gap-6 lg:gap-10 py-6 lg:py-10 px-4">
      <div className="flex flex-col gap-2 items-center text-center">
        <h1 className="text-2xl lg:text-3xl font-bold">View Students</h1>
        <p className="text-gray-600 text-sm lg:text-base">
          Manage student registrations in the Software Development department.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-end">
        <div className="w-full lg:flex-1">
          <h2 className="font-semibold mb-2">Search Students</h2>
          <input
            type="text"
            placeholder="Enter name or ID"
            onChange={(e) => setSearchValue(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full lg:w-auto">
          <h2 className="font-semibold mb-2">Filter by Program</h2>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {["All Programs", "Diploma", "Post-Diploma", "Certificate"].map(
              (program) => (
                <button
                  key={program}
                  onClick={() => setSelectedProgram(program)}
                  className={`px-3 lg:px-4 py-2 text-xs lg:text-sm rounded-md transition-colors ${
                    selectedProgram === program
                      ? "bg-1 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {program}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full">
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 border-[1px] border-[var(--system-purple)]">
            <thead className="bg-1 text-white">
              <tr className="text-xs lg:text-sm font-medium">
                <td className="p-2 lg:p-3 whitespace-nowrap">ID</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">First Name</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">Last Name</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">Email</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">Phone</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">Birthday</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">Department</td>
                <td className="p-2 lg:p-3 whitespace-nowrap">Program</td>
              </tr>
            </thead>
            <tbody>
              {filteredStudent.length === 0 ? (
                <tr key="no-students">
                  <td
                    colSpan="8"
                    className="text-center py-8 text-[var(--system-gray)] text-xs lg:text-sm"
                  >
                    {students.length === 0
                      ? "No students found in the system."
                      : "No students found matching the current filter."}
                  </td>
                </tr>
              ) : (
                <>
                  {filteredStudent.slice(0, 4).map((s) => (
                    <Student
                      key={s.id}
                      id={s.id}
                      firstName={s.firstName}
                      lastName={s.lastName}
                      email={s.email}
                      phone={s.phone}
                      birthday={s.birthday}
                      department={s.department}
                      program={s.program}
                    />
                  ))}
                  {studentShow &&
                    filteredStudent
                      .slice(4)
                      .map((s) => (
                        <Student
                          key={s.id}
                          id={s.id}
                          firstName={s.firstName}
                          lastName={s.lastName}
                          email={s.email}
                          phone={s.phone}
                          birthday={s.birthday}
                          department={s.department}
                          program={s.program}
                        />
                      ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Scroll hint */}
        <p className="text-xs text-gray-500 mt-2 text-center sm:hidden">
          Scroll horizontally to see all columns
        </p>

        {filteredStudent.length > 4 && (
          <div className="flex justify-center mt-5">
            <button
              className="btn-primary-outlined"
              onClick={() => setStudentShow(!studentShow)}
            >
              <span className="py-2 px-3">
                {studentShow ? "View Less Students" : "View All Students"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
