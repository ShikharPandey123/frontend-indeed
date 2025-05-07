import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/user/getApplicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err.message);
    }
  };

  const handleDecision = async (id, decision) => {
    const confirmation = window.confirm(
      `Are you sure you want to ${decision} this application?`
    );
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:4000/user/${decision}/${id}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to update application status");
      }

      fetchApplications(); // Refresh list after updating status
      alert(`Application ${decision}ed successfully!`);
    } catch (err) {
      console.error("Error updating status:", err.message);
      alert("Error updating application status.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <h1 className="text-3xl font-bold mb-10 text-center">Applicant Submissions</h1>

      {applications.length === 0 ? (
        <p className="text-center text-gray-500">No applications available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {applications.map((app) => (
            <Card key={app._id} className="border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mt-1">Company: {app.company}</h2>
                <p className="text-md ">Name: {app.userId?.name || "unknown"}</p>
                <p className="text-md ">Eamil: {app.userId?.email || "unknown"}</p>
                <p className="text-md mt-1">Phone no: {app.PhoneNo}</p>
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-2 block"
                >
                  View Resume
                </a>
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => handleDecision(app._id, "accepted")}
                    className="bg-green-500 text-white hover:bg-green-600"
                    disabled={app.status === "accepted"}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecision(app._id, "rejected")}
                    className="bg-red-500 text-white hover:bg-red-600"
                    disabled={app.status === "rejected"}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
