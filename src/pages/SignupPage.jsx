import React, { useState } from "react";
import { useAuth } from "../auth/authentication";

function SignUpPage() {
  const countryOptions = ["USA", "Canada", "UK", "Australia"];
  const departmentOptions = ["Software Development (SD)"];
  const programOptions = [
    "Diploma (2 Years)",
    "Post-Diploma (1 Year)",
    "Certificate (6 Months)",
  ];
  const [selectedCountry, setSelectedCountry] = useState("Canada");

  const { signup } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    program: "",
    department: "",
    country: selectedCountry,
    password: "",
    // Might have to create a way to select role later for admin
    role: "student",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Signup logic to be implemented
    setError("");
    setSubmitting(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        role: form.role,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        birthday: form.birthday,
        country: selectedCountry,
        program: form.program,
        department: form.department,
      });
    } catch (err) {
      setError(err.message || "Sign up failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row w-[100%]">
        {/* Left section */}
        <div className="flex flex-col self-center md:w-[50%]">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p>Fill out this form to get started</p>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
        {/* Right section */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center max-w-[400px] mx-auto"
        >
          <label className="block mt-2 font-semibold">First Name</label>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />

          <label className="block mt-2 font-semibold">Last Name</label>
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />

          <label className="block mt-2 font-semibold">Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />

          <label className="block mt-2 font-semibold">Phone</label>
          <input
            name="phone"
            type="text"
            placeholder="Phone #"
            value={form.phone}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />

          <label className="block mt-2 font-semibold">Birthday</label>
          <input
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />

          <label className="block mt-2 font-semibold">Department</label>
          <input
            name="department"
            type="text"
            list="departments"
            placeholder="Department"
            value={form.department}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />
          <datalist id="departments">
            {departmentOptions.map((department) => (
              <option key={department} value={department} />
            ))}
          </datalist>
          {/* Form will show once the user selects a program */}
          {form.department === departmentOptions[0] && (
            <div>
              <label className="block mt-2 font-semibold">Program</label>
              <input
                name="program"
                type="text"
                list="programs"
                placeholder="Choose Program"
                value={form.program}
                onChange={onChange}
                className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              />
              <datalist id="programs">
                {programOptions.map((program) => (
                  <option key={program} value={program} />
                ))}
              </datalist>

              {/* show this part once the user has inputted something */}
              {form.department && (
                <p className="text-sm text-gray-600 mt-2">
                  You selected: <strong>{form.program}</strong>
                </p>
              )}
            </div>
          )}

          <label className="block mt-2 font-semibold">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="border border-gray-400 rounded-md px-3 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          />

          <label className="block mt-2 mb-4 font-semibold">
            Select Country
          </label>
          <div className="flex gap-3">
            {countryOptions.map((country) => (
              <button
                type="button"
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 text-sm rounded-md ${
                  selectedCountry === country
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="btn-primary-fill py-2 px-4 text-sm disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Signing Up..." : "Sign Up"}
            </button>
            <a href="/login">
              <button type="button" className="btn-primary-outlined text-sm">
                <p className="py-2 px-3">Cancel</p>
              </button>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
