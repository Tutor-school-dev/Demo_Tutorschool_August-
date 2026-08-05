"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../../src/hooks/useDashboardStore";
import TeacherNavbar from "../../../src/components/TeacherNavbar";
import { User, Calendar, DollarSign, BookOpen, Clock, MapPin } from "lucide-react";
import Cookies from "js-cookie";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const {
    teacher,
    teacher_sessions,
    teacher_subscription,
    teacher_subjects,
    loading,
    get_dashboard_data,
    get_teacher_subs,
  } = useDashboardStore();

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token"); // Fixed: use jwt_Token consistently
    
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    // Load dashboard data
    get_dashboard_data(authToken).catch(error => {
      console.error("Teacher dashboard: Error loading dashboard data:", error);
    });
    get_teacher_subs(authToken).catch(error => {
      console.error("Teacher dashboard: Error loading teacher subs:", error);
    });
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
      <TeacherNavbar />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {teacher?.name || "Teacher"}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Here's an overview of your teaching activities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teacher_sessions?.filter(session => session.admin_side_status === 'accepted' && !session.removed_at).length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teacher_sessions?.length || 0}
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
                    {teacher_subjects?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson Price */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Lesson Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{teacher?.lesson_price || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  {teacher?.profile_pic ? (
                    <img
                      src={teacher.profile_pic}
                      alt={teacher.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{teacher?.name}</h3>
                    <p className="text-sm text-gray-500">{teacher?.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{teacher?.area || "Location not set"}, {teacher?.state || ""}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>₹{teacher?.lesson_price || 0} per lesson</span>
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Subscription</h4>
                    <button 
                      onClick={() => router.push("/dashboard/teacher/subscription")}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Manage
                    </button>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    teacher_subscription?.name === 'Premium' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {teacher_subscription?.name || 'Free'}
                  </div>
                  {teacher_subscription?.validity && (
                    <p className="text-xs text-gray-500 mt-1">
                      Valid until: {formatDate(teacher_subscription.validity)}
                    </p>
                  )}
                  {!teacher_subscription?.name && (
                    <p className="text-xs text-blue-600 mt-1 cursor-pointer" 
                       onClick={() => router.push("/dashboard/teacher/subscription")}>
                      Upgrade to Premium →
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Sessions and Subjects */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Sessions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
                  <button 
                    onClick={() => router.push("/dashboard/teacher/sessions")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all
                  </button>
                </div>
                
                {teacher_sessions && teacher_sessions.length > 0 ? (
                  <div className="space-y-3">
                    {teacher_sessions.slice(0, 5).map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{session.parent_name}</p>
                          <p className="text-sm text-gray-500">
                            {session.subject} • {session.child_name} • Class {session.class}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(session.created_at)}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.admin_side_status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : session.admin_side_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {session.admin_side_status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No sessions yet</p>
                )}
              </div>

              {/* Subjects */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Your Subjects</h2>
                  <button 
                    onClick={() => router.push("/dashboard/teacher/subjects")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Manage
                  </button>
                </div>
                
                {teacher_subjects && teacher_subjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {teacher_subjects.map((subject, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{subject.subject_name}</p>
                          <p className="text-sm text-gray-500">{subject.subject_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No subjects added yet</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push("/dashboard/teacher/payments")}
                    className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  >
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">View Payments</span>
                  </button>
                  
                  <button
                    onClick={() => router.push("/dashboard/teacher/subjects")}
                    className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-purple-700 font-medium">Edit Subjects</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}