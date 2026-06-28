/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Student, FeeRecord, Course } from '../types';
import { 
  DollarSign, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Printer, 
  X, 
  Check 
} from 'lucide-react';

interface FeeManagerProps {
  students: Student[];
  courses: Course[];
  fees: FeeRecord[];
  onAddPayment: (studentId: string, amount: number) => void;
}

export default function FeeManager({
  students,
  courses,
  fees,
  onAddPayment
}: FeeManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Payment Form Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payStudentId, setPayStudentId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Receipt Modal
  const [receiptRecord, setReceiptRecord] = useState<{ student: Student; course: Course; fee: FeeRecord; amountPaid: number } | null>(null);

  // General counts
  const totalBilled = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDues = totalBilled - totalCollected;

  const handleOpenPay = (studentId: string = '') => {
    setPayStudentId(studentId || students[0]?.id || '');
    setPayAmount('');
    setPaymentSuccess(false);
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = (e: FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(payAmount);
    if (!payStudentId || isNaN(amountVal) || amountVal <= 0) return;

    // Fetch details for receipt before editing state
    const student = students.find(s => s.id === payStudentId);
    const fee = fees.find(f => f.studentId === payStudentId);
    const course = student ? courses.find(c => c.id === student.courseId) : null;

    onAddPayment(payStudentId, amountVal);
    setPaymentSuccess(true);
    
    // Set for receipt print preview
    if (student && fee && course) {
      setReceiptRecord({
        student,
        course,
        fee: {
          ...fee,
          paidAmount: fee.paidAmount + amountVal,
          status: (fee.paidAmount + amountVal) >= fee.totalAmount ? 'Paid' : 'Partial'
        },
        amountPaid: amountVal
      });
    }

    setTimeout(() => {
      setIsPayModalOpen(false);
    }, 1500);
  };

  // Compile list
  const studentFeeTable = students.map(student => {
    const fee = fees.find(f => f.studentId === student.id);
    const course = courses.find(c => c.id === student.courseId);
    
    // Fallback if record does not exist
    const feeRecord: FeeRecord = fee || {
      id: `fallback_${student.id}`,
      studentId: student.id,
      totalAmount: course ? course.feeAmount : 100000,
      paidAmount: 0,
      status: 'Pending'
    };

    return {
      student,
      course,
      fee: feeRecord
    };
  });

  const filteredFeeList = studentFeeTable.filter(item => {
    const matchesSearch = item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.fee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="fee-manager-container">
      {/* Financial high lights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="fee-highlights">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Billed Tuition</span>
            <span className="text-xl font-extrabold text-slate-800">₹{totalBilled.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Gross Collected</span>
            <span className="text-xl font-extrabold text-blue-600">₹{totalCollected.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Outstanding Receivables</span>
            <span className="text-xl font-extrabold text-rose-600">₹{totalDues.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Header and filters */}
      <div className="flex flex-wrap items-center justify-between gap-4" id="fee-manager-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Tuition Accounts</h2>
          <p className="text-xs text-slate-500">Track balance invoices, filter accounts by paid status, and process card payments.</p>
        </div>
        <button
          id="btn-trigger-pay"
          onClick={() => handleOpenPay()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          Collect New Payment
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm" id="fee-filters">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            id="fee-search-input"
            type="text"
            placeholder="Search student invoices by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50"
          />
        </div>

        <div className="md:col-span-4">
          <select
            id="fee-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-medium text-slate-600"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Fully Paid In Full</option>
            <option value="Partial">Partial Installment</option>
            <option value="Pending">Pending Payment</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="fee-table-container">
        {filteredFeeList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course Program</th>
                  <th className="py-3 px-4 text-right">Tuition Amount</th>
                  <th className="py-3 px-4 text-right">Collected Amount</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFeeList.map(({ student, course, fee }) => {
                  const balance = fee.totalAmount - fee.paidAmount;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 text-xs text-slate-600 font-sans">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{student.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 block">{student.rollNo}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {course ? course.name : 'General Program'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        ₹{fee.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">
                        ₹{fee.paidAmount.toLocaleString('en-IN')}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        ₹{balance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          fee.status === 'Partial' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {fee.status === 'Paid' ? <CheckCircle className="w-2.5 h-2.5" /> : 
                           fee.status === 'Partial' ? <Clock className="w-2.5 h-2.5" /> : 
                           <AlertTriangle className="w-2.5 h-2.5" />}
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            id={`btn-collect-due-${student.id}`}
                            onClick={() => handleOpenPay(student.id)}
                            disabled={fee.status === 'Paid'}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors border ${
                              fee.status === 'Paid'
                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                : 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            Collect Dues
                          </button>
                          
                          {fee.paidAmount > 0 && (
                            <button
                              id={`btn-receipt-${student.id}`}
                              onClick={() => {
                                if (course) {
                                  setReceiptRecord({ student, course, fee, amountPaid: fee.paidAmount });
                                }
                              }}
                              className="p-1 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-lg"
                              title="Print Last Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400 text-xs">
            No student billing records match your search criteria.
          </div>
        )}
      </div>

      {/* COLLECT PAYMENT MODAL */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="modal-pay-fees">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 animate-fadeIn relative">
            <button
              id="btn-close-pay-modal"
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Record Tuition Fee Payment</h3>
                <p className="text-xs text-slate-400 font-sans">Simulate transaction logging to MySQL records.</p>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Payment Recorded!</h4>
                <p className="text-xs text-slate-400">Database values modified, loading print ledger...</p>
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="space-y-4">
                
                {/* Select student */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Student Account</label>
                  <select
                    id="select-pay-student"
                    value={payStudentId}
                    onChange={(e) => setPayStudentId(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {students.map(s => {
                      const feeObj = fees.find(f => f.studentId === s.id);
                      const isFullyPaid = feeObj ? feeObj.status === 'Paid' : false;
                      return (
                        <option key={s.id} value={s.id} disabled={isFullyPaid}>
                          {s.name} ({s.rollNo}) {isFullyPaid ? '[FULLY PAID]' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Payment Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₹</span>
                    <input
                      id="input-pay-amount"
                      type="number"
                      required
                      min="1"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="Enter amount (e.g. 40000)"
                      className="w-full pl-7 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Amount is allocated to tuition ledgers on submit.</p>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button
                    id="btn-pay-cancel"
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-pay-submit"
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-colors"
                  >
                    Submit Transaction
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

      {/* VIRTUAL LEDGER RECEIPT POPUP */}
      {receiptRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4" id="modal-receipt-view">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative p-6 space-y-6">
            
            <button
              id="btn-close-receipt"
              onClick={() => setReceiptRecord(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 text-slate-400 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Cover */}
            <div className="text-center border-b border-dashed border-slate-200 pb-4 space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">University College Campus</h3>
              <p className="text-[10px] font-mono text-slate-400">OFFICIAL TUITION INVOICE RECEIPT</p>
              <span className="inline-block text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1">
                TRANSACTION CONFIRMED
              </span>
            </div>

            {/* Receipt Items */}
            <div className="space-y-3 text-xs font-sans text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-semibold text-slate-800">{receiptRecord.student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Roll Number:</span>
                <span className="font-mono font-semibold text-slate-800">{receiptRecord.student.rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Degree Program:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{receiptRecord.course.name}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="text-slate-400">Annual Course Fee:</span>
                <span className="font-mono font-semibold text-slate-800">₹{receiptRecord.fee.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold">
                <span className="text-emerald-600 uppercase tracking-wide">Amount Just Paid:</span>
                <span className="font-mono text-emerald-600 text-sm">₹{receiptRecord.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-b border-slate-100 pb-3 flex justify-between">
                <span className="text-slate-400">Total Accumulative Paid:</span>
                <span className="font-mono font-semibold text-slate-800">₹{receiptRecord.fee.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-rose-600">Dues Outstanding:</span>
                <span className="font-mono text-rose-600">₹{(receiptRecord.fee.totalAmount - receiptRecord.fee.paidAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                id="btn-print-receipt"
                onClick={() => alert("Simulating print spooler connection... Receipt printed successfully!")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
              <button
                id="btn-close-receipt-ok"
                onClick={() => setReceiptRecord(null)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors text-center"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
