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
      const response = await fetch("http://localhost:3000/user/getApplicants");
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await fetch(`http://localhost:3000/user/view_appliction/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: decision }),
      });
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
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
                <h2 className="text-lg font-semibold">{app.name}</h2>
                <p className="text-sm text-gray-600">{app.email}</p>
                <p className="text-sm mt-1">Role: {app.jobRole}</p>
                <a
                  href={app.resumeUrl}
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
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecision(app._id, "rejected")}
                    className="bg-red-500 text-white hover:bg-red-600"
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
