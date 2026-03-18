import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, DollarSign, CreditCard, TrendingUp, Download, Eye, ArrowLeftRight, Calendar, AlertCircle, ArrowLeftRight as RefundIcon, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

const initialPayments = [
  { id: 1, user: 'School ABC', plan: 'Pro', amount: 35.88, status: 'Paid', method: 'Stripe', date: '2026-03-12', invoice: 'INV-001' },
  { id: 2, user: 'Teacher Ali', plan: 'Starter', amount: 11.88, status: 'Paid', method: 'PayPal', date: '2026-03-11', invoice: 'INV-002' },
  { id: 3, user: 'Academy XYZ', plan: 'Premium', amount: 95.88, status: 'Pending', method: 'Stripe', date: '2026-03-10', invoice: 'INV-003' },
  { id: 4, user: 'Teacher Fatima', plan: 'Pro', amount: 35.88, status: 'Paid', method: 'Credit Card', date: '2026-03-09', invoice: 'INV-004' },
  { id: 5, user: 'School DEF', plan: 'Free', amount: 0, status: 'Completed', method: 'Free', date: '2026-03-08', invoice: 'INV-005' },
];

export const AdminPayments = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState<any>(null);
  const [showRefundModal, setShowRefundModal] = useState<any>(null);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleViewDetails = (payment: any) => {
    setShowPaymentDetails(payment);
  };

  const handleDownloadInvoice = (payment: any) => {
    // Create a simple invoice PDF/text
    const invoiceContent = `
INVOICE: ${payment.invoice}
========================
User: ${payment.user}
Plan: ${payment.plan}
Amount: $${payment.amount}
Payment Method: ${payment.method}
Date: ${payment.date}
Status: ${payment.status}
========================
Thank you for your payment!
    `.trim();
    
    // Download as text file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${payment.invoice}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show notification
    alert(`Downloading invoice ${payment.invoice} for ${payment.user}`);
  };

  const handleRefund = (payment: any) => {
    setShowRefundModal(payment);
  };

  const processRefund = () => {
    if (showRefundModal) {
      setPayments(payments.map(p => 
        p.id === showRefundModal.id ? { ...p, status: 'Refunded' } : p
      ));
      setShowRefundModal(null);
      alert('Refund processed successfully!');
    }
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Invoice', 'User', 'Plan', 'Amount', 'Method', 'Date', 'Status'].join(','),
      ...filteredPayments.map(p => [p.invoice, p.user, p.plan, `$${p.amount}`, p.method, p.date, p.status].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setShowExportModal(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Sandbox Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900">Sandbox Mode</h3>
            <p className="text-sm text-amber-700 mt-1">
              This is a demo environment. Payment data shown is sample data for demonstration purposes only. 
              No real transactions are processed. Connect to payment gateway API for production use.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
            <p className="text-gray-500 mt-1">Track all transactions and payments</p>
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$12,458</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp size={16} />
              <span className="font-medium">+22.1% from last month</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Successful Payments</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Requires attention</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <RefundIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Refunds</p>
                <p className="text-2xl font-bold text-gray-900">$234</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">2 refunds this month</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Stripe</p>
                  <p className="text-sm text-gray-500">Credit Cards</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$8,456</p>
              <p className="text-sm text-emerald-600">68% of total</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PayPal</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-500">PayPal Account</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$2,345</p>
              <p className="text-sm text-emerald-600">19% of total</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Apple</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Apple Pay</p>
                  <p className="text-sm text-gray-500">Apple Pay</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$1,234</p>
              <p className="text-sm text-emerald-600">10% of total</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">GPay</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Google Pay</p>
                  <p className="text-sm text-gray-500">Google Pay</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$423</p>
              <p className="text-sm text-emerald-600">3% of total</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user or invoice..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{payment.invoice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{payment.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        payment.plan === 'Pro'
                          ? 'bg-purple-100 text-purple-700'
                          : payment.plan === 'Premium'
                          ? 'bg-amber-100 text-amber-700'
                          : payment.plan === 'Starter'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      )}>
                        {payment.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">${payment.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={14} />
                        {payment.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        payment.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : payment.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : payment.status === 'Refunded'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(payment)}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                          title="Download Invoice"
                        >
                          <Download size={16} />
                        </button>
                        {payment.status === 'Paid' && (
                          <button
                            onClick={() => handleRefund(payment)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            title="Process Refund"
                          >
                            <ArrowLeftRight size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">1</span> to <span className="font-semibold text-gray-900">5</span> of <span className="font-semibold text-gray-900">{filteredPayments.length}</span> results
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Export Payment Report</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">Select export format:</p>
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadCSV}
                    className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-left hover:bg-emerald-100 transition-colors"
                  >
                    <p className="font-bold text-emerald-900">CSV Format</p>
                    <p className="text-sm text-emerald-700">Download as spreadsheet-compatible file</p>
                  </button>
                  <button
                    onClick={() => {
                      alert('PDF export coming soon!');
                      setShowExportModal(false);
                    }}
                    className="w-full p-4 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors"
                  >
                    <p className="font-bold text-blue-900">PDF Format</p>
                    <p className="text-sm text-blue-700">Download as printable PDF document</p>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {showPaymentDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaymentDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Invoice</p>
                  <p className="text-xl font-bold text-gray-900">{showPaymentDetails.invoice}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">User</p>
                    <p className="font-semibold text-gray-900">{showPaymentDetails.user}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-semibold text-gray-900">{showPaymentDetails.plan}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-xl font-bold text-emerald-600">${showPaymentDetails.amount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="font-semibold text-gray-900">{showPaymentDetails.method}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{showPaymentDetails.date}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      showPaymentDetails.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : showPaymentDetails.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    )}>
                      {showPaymentDetails.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPaymentDetails(null)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadInvoice(showPaymentDetails)}
                  className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Download Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refund Modal */}
      <AnimatePresence>
        {showRefundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRefundModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Process Refund</h3>
                <p className="text-gray-500">
                  Are you sure you want to process a refund for <span className="font-bold">{showRefundModal.invoice}</span>?
                  <br />
                  Amount: <span className="font-bold text-emerald-600">${showRefundModal.amount}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRefundModal(null)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processRefund}
                  className="flex-1 px-4 py-2.5 text-white bg-red-600 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Confirm Refund
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

// Helper function
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
