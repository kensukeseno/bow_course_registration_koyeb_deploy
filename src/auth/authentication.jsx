import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  //Load user from the backend session if it exists
  useEffect(() => {
    let cancelled = false;

    const loadCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();
        if (!cancelled) {
          setCurrentUser(data);
        }
      } catch {
        if (!cancelled) {
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCurrentUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizeEmail = (e) => e.trim().toLowerCase();

  /*Local torage signup/login methods (REPLACED WITH BACKEND CALLS)
  const signup = ({
    email,
    password,
    role,
    firstName,
    lastName,
    phone,
    birthday,
    program,
    department,
  }) => {
    const users = JSON.parse(localStorage.getItem("app_users") || "[]");
    const e = normalizeEmail(email);

    // duplicate email check
    if (users.some((u) => u.email === e)) {
      throw new Error("Email already registered.");
    }
    // minimal validation
    if (!e || !password || password.length < 6) {
      throw new Error("Invalid email or password too short (min 6).");
    }

    const user = {
      id: crypto.randomUUID(),
      email: e,
      password,
      role,
      firstName,
      lastName,
      phone,
      birthday,
      program,
      department,
    };
    users.push(user);
    localStorage.setItem("app_users", JSON.stringify(users));

    const { password: _pw, ...publicUser } = user;
    localStorage.removeItem("app_currentUser", JSON.stringify(publicUser));
    setCurrentUser(null);

    nav("/login", { replace: true });
  };
 */

  //Signup method calling backend API
  const signup = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
    birthday,
    program,
    department,
    country,
    role,
  }) => {
    const payload = {
      id: crypto.randomUUID(),
      email: normalizeEmail(email),
      password,
      firstName,
      lastName,
      phone,
      birthday,
      program,
      department,
      country,
      role,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Signup failed.");
    }

    // Automatically sign the new user in with the returned profile
    setCurrentUser(data);

    nav(role === "student" ? "/student-dashboard" : "/admin-dashboard", {
      replace: true,
    });
  };

  /*Local storage login method (REPLACED WITH BACKEND CALLS)
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("app_users") || "[]");
    const e = normalizeEmail(email);
    const match = users.find((u) => u.email === e && u.password === password);
    if (!match) return false;

    const { password: _pw, ...publicUser } = match;
    localStorage.setItem("app_currentUser", JSON.stringify(publicUser));
    setCurrentUser(publicUser);
    nav(
      publicUser.role === "student" ? "/student-dashboard" : "/admin-dashboard",
      { replace: true }
    );
    return true;
  };
*/

  //Login method calling backend API
  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: normalizeEmail(email), password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Invalid credentials");
    }

    setCurrentUser(data);

    const role = data.role ?? "student";
    nav(role === "student" ? "/student-dashboard" : "/admin-dashboard", {
      replace: true,
    });
    return true;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      //ignore network errors on logout
    }
    setCurrentUser(null);
    nav("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, signup, login, logout, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
