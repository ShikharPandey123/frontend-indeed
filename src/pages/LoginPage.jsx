import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Save user info and token
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.user.email,
            role: data.user.role,
          })
        );

        // ✅ Save token
        localStorage.setItem("token", data.token);

        // Redirect
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/"); // Make sure this is the correct route
        }
      } else {
        toast.error(data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Please log in to apply for jobs and track your application status.
            We use your account to securely store your uploaded resume and keep
            you updated when employers accept or reject your application.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Login to Continue
            </Button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Create now
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
