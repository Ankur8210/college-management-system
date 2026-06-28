/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Faculty, Course, AttendanceRecord, FeeRecord } from '../types';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  faculty: Faculty[];
  courses: Course[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  onNavigate: (view: 'students' | 'faculty' | 'courses' | 'attendance' | 'fees' | 'results' | 'reports') => void;
}

export default function DashboardView({
  students,
  faculty,
  courses,
  attendance,
  fees,
  onNavigate
}: DashboardViewProps) {
  
  // Calculations
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const totalCourses = courses.length;

  // Average Attendance
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const averageAttendance = totalAttendanceRecords > 0 
    ? Math.round((presentCount / totalAttendanceRecords) * 100) 
    : 85;

  // Fee Collection Rate
  const totalBilled = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const feeCollectionRate = totalBilled > 0 
    ? Math.round((totalCollected / totalBilled) * 100) 
    : 0;

  // Course Enrollment Stats for Custom SVG Bar Chart
  const courseEnrollmentMap: Record<string, number> = {};
  students.forEach(s => {
    const course = courses.find(c => c.id === s.courseId);
    if (course) {
      courseEnrollmentMap[course.name] = (courseEnrollmentMap[course.name] || 0) + 1;
    }
  });

  // Default courses if empty
  const defaultCourses = courses.slice(0, 5).map(c => ({
    name: c.name.replace("B.Tech ", "").replace("Master of ", ""),
    count: courseEnrollmentMap[c.name] || 0
  }));

  const maxEnrollment = Math.max(...defaultCourses.map(d => d.count), 1);

  // Fee collection slices
  const paidCount = fees.filter(f => f.status === 'Paid').length;
  const partialCount = fees.filter(f => f.status === 'Partial').length;
  const pendingCount = fees.filter(f => f.status === 'Pending').length;
  const totalFeeRecords = fees.length || 1;

  const paidPct = Math.round((paidCount / totalFeeRecords) * 100);
  const partialPct = Math.round((partialCount / totalFeeRecords) * 100);
  const pendingPct = Math.round((pendingCount / totalFeeRecords) * 100);

  // Generate Low Attendance Warnings (< 75%)
  const attendanceWarningStudents = students.map(student => {
    const studentRecords = attendance.filter(a => a.studentId === student.id);
    if (studentRecords.length === 0) return { student, pct: 100 };
    const present = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const pct = Math.round((present / studentRecords.length) * 100);
    return { student, pct };
  }).filter(item => item.pct < 75 && item.student.status === 'Active');

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="dashboard-metrics">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Students</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-800">{totalStudents}</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-bold">Enrolled</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Faculty</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-800">{totalFaculty}</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-bold">Professors</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Courses</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-800">{totalCourses}</span>
              <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-full font-bold">Curriculums</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Avg Attendance</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-800">{averageAttendance}%</span>
              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-bold">Monthly</span>
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Fee Collected</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-800">{feeCollectionRate}%</span>
              <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full font-bold">Collected</span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-grid">
        
        {/* Left Panel: Course Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="course-chart-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Course Enrollment Distribution</h4>
              <p className="text-xs text-slate-500">Live student strength enrolled across primary departments.</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" /> Department Stats
            </div>
          </div>

          {/* Custom SVG Responsive Bar Chart */}
          <div className="h-64 flex flex-col justify-between mt-4">
            <div className="flex-1 flex items-end gap-3 md:gap-6 border-b border-slate-100 pb-2 relative">
              
              {/* Backgrid guiding lines */}
              <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 w-full h-0" />
                <div className="border-b border-slate-100 w-full h-0" />
                <div className="border-b border-slate-100 w-full h-0" />
                <div className="border-b border-slate-100 w-full h-0" />
              </div>

              {defaultCourses.map((c, i) => {
                const percentage = (c.count / maxEnrollment) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                    <span className="text-[10px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1.5 py-0.5 rounded shadow mb-1">
                      {c.count} Std
                    </span>
                    <div 
                      style={{ height: `${percentage}%` }} 
                      className="w-full max-w-[48px] bg-blue-600 hover:bg-blue-500 rounded-t-lg transition-all duration-500 shadow-md shadow-blue-100 group-hover:shadow-blue-300 cursor-pointer relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent rounded-t-lg" />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Chart Labels */}
            <div className="flex gap-3 md:gap-6 pt-2">
              {defaultCourses.map((c, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-[10px] font-bold text-slate-600 block truncate" title={c.name}>
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Fee Collection Pie Stats */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="fee-chart-card">
          <div className="mb-4">
            <h4 className="font-bold text-slate-800 text-sm">Fee Payment Breakdown</h4>
            <p className="text-xs text-slate-500">Overview of paid vs outstanding student invoices.</p>
          </div>

          {/* Donut Chart representation */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-36 h-36">
              {/* Complex circular visual using radial borders */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                
                {/* Paid Segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" 
                  strokeDasharray={`${paidPct} ${100 - paidPct}`} 
                  strokeDashoffset="0" 
                />
                
                {/* Partial Segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" 
                  strokeDasharray={`${partialPct} ${100 - partialPct}`} 
                  strokeDashoffset={`-${paidPct}`} 
                />

                {/* Pending Segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="4" 
                  strokeDasharray={`${pendingPct} ${100 - pendingPct}`} 
                  strokeDashoffset={`-${paidPct + partialPct}`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-800 font-sans">{paidPct}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Paid In Full</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100" id="fee-chart-legend">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Fully Paid ({paidCount})</span>
              <span>{paidPct}%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Partial Installment ({partialCount})</span>
              <span>{partialPct}%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Pending Invoice ({pendingCount})</span>
              <span>{pendingPct}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alerts and Action Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-actions-grid">
        
        {/* Left Side: Critical Student Alerts (Attendance & Dues) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Critical Student Attendance Alert</h4>
              <p className="text-xs text-slate-500">Active students currently falling below the 75% required attendance bracket.</p>
            </div>
          </div>

          {attendanceWarningStudents.length > 0 ? (
            <div className="overflow-x-auto" id="dashboard-alerts-table">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Attendance Rate</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendanceWarningStudents.map(({ student, pct }) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 text-xs text-slate-600 font-sans">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{student.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">{student.rollNo}</td>
                      <td className="py-2.5 px-3">{student.department}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600">{pct}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          <AlertTriangle className="w-2.5 h-2.5" /> Defaulter
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All active students maintain &gt;= 75% attendance rate. Excellence achieved!
            </div>
          )}
        </div>

        {/* Right Side: Quick Navigation Cards */}
        <div className="lg:col-span-4 bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">System Navigation Deck</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Quickly bypass sections to manage profiles, take class registers, record payments, and print academic grade reports.
            </p>

            <div className="space-y-2" id="quick-links">
              <button 
                id="link-std-btn"
                onClick={() => onNavigate('students')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
              >
                <span>Manage Student Rosters</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>
              <button 
                id="link-att-btn"
                onClick={() => onNavigate('attendance')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
              >
                <span>Take Today's Attendance Register</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>
              <button 
                id="link-fee-btn"
                onClick={() => onNavigate('fees')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
              >
                <span>Record Fee Collections</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>
              <button 
                id="link-rep-btn"
                onClick={() => onNavigate('reports')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
              >
                <span>Generate Official Reports</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mt-4 text-[10px] text-slate-500 text-center font-mono">
            College Management System v1.0.0
          </div>
        </div>

      </div>
    </div>
  );
}
