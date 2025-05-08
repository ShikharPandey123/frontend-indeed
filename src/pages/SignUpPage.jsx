import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'react-toastify';

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || password.length < 8) {
      toast.error(
        "Please fill in all fields and ensure password is at least 8 characters.",
        {
          toastId: "signup-validation-error",
        }
      );
      
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: isAdmin ? "admin" : "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: data.user.email, role: data.user.role })
      );

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong during signup. Please try again.");
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-center">Create Your Account</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Sign up to apply for jobs, upload your resume, and get updates on your application status.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ✅ Admin checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="w-4 h-4"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Sign up as Admin
              </label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
