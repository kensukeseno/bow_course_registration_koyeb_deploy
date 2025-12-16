import React, { useState, useEffect } from "react";

export default function SubmittedForms() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/admin/messages", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="text-center space-y-2">
        <h1 className="font-bold text-3xl">Submitted Forms</h1>
        <p className="text-gray-600">
          Manage Submitted messages from students.
        </p>
      </div>
      <div className="flex mt-4">
        <button className=" btn-primary-fill py-4 px-4 text-small">
          Search Messages
        </button>
      </div>

      {/* Forms list */}
      <div className="max-w-6xl mx-auto px-6 mt-28">
        <h2 className="font-bold text-xl">Forms List</h2>
        <p className="text-gray-600 py-3">
          Overview of submitted student messages.
        </p>

        {/* Forms container */}
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-gray-500">No messages submitted yet.</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Top Row: Student info + ID + Term */}
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full"></div>
                  <div>
                    <p className="font-semibold text-blue-600 hover:underline cursor-pointer">
                      {msg.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                </div>

                <div className="text-right text-sm text-gray-600">
                  <p>Date: {msg.dateSubmitted}</p>
                </div>
              </div>

              {/* Middle Row */}
              <div className="mt-4 flex flex-wrap justify-between items-center text-sm text-gray-600">
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      msg.status === "Read" ? "text-gray-600" : "text-green-600"
                    }`}
                  >
                    {msg.status}
                  </span>
                </p>
              </div>

              {/* Message Preview */}
              <div className="mt-3 text-gray-700 text-sm">
                <p>
                  <span className="font-medium">Message Preview:</span>{" "}
                  {msg.message.length > 30
                    ? msg.message.slice(0, 30) + "..."
                    : msg.message}
                </p>
              </div>

              {/* Bottom Link */}
              <div className="mt-4 text-right">
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Full Message →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message details (conditional) */}
        {selectedMessage && (
          <div className="flex items-center text-start flex-col mt-10">
            <h2 className="font-bold text-xl mb-2">Full Message</h2>
            <div className="bg-gray-100 p-6 rounded-lg w-full max-w-2xl">
              <p>
                <span className="font-semibold">From:</span>{" "}
                {selectedMessage.fullName} ({selectedMessage.email})
              </p>
              <p className="mt-2">
                <span className="font-semibold">Subject:</span>{" "}
                {selectedMessage.subject}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Message:</span>
              </p>
              <p className="mt-1">{selectedMessage.message}</p>
              <button
                className="btn-primary-fill mt-4"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
