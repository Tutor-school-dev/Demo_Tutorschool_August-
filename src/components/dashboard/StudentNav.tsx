"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, ChevronDown, LayoutDashboard, FileText, UserCircle, Zap } from "lucide-react";
import Cookies from "js-cookie";

export default function StudentNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const studentName = typeof window !== "undefined" ? localStorage.getItem("name") || "Student" : "Student";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) setIsDropdownOpen(false);
    };
    if (isDropdownOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    Cookies.remove("jwt_Token");
    Cookies.remove("refresh_token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("model");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
    }
    router.push("/auth");
  };

  const links = [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/student/test", label: "Tests", icon: FileText },
    { href: "/dashboard/student/profile", label: "Profile", icon: UserCircle },
    { href: "/matching", label: "Find Tutor", icon: Zap },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-emerald-600">TutorSchool</h1>
            <span className="hidden sm:inline text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              Student
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              {studentName}
            </span>
            <div className="relative dropdown-container">
              <button
                className="flex items-center p-1.5 rounded-md hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-1 z-50">
        <div className="flex justify-around">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-xs ${
                  isActive ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
