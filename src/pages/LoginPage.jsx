import { useState } from "react";
import { useAuth } from "../auth/authentication";
import { Link } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="flex flex-col md:flex-row w-[100%]">
        {/* Left section */}
        <div className="flex flex-col self-center md:w-[50%]">
          <h1 className="text-3xl font-bold text-center">Account Login</h1>
          <p className="text-center">Securely login to your account</p>
        </div>

        {/* Right section */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center max-w-[400px] mx-auto md:w-[50%]"
        >
          {error && <p className="text-red-600 mb-2">{error}</p>}

          <label className="block mt-2 font-semibold">Username</label>
          <input
            type="text"
            placeholder="Username / email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <p className="font-extralight text-gray-600 mb-4">
            We will never share your email
          </p>

          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="font-extralight text-gray-600">
            Enter your correct combination
          </p>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="btn-primary-fill py-2 px-4 text-sm disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
            <button type="button" className="btn-primary-outlined text-sm">
              <p className="py-2 px-3">Forgot Password</p>
            </button>
          </div>

          <p className="text-sm mt-4">
            No account?{" "}
            <Link to="/signup" className="text-blue-600 underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
