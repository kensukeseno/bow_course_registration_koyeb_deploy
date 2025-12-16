import { useAuth } from "../auth/authentication";
import { useState, useEffect } from "react";
// this is the Profile Page component, it displays user information and allows editing
function ProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    phone: "",
    birthday: "",
    program: "",
  });

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
    const day = date.getUTCDate();
    return `${month} ${day}, ${year}`;
  };

  // Helper function to format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.id || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        birthday: formatDateForInput(currentUser.birthday) || "",
        program: currentUser.program || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      console.log("Updating profile via API...");

      const profileData = {
        email: formData.email.trim(),
        phone: formData.phone,
        birthday: formData.birthday,
        program: formData.program,
      };

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Profile updated successfully:", result);

        // Update current user context with new data
        const updatedUser = {
          ...currentUser,
          email: profileData.email,
          phone: profileData.phone,
          birthday: profileData.birthday,
          program: profileData.program,
        };

        setCurrentUser(updatedUser);
        setShowModal(false);

      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-semibold text-xl text-center">User Information</h1>
      <div className="mx-auto border-[1px] border-[var(--system-blue)] p-4 rounded-md md:min-w-[550px]">
        <div className="mb-3">
          <div className="text-lg font-semibold mb-1">
            {currentUser.firstName} {currentUser.lastName}
          </div>
          <span className="text-xs bg-[#bbe2f8] text-[var(--system-blue)] rounded-md px-1 py-0.5">
            {currentUser?.role}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[var(--system-gray)]">Email</div>
            <div>{currentUser?.email || "—"}</div>
          </div>
          <div>
            <div className="text-[var(--system-gray)]">Phone</div>
            <div>{currentUser?.phone || "—"}</div>
          </div>

          <div>
            <div className="text-[var(--system-gray)]">Department</div>
            <div>{currentUser?.department || "Software Development - SD"}</div>
          </div>

          <div>
            <div className="text-[var(--system-gray)]">Program</div>
            <div>{currentUser?.program || "Computer Science"}</div>
          </div>

          <div>
            <div className="text-[var(--system-gray)]">Birthday</div>
            <div>{formatDateForDisplay(currentUser?.birthday)}</div>
          </div>
          <div>
            <div className="text-[var(--system-gray)]">
              {currentUser?.role} ID
            </div>
            <div>{currentUser?.id || "—"}</div>
          </div>
        </div>
        <button
          className="btn-primary-fill py-2 px-4 mt-2 mx-auto text-sm float-right"
          onClick={() => setShowModal(true)}
        >
          Edit
        </button>
      </div>

      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                  />
                </div>
                {currentUser?.role === "student" && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Program
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                    >
                      <option value="Diploma (2 Years)">
                        Diploma (2 Years)
                      </option>
                      <option value="Post-Diploma (1 Year)">
                        Post-Diploma (1 Year)
                      </option>
                      <option value="Certificate (6 Months)">
                        Certificate (6 Months)
                      </option>
                    </select>
                  </div>
                )}
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
                    disabled={isUpdating}
                    className="btn-primary-fill py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Submit"}
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

export default ProfilePage;
