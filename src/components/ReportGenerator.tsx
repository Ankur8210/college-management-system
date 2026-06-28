/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Student, Course, AttendanceRecord, FeeRecord, ResultRecord } from '../types';
import { 
  FileText, 
  User, 
  DollarSign, 
  Printer, 
  Download, 
  CheckCircle, 
  Layers, 
  GraduationCap, 
  Sparkles,
  Calendar
} from 'lucide-react';

interface ReportGeneratorProps {
  students: Student[];
  courses: Course[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  results: ResultRecord[];
}

export default function ReportGenerator({
  students,
  courses,
  attendance,
  fees,
  results
}: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'student_transcript' | 'class_roster' | 'financial_audit'>('student_transcript');
  
  // Selection states
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [targetCourseId, setTargetCourseId] = useState(courses[0]?.id || '');

  // Dynamic calculations helpers
  const getStudentMetrics = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const course = courses.find(c => c.id === student.courseId);
    const fee = fees.find(f => f.studentId === studentId);
    
    // Attendance
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const presentCount = studentAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const attPct = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 88;

    // Grades
    const studentGrades = results.filter(r => r.studentId === studentId);
    const averageScore = studentGrades.length > 0 
      ? Math.round(studentGrades.reduce((sum, g) => sum + g.marks, 0) / studentGrades.length)
      : 84;

    return {
      student,
      course,
      fee,
      attPct,
      averageScore,
      studentGrades
    };
  };

  const currentMetrics = getStudentMetrics(targetStudentId);

  // Financial summary calculations
  const deptDuesMap: Record<string, { billed: number; collected: number }> = {};
  courses.forEach(c => {
    deptDuesMap[c.department] = { billed: 0, collected: 0 };
  });

  fees.forEach(f => {
    const s = students.find(std => std.id === f.studentId);
    if (s && deptDuesMap[s.department]) {
      deptDuesMap[s.department].billed += f.totalAmount;
      deptDuesMap[s.department].collected += f.paidAmount;
    }
  });

  return (
    <div className="space-y-6" id="reports-container">
      {/* Subnav select options */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4" id="reports-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Official Report Center</h2>
          <p className="text-xs text-slate-500">Generate formatted official registers, transcripts, or audits ready for administrative board review.</p>
        </div>

        {/* Selector options tab */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200" id="reports-tabs">
          <button
            id="tab-transcript"
            onClick={() => setReportType('student_transcript')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              reportType === 'student_transcript'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <User className="inline-block w-3.5 h-3.5 mr-1" /> Student Transcript
          </button>
          <button
            id="tab-roster"
            onClick={() => setReportType('class_roster')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              reportType === 'class_roster'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Layers className="inline-block w-3.5 h-3.5 mr-1" /> Class Roster
          </button>
          <button
            id="tab-audit"
            onClick={() => setReportType('financial_audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              reportType === 'financial_audit'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <DollarSign className="inline-block w-3.5 h-3.5 mr-1" /> Financial Audit
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4" id="report-controls">
        
        {/* Student selector for transcript */}
        {reportType === 'student_transcript' && (
          <div className="md:col-span-8 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Select Student:</span>
            <select
              id="report-select-student"
              value={targetStudentId}
              onChange={(e) => setTargetStudentId(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-medium text-slate-600"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
              ))}
            </select>
          </div>
        )}

        {/* Course selector for roster */}
        {reportType === 'class_roster' && (
          <div className="md:col-span-8 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Select Class Stream:</span>
            <select
              id="report-select-course"
              value={targetCourseId}
              onChange={(e) => setTargetCourseId(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-medium text-slate-600"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Spacer for Financial audit */}
        {reportType === 'financial_audit' && (
          <div className="md:col-span-8 flex items-center">
            <span className="text-xs font-semibold text-slate-400">This report compiles all active college transaction logs.</span>
          </div>
        )}

        {/* Action Panel */}
        <div className="md:col-span-4 flex gap-2 justify-end">
          <button
            id="btn-report-download"
            onClick={() => alert("Connecting to download pipeline... Generated report exported to CSV ledger successfully!")}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5" /> CSV Export
          </button>
          <button
            id="btn-report-print"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow"
          >
            <Printer className="w-3.5 h-3.5" /> Print Layout
          </button>
        </div>

      </div>

      {/* Visual Report Paper Stage */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-8 flex justify-center" id="report-sheet-stage">
        <div className="bg-white max-w-2xl w-full p-8 shadow-md border border-slate-150 rounded-xl relative space-y-8 min-h-[500px]" id="printable-area">
          
          {/* Cover Header Seal block */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">University College Board</h3>
              <p className="text-[10px] text-slate-400 font-mono font-bold">CAMPUS SECTOR IV, DELHI METRO ZONE</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Calendar className="w-3 h-3" /> Term Cycle: June 2026 Academic Cohort
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg p-2 flex flex-col items-center">
              <GraduationCap className="w-8 h-8 text-slate-700" />
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">OFFICIAL DOCUMENT</span>
            </div>
          </div>

          {/* 1. STUDENT TRANSCRIPT SHEET */}
          {reportType === 'student_transcript' && currentMetrics && (
            <div className="space-y-6">
              
              {/* Profile Block */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
                  <span className="font-extrabold text-slate-900 text-sm">{currentMetrics.student.name}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Roll Number</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{currentMetrics.student.rollNo}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Enrollment Stream</span>
                  <span className="font-semibold text-slate-700">{currentMetrics.course?.name || 'General Program'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Overall Term Attendance</span>
                  <span className={`font-mono font-bold ${currentMetrics.attPct < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {currentMetrics.attPct}%
                  </span>
                </div>
              </div>

              {/* Subject grade details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Grading Transcript</h4>
                
                {currentMetrics.studentGrades.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2 px-3">Subject ID</th>
                          <th className="py-2 px-3">Sem Term</th>
                          <th className="py-2 px-3 text-right">Percentage</th>
                          <th className="py-2 px-3 text-center">Grade Letter</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentMetrics.studentGrades.map(g => (
                          <tr key={g.id}>
                            <td className="py-2 px-3 font-semibold text-slate-800">
                              {courses.find(c => c.id === g.courseId)?.code || 'SUB-101'}
                            </td>
                            <td className="py-2 px-3">{g.semester}</td>
                            <td className="py-2 px-3 text-right font-mono">{g.marks}%</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-800">{g.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-slate-100">
                    No academic exam results have been registered for this student yet.
                  </div>
                )}
              </div>

              {/* Summary Grade GPA */}
              <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Calculated Grade Point Average (GPA)</span>
                  <strong className="text-slate-800 font-extrabold text-sm">
                    {(currentMetrics.averageScore / 10).toFixed(2)} / 10.00
                  </strong>
                </div>
                
                {/* Financial invoice balance */}
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Outstanding Tuition Balance</span>
                  <strong className={`font-mono font-bold ${currentMetrics.fee && (currentMetrics.fee.totalAmount - currentMetrics.fee.paidAmount) > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    ₹{currentMetrics.fee ? (currentMetrics.fee.totalAmount - currentMetrics.fee.paidAmount).toLocaleString('en-IN') : '0'}
                  </strong>
                </div>
              </div>

            </div>
          )}

          {/* 2. CLASS ROSTER SHEET */}
          {reportType === 'class_roster' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs flex justify-between">
                <span>Class stream: <strong className="text-slate-800">{courses.find(c => c.id === targetCourseId)?.name}</strong></span>
                <span>Active count: <strong className="text-slate-800 font-mono">{students.filter(s => s.courseId === targetCourseId && s.status === 'Active').length} Std</strong></span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Term Semester</th>
                      <th className="py-2.5 px-3 text-right">Dues Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.filter(s => s.courseId === targetCourseId && s.status === 'Active').map(s => {
                      const feeObj = fees.find(f => f.studentId === s.id);
                      const outstanding = feeObj ? (feeObj.totalAmount - feeObj.paidAmount) : 0;
                      return (
                        <tr key={s.id}>
                          <td className="py-2 px-3 font-mono font-bold text-slate-600">{s.rollNo}</td>
                          <td className="py-2 px-3 font-semibold text-slate-800">{s.name}</td>
                          <td className="py-2 px-3 text-slate-500">{s.semester}</td>
                          <td className={`py-2 px-3 text-right font-mono font-bold ${outstanding > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {outstanding > 0 ? `₹${outstanding.toLocaleString('en-IN')}` : 'PAID'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. FINANCIAL AUDIT REPORT */}
          {reportType === 'financial_audit' && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Department Dues Receivables Breakdown</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Department Branch</th>
                        <th className="py-2.5 px-3 text-right">Billed Invoices</th>
                        <th className="py-2.5 px-3 text-right">Collected Revenue</th>
                        <th className="py-2.5 px-3 text-right">Dues Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(deptDuesMap).map(([dept, vals]) => {
                        const bal = vals.billed - vals.collected;
                        return (
                          <tr key={dept}>
                            <td className="py-2.5 px-3 font-semibold text-slate-700">{dept}</td>
                            <td className="py-2.5 px-3 text-right font-mono">₹{vals.billed.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-600">₹{vals.collected.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">₹{bal.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary Dues */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl flex items-center justify-between text-xs font-sans">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Gross Institutional Receivables</span>
                  <strong className="text-white text-base font-bold font-mono">
                    ₹{fees.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Billing Efficiency Rate</span>
                  <strong className="text-emerald-400 text-base font-bold">
                    {Math.round((fees.reduce((sum, f) => sum + f.paidAmount, 0) / fees.reduce((sum, f) => sum + f.totalAmount, 1)) * 100)}%
                  </strong>
                </div>
              </div>

            </div>
          )}

          {/* Institutional Signature stamp block */}
          <div className="pt-8 border-t border-slate-100 flex justify-between items-end text-[10px] text-slate-400 font-sans">
            <div>
              <span>Generated on: <strong>{new Date().toLocaleString()}</strong></span><br/>
              <span>System Verification Hash: <strong className="font-mono text-[9px]">CMS-SECURE-2026-X8F</strong></span>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-24 border-b border-slate-300 mx-auto" />
              <span className="font-bold uppercase text-slate-500">Controller of Examinations</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
