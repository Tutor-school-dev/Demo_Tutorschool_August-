"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../../src/hooks/useDashboardStore";
import { User, Calendar, Users, BookOpen } from "lucide-react";
import Cookies from "js-cookie";

export default function ParentDashboard() {
  const router = useRouter();
  const {
    parent,
    parent_sessions,
    loading,
    get_dashboard_data,
  } = useDashboardStore();

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token"); // Fixed: use jwt_Token instead of authToken
    if (!authToken) {
      router.push("/auth?model=parent"); // Fixed: use model parameter and correct role
      return;
    }

    // Load dashboard data
    get_dashboard_data(authToken);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">TutorSchool</h1>
            <button
              onClick={() => {
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
                }
                
                router.push("/");
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {parent?.name || "Parent"}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your child's tutoring sessions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parent_sessions?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Teachers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Connected Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(parent_sessions?.map(session => session.teacher_id)).size || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(parent_sessions?.map(session => session.subject)).size || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{parent?.name}</h3>
                    <p className="text-sm text-gray-500">{parent?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Sessions</h2>
                
                {parent_sessions && parent_sessions.length > 0 ? (
                  <div className="space-y-3">
                    {parent_sessions.map((session, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Teacher: {session.teacher_name}</p>
                            <p className="text-sm text-gray-500">{session.subject}</p>
                            <p className="text-xs text-gray-400">
                              Connected: {formatDate(session.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by browsing available tutors or posting a job.
                    </p>
                    <button
                      onClick={() => router.push("/job-listings")}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Browse Tutors
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}