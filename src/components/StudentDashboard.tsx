import React, { useState } from 'react';
import { Student, Course, AttendanceRecord, FeeRecord, ResultRecord } from '../types';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Award, 
  BookOpen, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  AlertTriangle,
  CreditCard,
  CheckCircle,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  courses: Course[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  results: ResultRecord[];
  onAddPayment: (studentId: string, amount: number) => void;
}

export default function StudentDashboard({
  student,
  courses,
  attendance,
  fees,
  results,
  onAddPayment
}: StudentDashboardProps) {
  // Modal state for payment
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'success'>('input');
  const [receiptNo, setReceiptNo] = useState('');

  // Lookups
  const studentCourse = courses.find((c) => c.id === student.courseId);
  const studentFee = fees.find((f) => f.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentResults = results.filter((r) => r.studentId === student.id);

  // Attendance metrics
  const totalClasses = studentAttendance.length;
  const presentClasses = studentAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  // Grade point helper
  const getGradePoints = (grade: string): number => {
    switch (grade.toUpperCase()) {
      case 'A+': return 10;
      case 'A': return 9;
      case 'B+': return 8;
      case 'B': return 7;
      case 'C': return 6;
      case 'D': return 5;
      default: return 4;
    }
  };

  // GPA calculation
  const totalCredits = studentResults.reduce((acc, curr) => {
    const courseObj = courses.find((c) => c.id === curr.courseId);
    return acc + (courseObj ? 8 : 4); // default credit weight
  }, 0);

  const weightedPoints = studentResults.reduce((acc, curr) => {
    const courseObj = courses.find((c) => c.id === curr.courseId);
    const credits = courseObj ? 8 : 4;
    return acc + getGradePoints(curr.grade) * credits;
  }, 0);

  const calculatedSGPA = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : 'N/A';

  // Fee calculation
  const totalFee = studentFee ? studentFee.totalAmount : (studentCourse ? studentCourse.feeAmount : 100000);
  const paidFee = studentFee ? studentFee.paidAmount : 0;
  const balanceDue = totalFee - paidFee;

  const handleOpenPayment = () => {
    setPaymentAmount(balanceDue.toString());
    setCardNumber('4111 2222 3333 4444');
    setCardExpiry('12/28');
    setCardCVV('321');
    setPaymentStep('input');
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(paymentAmount);
    if (!amountNum || amountNum <= 0 || amountNum > balanceDue) {
      alert(`Invalid payment amount. Range: ₹1 to ₹${balanceDue.toLocaleString('en-IN')}`);
      return;
    }

    setPaymentStep('processing');
    setTimeout(() => {
      onAddPayment(student.id, amountNum);
      setReceiptNo(`TXN_${Date.now().toString().slice(-8)}`);
      setPaymentStep('success');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1. STUDENT SUMMARY BANNER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md border border-blue-500/30">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">{student.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                student.status === 'Active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {student.status} Student
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono mt-1">
              Roll No: <span className="text-blue-400 font-bold">{student.rollNo}</span> | Year: {student.joinedYear}
            </p>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {studentCourse?.name || 'Department Stream'} • {student.semester}
            </p>
          </div>
        </div>

        {/* Dynamic GPA badge */}
        <div className="bg-slate-800 border border-slate-700/60 p-4 rounded-xl flex items-center gap-3 relative z-10 min-w-[140px] shadow-sm">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SGPA Rating</span>
            <span className="text-xl font-extrabold text-white font-mono">{calculatedSGPA}</span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC SCORE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Attendance Register</h4>
            </div>
            <span className={`text-xs font-bold ${attPercentage < 75 ? 'text-rose-600 bg-rose-50 border border-rose-100' : 'text-emerald-700 bg-emerald-50 border border-emerald-100'} px-2 py-0.5 rounded-full`}>
              {attPercentage}% Presence
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Classes Attended</span>
              <span className="font-mono text-slate-800">{presentClasses} / {totalClasses} Sessions</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${attPercentage}%` }} 
                className={`h-full transition-all duration-500 ${attPercentage < 75 ? 'bg-rose-500' : 'bg-blue-600'}`} 
              />
            </div>
          </div>

          {attPercentage < 75 ? (
            <div className="flex items-start gap-2 p-2.5 bg-rose-50 text-rose-700 text-[10px] font-semibold rounded-lg border border-rose-100 leading-normal">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>Critical: Attendance is below 75%. You might face hall-ticket shortage during semester final assessments.</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-2.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-lg border border-emerald-100 leading-normal">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>Excellent: Your presence profile matches the criteria. Keep attending regular classrooms!</span>
            </div>
          )}
        </div>

        {/* Tuition Fee Balance Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Tuition Invoices</h4>
            </div>
            <span className={`text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${
              balanceDue === 0 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {balanceDue === 0 ? 'Fully Settled' : 'Dues Outstanding'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Paid Amount:</span>
              <span className="font-mono text-emerald-600">₹{paidFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Remaining Balance Dues:</span>
              <span className={`font-mono font-bold ${balanceDue > 0 ? 'text-rose-600 text-base' : 'text-slate-400'}`}>
                ₹{balanceDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {balanceDue > 0 ? (
            <button
              id="student-pay-dues-btn"
              onClick={handleOpenPayment}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Outstanding Dues Online</span>
            </button>
          ) : (
            <div className="py-2.5 text-center bg-slate-50 text-slate-500 rounded-xl border border-slate-100 text-xs font-semibold">
              ✓ All fees paid for this semester
            </div>
          )}
        </div>

        {/* Contact/Support Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Contact Credentials</h4>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 text-slate-400" />
              <span>+91 {student.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Active Course Credits: <strong className="text-slate-700">{studentCourse?.credits || 160} Cr</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. TRANSCRIPT & ATTENDANCE LOG SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Academic Marks / Grades Sheet */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Graded Subject Ledger</h3>
                <p className="text-[11px] text-slate-400">Official semester transcripts & marksheets.</p>
              </div>
            </div>
          </div>

          {studentResults.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No published gradebook logs found in system database for your ID.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="py-2.5">Course Code</th>
                    <th className="py-2.5">Course Stream Name</th>
                    <th className="py-2.5">Semester</th>
                    <th className="py-2.5 text-right">Score Marks</th>
                    <th className="py-2.5 text-right">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                  {studentResults.map((res) => {
                    const cObj = courses.find((c) => c.id === res.courseId);
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono text-slate-700">{cObj?.code || 'GEN-100'}</td>
                        <td className="py-3 text-slate-900">{cObj?.name || 'Assigned Stream'}</td>
                        <td className="py-3 text-slate-400">{res.semester}</td>
                        <td className="py-3 text-right font-mono text-slate-800">{res.marks}%</td>
                        <td className="py-3 text-right">
                          <span className={`inline-block font-mono font-extrabold px-2 py-0.5 rounded text-[11px] ${
                            res.grade.startsWith('A') 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                              : 'bg-blue-50 text-blue-700 border border-blue-150'
                          }`}>
                            {res.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Attendance Days Log */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Classroom Presence Logs</h3>
            <span className="text-[10px] text-slate-400 font-mono font-bold">Latest 5 days</span>
          </div>

          {studentAttendance.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-xs font-semibold">No recent roll logs taken.</p>
          ) : (
            <div className="space-y-3">
              {studentAttendance.slice(-5).reverse().map((att) => (
                <div key={att.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="font-mono text-slate-600 font-semibold">{att.date}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    att.status === 'Present' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : att.status === 'Late'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= PAYMENT GATEWAY SIMULATION MODAL ================= */}
      {isPayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-scaleUp">
            
            {/* CLOSE BUTTON */}
            {paymentStep !== 'processing' && (
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold p-1 bg-slate-50 hover:bg-slate-100 rounded-full"
              >
                ✕
              </button>
            )}

            {/* SCREEN 1: FORM INPUT */}
            {paymentStep === 'input' && (
              <form onSubmit={handleProcessPayment} className="space-y-5">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg">Secure Institutional Gateway</h3>
                  <p className="text-xs text-slate-500">
                    Your balance due is <span className="text-rose-600 font-bold font-mono">₹{balanceDue.toLocaleString('en-IN')}</span>. Enter amount and card details.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Payment Amount (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        required
                        max={balanceDue}
                        min="1"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full pl-7 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Dummy Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        CVV Code
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="321"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Authorize Net Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Secured by 256-bit bank level SSL mock authorization.
                  </p>
                </div>
              </form>
            )}

            {/* SCREEN 2: PROCESSING */}
            {paymentStep === 'processing' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 border-4 border-t-blue-600 border-slate-100 rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">Contacting Core Banking Server...</h4>
                  <p className="text-xs text-slate-500 mt-1">Please do not refresh or close the browser tab.</p>
                </div>
              </div>
            )}

            {/* SCREEN 3: SUCCESS */}
            {paymentStep === 'success' && (
              <div className="py-6 text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-base">Transaction Successful!</h4>
                  <p className="text-xs text-slate-500">Your tuition dues ledger has been instantly synchronized.</p>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-left text-xs font-mono text-slate-600 space-y-1.5">
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5 mb-1.5">
                    <span className="font-sans font-bold text-slate-700">Receipt Invoice</span>
                    <span className="font-bold text-blue-600">{receiptNo}</span>
                  </div>
                  <div>Student Name: <span className="text-slate-800 font-sans font-bold">{student.name}</span></div>
                  <div>Roll Number: <span className="text-slate-800 font-sans font-bold">{student.rollNo}</span></div>
                  <div>Amount Authorized: <span className="text-emerald-600 font-bold">₹{parseInt(paymentAmount).toLocaleString('en-IN')}.00</span></div>
                  <div>Gateway Vendor: <span className="text-slate-400">SBI InstiPay Express</span></div>
                </div>

                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
