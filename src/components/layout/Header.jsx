import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const navLinkClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-500";

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900">
          JobBoard
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {/* Admin Dashboard Button - only if user is admin */}
          {isLoggedIn && isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate("/admin-dashboard")}
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Admin Dashboard
            </Button>
          )}

          {/* Login Button */}
          {!isLoggedIn && (
            <Button
              onClick={() => navigate("/login")}
              className="text-white hover:text-blue-500"
            >
              Login
            </Button>
          )}

          {/* Profile/User Icon - only if logged in and not admin */}
          {isLoggedIn && !isAdmin && (
            <Link to="/profile" className={navLinkClass("/profile")}>
              <User />
            </Link>
          )}

          {/* Signup Icon - if not logged in */}
          {!isLoggedIn && (
            <Link to="/signup" className={navLinkClass("/signup")}>
              <User />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
