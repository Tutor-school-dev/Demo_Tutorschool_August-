"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../../../src/hooks/useDashboardStore";
import TeacherNavbar from "../../../../src/components/TeacherNavbar";
import { Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Cookies from "js-cookie";

export default function SessionsPage() {
  const router = useRouter();
  const { teacher_sessions, loading, get_dashboard_data } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'parent' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const sessionsPerPage = 10;

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    // Load dashboard data if not already loaded
    get_dashboard_data(authToken);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort sessions
  const filteredSessions = teacher_sessions?.filter(session => {
    if (filterStatus === 'all') return true;
    return session.admin_side_status === filterStatus;
  }) || [];

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'date':
        compareValue = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'parent':
        compareValue = a.parent_name.localeCompare(b.parent_name);
        break;
      case 'status':
        compareValue = a.admin_side_status.localeCompare(b.admin_side_status);
        break;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const paginatedSessions = sortedSessions.slice(startIndex, startIndex + sessionsPerPage);

  const handleSort = (field: 'date' | 'parent' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
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
            <button
              onClick={() => router.push("/dashboard/teacher")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
            <p className="mt-2 text-lg text-gray-600">
              View and manage all your tutoring sessions
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">All Sessions</option>
                    <option value="accepted">Accepted</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {paginatedSessions.length} of {sortedSessions.length} sessions
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {sortedSessions.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('parent')}
                        >
                          Parent Name
                          {sortBy === 'parent' && (
                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student & Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class & Board
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('status')}
                        >
                          Status
                          {sortBy === 'status' && (
                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('date')}
                        >
                          Date
                          {sortBy === 'date' && (
                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedSessions.map((session, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {session.parent_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{session.child_name}</div>
                            <div className="text-sm text-gray-500">{session.subject}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Class {session.class}</div>
                            <div className="text-sm text-gray-500">{session.board}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{session.timings}</div>
                            <div className="text-sm text-gray-500">{session.week_days}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.admin_side_status)}`}>
                              {session.admin_side_status}
                            </span>
                            {session.removed_at && (
                              <div className="text-xs text-red-500 mt-1">
                                Removed: {formatDate(session.removed_at)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(session.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === 'all' 
                    ? "You haven't received any session requests yet."
                    : `No ${filterStatus} sessions found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}