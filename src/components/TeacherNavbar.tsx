"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../hooks/useDashboardStore";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";

export default function TeacherNavbar() {
  const router = useRouter();
  const { teacher } = useDashboardStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    // Clear all cookies
    Cookies.remove("jwt_Token");
    Cookies.remove("refresh_token");
    Cookies.remove("access_hash");
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("model");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("Phone");
      localStorage.removeItem("redirectFromJobListing");
    }
    
    // Redirect to home
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">TutorSchool</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => router.push("/dashboard/teacher")}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/dashboard/teacher/sessions")}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sessions
            </button>
            <button
              onClick={() => router.push("/dashboard/teacher/students")}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Students
            </button>
            <button
              onClick={() => router.push("/dashboard/teacher/matching")}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Matching
            </button>
            <button
              onClick={() => router.push("/dashboard/teacher/subjects")}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Subjects
            </button>
          </div>

          {/* Right side - User profile */}
          <div className="flex items-center space-x-4">
            {/* Profile Picture and Name */}
            <div className="flex items-center space-x-3">
              {teacher?.profile_pic ? (
                <img
                  src={teacher.profile_pic}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {teacher?.name || "Teacher"}
              </span>
            </div>

            {/* Dropdown Menu */}
            <div className="relative dropdown-container">
              <button 
                className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/teacher-profile");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}