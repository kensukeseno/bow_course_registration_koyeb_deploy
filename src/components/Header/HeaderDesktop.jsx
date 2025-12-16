import { Link } from "react-router-dom";
import { useAuth } from "../../auth/authentication";

export default function HeaderDesktop() {
  const { currentUser, logout } = useAuth();

  const renderPublicNav = () => (
    <header className="bg-2 text-white py-2 px-3">
      <div className="mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-none">
          <Link to="/">Bow Course Registration</Link>
        </h1>
        <nav className="flex gap-4">
          <Link
            to="/"
            className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );

  // only home, login, and signup when no one's logged in
  if (!currentUser) {
    return renderPublicNav();
  }

  // student header (only visible inside /student-dashboard)
  else if (currentUser.role === "student") {
    return (
      <header className="bg-2 text-white py-2 px-3">
        <div className="mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold cursor-none">
            <Link to="/student-dashboard">Bow Course Registration</Link>
          </h1>
          <nav className="flex gap-4">
            <Link
              to="/student-dashboard"
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Student Dashboard
            </Link>
            <Link
              to="/profile"
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Profile
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Contact
            </Link>
            <Link
              to="/course-registration"
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Register
            </Link>
            <Link
              to="/login"
              onClick={logout}
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Logout
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  // admin header (only visible inside /admin-dashboard)
  else if (currentUser.role === "admin") {
    return (
      <header className="bg-2 text-white py-2 px-3">
        <div className="mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold cursor-none">
            <Link to="/admin-dashboard">Bow Course Registration</Link>
          </h1>
          <nav className="flex gap-4">
            <Link
              to="/admin-dashboard"
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/login"
              onClick={logout}
              className="px-3 py-2 text-sm rounded hover:text-[var(--system-orange)]"
            >
              Logout
            </Link>
          </nav>
        </div>
      </header>
    );
  } else return renderPublicNav();
}
