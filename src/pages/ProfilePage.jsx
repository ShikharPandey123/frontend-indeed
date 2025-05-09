import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Response data:", JSON.stringify(data, null, 2)); // Check structure of the response

        if (response.ok && data.applications) {
          setApplications(data.applications); // Assign the applications correctly
        } else {
          console.error("Failed to fetch user applications");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Applications</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-center text-gray-600">
          No applications submitted yet.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {applications.map((app, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-xl font-semibold capitalize">
                {app.role || "Unknown Role"}
              </h2>
              <p className="text-sm text-gray-700">
                <strong>Company:</strong> {app.company || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> {app.location || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Description:</strong> {app.description || "N/A"}
              </p>

              <p
                className={`mt-2 font-medium ${
                  app.status === "accepted"
                    ? "text-green-600"
                    : app.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                Status:{" "}
                {app.status
                  ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                  : "Pending"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
