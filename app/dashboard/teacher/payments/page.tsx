"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../../../src/hooks/useDashboardStore";
import TeacherNavbar from "../../../../src/components/TeacherNavbar";
import { DollarSign, ChevronLeft, ChevronRight, Filter, Download } from "lucide-react";
import Cookies from "js-cookie";

export default function PaymentsPage() {
  const router = useRouter();
  const { teacher_payments, loading, get_dashboard_data, get_teacher_payment } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  const paymentsPerPage = 10;

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    // Load dashboard data if not already loaded
    get_dashboard_data(authToken);
    get_teacher_payment(authToken);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort payments
  const filteredPayments = teacher_payments?.filter(payment => {
    let statusMatch = true;
    let typeMatch = true;
    
    if (filterStatus !== 'all') {
      statusMatch = payment.status.toLowerCase() === filterStatus;
    }
    
    if (filterType !== 'all') {
      if (filterType === 'refunds') {
        typeMatch = payment.is_refund;
      } else if (filterType === 'payments') {
        typeMatch = !payment.is_refund;
      }
    }
    
    return statusMatch && typeMatch;
  }) || [];

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'date':
        compareValue = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case 'amount':
        compareValue = a.amount - b.amount;
        break;
      case 'status':
        compareValue = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPayments.length / paymentsPerPage);
  const startIndex = (currentPage - 1) * paymentsPerPage;
  const paginatedPayments = sortedPayments.slice(startIndex, startIndex + paymentsPerPage);

  const handleSort = (field: 'date' | 'amount' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Calculate summary statistics
  const totalEarnings = teacher_payments?.filter(p => !p.is_refund && p.status.toLowerCase() === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0) || 0;
    
  const totalRefunds = teacher_payments?.filter(p => p.is_refund)
    .reduce((sum, payment) => sum + payment.amount, 0) || 0;
    
  const pendingAmount = teacher_payments?.filter(p => !p.is_refund && p.status.toLowerCase() === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0) || 0;

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Track your earnings and payment transactions
                </p>
              </div>
              
              <button
                onClick={() => {/* Export functionality */}}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(totalEarnings)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(pendingAmount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(totalRefunds)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Type:</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="payments">Payments</option>
                    <option value="refunds">Refunds</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {paginatedPayments.length} of {sortedPayments.length} transactions
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {sortedPayments.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('amount')}
                        >
                          Amount
                          {sortBy === 'amount' && (
                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
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
                      {paginatedPayments.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className={`w-5 h-5 mr-3 ${payment.is_refund ? 'text-red-500' : 'text-green-500'}`} />
                              <span className={`text-sm font-medium ${payment.is_refund ? 'text-red-700' : 'text-green-700'}`}>
                                {payment.is_refund ? 'Refund' : 'Payment'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.is_refund ? '-' : '+'}{formatAmount(payment.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.updated_at)}
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
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === 'all' && filterType === 'all'
                    ? "You haven't received any payments yet."
                    : `No payments found for the selected filters.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}