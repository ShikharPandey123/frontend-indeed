import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// fallback jobs
const fallbackJobs = [
  {
    title: "Frontend Developer",
    company: "TechSoft Inc.",
    location: "Gurugram",
    description: "Build interactive UI using React and Tailwind CSS.",
  },
  {
    title: "Backend Developer",
    company: "CodeSmiths",
    location: "Bangalore",
    description: "Work with Node.js and MongoDB to create APIs.",
  },
  {
    title: "Full Stack Engineer",
    company: "DevHive",
    location: "Delhi NCR",
    description: "End-to-end development using MERN stack.",
  },
  {
    title: "UI/UX Designer",
    company: "DesignEra",
    location: "Mumbai",
    description: "Design modern interfaces using Figma and Adobe XD.",
  },
  {
    title: "Software Intern",
    company: "StartUpX",
    location: "Remote",
    description: "Assist in building MVPs and learning best practices.",
  },
];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Fetch from API if needed
      setJobs(fallbackJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs(fallbackJobs);
    }
  };

  const handleApply = (job) => {
    const isLoggedIn = localStorage.getItem("user");

    // Save selected job to localStorage
    localStorage.setItem("selectedJob", JSON.stringify(job));

    if (isLoggedIn) {
      navigate("/apply");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <h1 className="text-3xl font-bold mb-10 text-center">Available Job Openings</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {jobs.map((job, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm rounded-xl hover:shadow-lg transition">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
              <p className="mt-2 text-gray-800 text-sm">{job.description}</p>

              <Button
                onClick={() => handleApply(job)}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700 w-full"
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
