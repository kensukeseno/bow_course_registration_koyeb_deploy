import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/authentication";

export default function HeaderMobile() {
  const { currentUser, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const renderPublicNav = () => (
    <header className="bg-2 text-white py-2 px-3 flex flex-row justify-between">
      <h1 className="text-lg font-bold cursor-none">
        <Link to="/">Bow Course Registration</Link>
      </h1>
      <div className="relative ">
        <button onClick={toggleDropdown} className="text-white focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg"
            onClick={toggleDropdown}
          >
            <Link
              to="/"
              className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );

  if (!currentUser) {
    return renderPublicNav();
  } else if (currentUser.role === "student") {
    return (
      <header className="bg-2 text-white py-2 px-3 flex flex-row justify-between">
        {/* Mobile Menu Button */}
        <h1 className="text-lg font-bold cursor-none">
          <Link to="/">Bow Course Registration</Link>
        </h1>
        <div className="relative ">
          <button
            onClick={toggleDropdown}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg"
              onClick={toggleDropdown}
            >
              <Link
                to="/student-dashboard"
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Student Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Profile
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Contact
              </Link>
              <Link
                to="/course-registration"
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={logout}
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </header>
    );
  } else if (currentUser.role === "admin") {
    return (
      <header className="bg-2 text-white py-2 px-3 flex flex-row justify-between">
        {/* Mobile Menu Button */}
        <h1 className="text-lg font-bold cursor-none">
          <Link to="/">Bow Course Registration</Link>
        </h1>
        <div className="relative ">
          <button
            onClick={toggleDropdown}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg"
              onClick={toggleDropdown}
            >
              <Link
                to="/admin-dashboard"
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/login"
                onClick={logout}
                className="block px-4 py-2 text-sm rounded hover:text-[var(--system-orange)]"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </header>
    );
  } else return renderPublicNav();
}
