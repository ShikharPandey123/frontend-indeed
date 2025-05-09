import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function UploadResumePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    resume: null,
  });

  const [jobDetails, setJobDetails] = useState(null);

  // Load job details from localStorage on mount
  useEffect(() => {
    const job = localStorage.getItem("selectedJob");
    if (job) {
      const parsedJob = JSON.parse(job);
      setJobDetails(parsedJob);
      setFormData((prev) => ({ ...prev, role: parsedJob.title }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.name);
    data.append("PhoneNo", formData.phone);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (formData.resume) {
      data.append("resume", formData.resume);
    }

    // Include job meta if available
    if (jobDetails) {
      data.append("jobTitle", jobDetails.title);
      data.append("company", jobDetails.company);
      data.append("location", jobDetails.location);
      data.append("description", jobDetails.description);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/user/apply_job", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Resume uploaded successfully!",
          {
            toastId: "upload-success",
          }
        );
        localStorage.removeItem("selectedJob"); // 
      } 
      
      else {
        const result = await response.json();
        toast.error(result.error || "Upload failed. Please try again.",
          {
            toastId: "upload-error",
          }
        );
      }
      
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.",
        {
          toastId: "upload-error",
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Upload Your Resume
          </h2>

          {/* Optional: Display job info */}
          {jobDetails && (
            <div className="mb-6 text-sm bg-gray-100 p-4 rounded-md">
              <p>
                <strong>Job:</strong> {jobDetails.title}
              </p>
              <p>
                <strong>Company:</strong> {jobDetails.company}
              </p>
              <p>
                <strong>Location:</strong> {jobDetails.location}
              </p>
              <p>
                <strong>Job description:</strong> {jobDetails.description}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                className="mt-1"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                type="tel"
                className="mt-1"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>


            <div>
              <Label>Job Role</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.role}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a job role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">
                    Frontend Developer
                  </SelectItem>
                  <SelectItem value="Backend Developer">
                    Backend Developer
                  </SelectItem>
                  <SelectItem value="Full Stack Engineer">
                    Full Stack Developer
                  </SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  <SelectItem value="Software Intern">
                    Software Intern
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resume">Upload Resume (PDF/DOC)</Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-1"
                onChange={handleFileChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Submit Resume
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
