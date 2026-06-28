import React, { useState, useEffect } from 'react';
import { Faculty, Student, Course, AttendanceRecord, ResultRecord } from '../types';
import { 
  GraduationCap, 
  CalendarCheck, 
  Award, 
  BookOpen, 
  Users, 
  Check, 
  Plus, 
  CheckCircle, 
  Save, 
  Phone, 
  Mail, 
  Trash2, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface FacultyDashboardProps {
  faculty: Faculty;
  students: Student[];
  courses: Course[];
  attendance: AttendanceRecord[];
  results: ResultRecord[];
  onSaveAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  onAddResult: (newR: Omit<ResultRecord, 'id'>) => void;
  onDeleteResult: (id: string) => void;
}

export default function FacultyDashboard({
  faculty,
  students,
  courses,
  attendance,
  results,
  onSaveAttendance,
  onAddResult,
  onDeleteResult
}: FacultyDashboardProps) {
  // Filter courses assigned to this faculty member
  const assignedCourses = courses.filter((c) => faculty.courseIds.includes(c.id));
  const [selectedCourseId, setSelectedCourseId] = useState(assignedCourses[0]?.id || '');

  // 1. Attendance module states
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [attendanceSavedSuccess, setAttendanceSavedSuccess] = useState(false);

  // 2. Result grading states
  const [gradingStudentId, setGradingStudentId] = useState('');
  const [gradingMarks, setGradingMarks] = useState('');
  const [gradingSemester, setGradingSemester] = useState('Semester 4');
  const [isGradingFormOpen, setIsGradingFormOpen] = useState(false);

  // Filter students enrolled in the currently selected course
  const courseStudents = students.filter((s) => s.courseId === selectedCourseId && s.status === 'Active');

  // Trigger reloading student rolls when course changes
  useEffect(() => {
    if (selectedCourseId) {
      const initialMap: Record<string, 'Present' | 'Absent' | 'Late'> = {};
      courseStudents.forEach((st) => {
        // Pre-populate with existing attendance if already saved for this date
        const match = attendance.find((a) => a.studentId === st.id && a.date === attendanceDate);
        initialMap[st.id] = match ? match.status : 'Present';
      });
      setAttendanceStatuses(initialMap);
      setAttendanceSavedSuccess(false);
    }
  }, [selectedCourseId, attendanceDate, students, attendance]);

  // Bulk set attendance status
  const handleMarkAll = (status: 'Present' | 'Absent' | 'Late') => {
    const updated = { ...attendanceStatuses };
    courseStudents.forEach((st) => {
      updated[st.id] = status;
    });
    setAttendanceStatuses(updated);
  };

  const handleSingleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceStatuses({
      ...attendanceStatuses,
      [studentId]: status
    });
  };

  // Submit attendance register
  const handleSaveAttendanceRegister = () => {
    const recordsToSave = courseStudents.map((st) => ({
      studentId: st.id,
      date: attendanceDate,
      status: attendanceStatuses[st.id] || 'Present'
    }));

    onSaveAttendance(recordsToSave);
    setAttendanceSavedSuccess(true);
    setTimeout(() => setAttendanceSavedSuccess(false), 4000);
  };

  // Grade compilation helper
  const compileLetterGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
  };

  // Open grading modal
  const handleOpenGrading = (studentId: string) => {
    setGradingStudentId(studentId);
    // Fetch pre-existing marks if any
    const match = results.find((r) => r.studentId === studentId && r.courseId === selectedCourseId);
    setGradingMarks(match ? match.marks.toString() : '');
    setGradingSemester(students.find((s) => s.id === studentId)?.semester || 'Semester 4');
    setIsGradingFormOpen(true);
  };

  // Submit student grades
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const marksNum = parseInt(gradingMarks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      alert('Please enter valid percentage score marks (0 to 100).');
      return;
    }

    onAddResult({
      studentId: gradingStudentId,
      courseId: selectedCourseId,
      marks: marksNum,
      grade: compileLetterGrade(marksNum),
      semester: gradingSemester
    });

    setIsGradingFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. WELCOME PROFILE CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md border border-blue-500/30">
            {faculty.name.charAt(4) || faculty.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">{faculty.name}</h2>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold">
                {faculty.designation}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono mt-1">
              Employee ID: <span className="text-blue-400 font-bold">{faculty.employeeId}</span> | Dept: {faculty.department}
            </p>
            <div className="flex items-center gap-4 mt-2 text-slate-400 text-xs font-medium">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {faculty.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> +91 {faculty.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 p-4 rounded-xl flex items-center gap-3 relative z-10 min-w-[150px] shadow-sm">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">Streams Assigned</span>
            <span className="text-xl font-extrabold text-white font-mono">{assignedCourses.length} Courses</span>
          </div>
        </div>
      </div>

      {/* 2. COURSE STREAM SWITCHER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Classroom Workspace</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Toggle streams below to manage students enrolled under your faculty.</p>
        </div>
        <div className="w-full sm:w-auto">
          <select
            id="faculty-course-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-80 py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-bold text-slate-700"
          >
            {assignedCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. WORKSPACE MODULES (ATTENDANCE & MARKS SHEET SIDE BY SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ATTENDANCE SECTION */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Classroom Attendance Register</h3>
                <p className="text-[11px] text-slate-400">Mark daily student presence logs.</p>
              </div>
            </div>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-2 py-1 text-xs border border-slate-200 rounded bg-slate-50 font-mono font-bold text-slate-700 focus:outline-none"
            />
          </div>

          {/* BULK TOOLBAR */}
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl text-[10px] font-bold text-slate-500">
            <span>Bulk Roll-Call Helpers:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('Present')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('Absent')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-rose-700 hover:bg-rose-50 transition-colors"
              >
                All Absent
              </button>
            </div>
          </div>

          {courseStudents.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs font-semibold">No students active in this course.</p>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {courseStudents.map((st) => {
                const currentStatus = attendanceStatuses[st.id] || 'Present';
                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs font-semibold"
                  >
                    <div>
                      <div className="text-slate-800 font-bold">{st.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">Roll: {st.rollNo}</div>
                    </div>

                    <div className="flex gap-1.5">
                      {(['Present', 'Absent', 'Late'] as const).map((stType) => (
                        <button
                          key={stType}
                          type="button"
                          onClick={() => handleSingleStatusChange(st.id, stType)}
                          className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                            currentStatus === stType
                              ? stType === 'Present'
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200'
                                : stType === 'Late'
                                ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200'
                                : 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-200'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {stType}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          {courseStudents.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {attendanceSavedSuccess && (
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 bg-emerald-100 text-emerald-700 rounded-full p-0.5" /> Registers synchronized to DB logs.
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveAttendanceRegister}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance</span>
              </button>
            </div>
          )}
        </div>

        {/* GRADING / EXAM MARKS SECTION */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Grading Ledger & Marksheet</h3>
                <p className="text-[11px] text-slate-400">Award exam marks & grades for this course.</p>
              </div>
            </div>
          </div>

          {courseStudents.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs font-semibold">No students active in this course.</p>
          ) : (
            <div className="space-y-2 max-h-[430px] overflow-y-auto pr-1">
              {courseStudents.map((st) => {
                // Find student result for this active selected course
                const studentRes = results.find((r) => r.studentId === st.id && r.courseId === selectedCourseId);
                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs font-semibold"
                  >
                    <div>
                      <div className="text-slate-800 font-bold">{st.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">Roll No: {st.rollNo}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      {studentRes ? (
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-extrabold text-slate-800">{studentRes.marks}%</span>
                          <span className="ml-2 font-mono font-black text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                            {studentRes.grade}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Not Graded Yet</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenGrading(st.id)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg border border-blue-100/50 transition-colors"
                        title="Enter / Adjust student grade scores"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ================= EDIT / ASSIGN GRADE POPUP MODAL ================= */}
      {isGradingFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-xl animate-scaleUp relative">
            <button
              onClick={() => setIsGradingFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Submit Exam Score</h3>
                  <p className="text-[11px] text-slate-400">Student: {students.find(s => s.id === gradingStudentId)?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Assess Semester Term
                </label>
                <select
                  required
                  value={gradingSemester}
                  onChange={(e) => setGradingSemester(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Percentage Marks (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradingMarks}
                  onChange={(e) => setGradingMarks(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                />
              </div>

              {gradingMarks && (
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-xs font-semibold text-slate-600">
                  Auto-compiled Grade: <strong className="text-blue-600 font-mono text-sm ml-1">{compileLetterGrade(parseInt(gradingMarks) || 0)}</strong>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGradingFormOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors"
                >
                  Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
