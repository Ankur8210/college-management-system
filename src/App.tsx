/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  INITIAL_STUDENTS, 
  INITIAL_FACULTY, 
  INITIAL_COURSES, 
  INITIAL_ATTENDANCE, 
  INITIAL_FEES, 
  INITIAL_RESULTS 
} from './data';
import { Student, Faculty, Course, AttendanceRecord, FeeRecord, ResultRecord } from './types';
import PresentationView from './components/PresentationView';
import DashboardView from './components/DashboardView';
import StudentManager from './components/StudentManager';
import FacultyManager from './components/FacultyManager';
import CourseManager from './components/CourseManager';
import AttendanceManager from './components/AttendanceManager';
import FeeManager from './components/FeeManager';
import ResultManager from './components/ResultManager';
import ReportGenerator from './components/ReportGenerator';
import LoginView from './components/LoginView';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import { 
  GraduationCap, 
  BookOpen, 
  Presentation, 
  Award, 
  DollarSign, 
  CalendarCheck, 
  FileText, 
  Users, 
  Home, 
  HelpCircle, 
  Layers, 
  Menu, 
  X,
  Play,
  RotateCcw,
  LogOut
} from 'lucide-react';

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'student' | 'faculty'; record: any } | null>(() => {
    const cached = localStorage.getItem('cms_currentUser');
    return cached ? JSON.parse(cached) : null;
  });

  const handleLogin = (role: 'admin' | 'student' | 'faculty', record: any) => {
    const user = { role, record };
    setCurrentUser(user);
    localStorage.setItem('cms_currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cms_currentUser');
  };

  // Persistence States
  const [students, setStudents] = useState<Student[]>(() => {
    const cached = localStorage.getItem('cms_students');
    return cached ? JSON.parse(cached) : INITIAL_STUDENTS;
  });
  const [faculty, setFaculty] = useState<Faculty[]>(() => {
    const cached = localStorage.getItem('cms_faculty');
    return cached ? JSON.parse(cached) : INITIAL_FACULTY;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const cached = localStorage.getItem('cms_courses');
    return cached ? JSON.parse(cached) : INITIAL_COURSES;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const cached = localStorage.getItem('cms_attendance');
    return cached ? JSON.parse(cached) : INITIAL_ATTENDANCE;
  });
  const [fees, setFees] = useState<FeeRecord[]>(() => {
    const cached = localStorage.getItem('cms_fees');
    return cached ? JSON.parse(cached) : INITIAL_FEES;
  });
  const [results, setResults] = useState<ResultRecord[]>(() => {
    const cached = localStorage.getItem('cms_results');
    return cached ? JSON.parse(cached) : INITIAL_RESULTS;
  });

  // Navigation / Shell States
  const [activeTab, setActiveTab] = useState<'presentation' | 'portal'>('presentation');
  const [activePortalView, setActivePortalView] = useState<'dashboard' | 'students' | 'faculty' | 'courses' | 'attendance' | 'fees' | 'results' | 'reports'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Cache Helpers
  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // State Updates: Students CRUD
  const handleAddStudent = (newS: Omit<Student, 'id'>) => {
    const studentWithId: Student = {
      ...newS,
      id: `s_${Date.now()}`
    };
    const updated = [studentWithId, ...students];
    setStudents(updated);
    saveToLocal('cms_students', updated);

    // Bootstrap corresponding fee balance record
    const courseObj = courses.find(c => c.id === newS.courseId);
    const newFeeRec: FeeRecord = {
      id: `fee_${Date.now()}`,
      studentId: studentWithId.id,
      totalAmount: courseObj ? courseObj.feeAmount : 100000,
      paidAmount: 0,
      status: 'Pending'
    };
    const updatedFees = [newFeeRec, ...fees];
    setFees(updatedFees);
    saveToLocal('cms_fees', updatedFees);
  };

  const handleEditStudent = (editedS: Student) => {
    const updated = students.map(s => s.id === editedS.id ? editedS : s);
    setStudents(updated);
    saveToLocal('cms_students', updated);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveToLocal('cms_students', updated);
  };

  // State Updates: Faculty CRUD
  const handleAddFaculty = (newF: Omit<Faculty, 'id'>) => {
    const facWithId: Faculty = {
      ...newF,
      id: `f_${Date.now()}`
    };
    const updated = [facWithId, ...faculty];
    setFaculty(updated);
    saveToLocal('cms_faculty', updated);
  };

  const handleEditFaculty = (editedF: Faculty) => {
    const updated = faculty.map(f => f.id === editedF.id ? editedF : f);
    setFaculty(updated);
    saveToLocal('cms_faculty', updated);
  };

  const handleDeleteFaculty = (id: string) => {
    const updated = faculty.filter(f => f.id !== id);
    setFaculty(updated);
    saveToLocal('cms_faculty', updated);
  };

  // State Updates: Courses CRUD
  const handleAddCourse = (newC: Omit<Course, 'id'>) => {
    const courseWithId: Course = {
      ...newC,
      id: `c_${Date.now()}`
    };
    const updated = [...courses, courseWithId];
    setCourses(updated);
    saveToLocal('cms_courses', updated);
  };

  const handleEditCourse = (editedC: Course) => {
    const updated = courses.map(c => c.id === editedC.id ? editedC : c);
    setCourses(updated);
    saveToLocal('cms_courses', updated);
  };

  const handleDeleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveToLocal('cms_courses', updated);
  };

  // State Updates: Attendance Save (Multiple students)
  const handleSaveAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    let currentAttendance = [...attendance];
    
    records.forEach(rec => {
      // Find matching index of pre-existing roll for this date and student ID
      const index = currentAttendance.findIndex(a => a.studentId === rec.studentId && a.date === rec.date);
      if (index !== -1) {
        currentAttendance[index] = { ...currentAttendance[index], status: rec.status };
      } else {
        currentAttendance.push({
          ...rec,
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        });
      }
    });

    setAttendance(currentAttendance);
    saveToLocal('cms_attendance', currentAttendance);
  };

  // State Updates: Fees payment collection
  const handleAddPayment = (studentId: string, amount: number) => {
    const updatedFees = fees.map(f => {
      if (f.studentId === studentId) {
        const newPaid = f.paidAmount + amount;
        const newStatus = newPaid >= f.totalAmount ? 'Paid' : 'Partial';
        return {
          ...f,
          paidAmount: newPaid,
          lastPaymentDate: new Date().toISOString().split('T')[0],
          status: newStatus as any
        };
      }
      return f;
    });
    setFees(updatedFees);
    saveToLocal('cms_fees', updatedFees);
  };

  // State Updates: Exam result grading
  const handleAddResult = (newR: Omit<ResultRecord, 'id'>) => {
    // Check if result record for this student/course already exists, update if it does
    const existingIndex = results.findIndex(r => r.studentId === newR.studentId && r.courseId === newR.courseId);
    let updatedResults = [...results];

    if (existingIndex !== -1) {
      updatedResults[existingIndex] = {
        ...updatedResults[existingIndex],
        marks: newR.marks,
        grade: newR.grade,
        semester: newR.semester
      };
    } else {
      updatedResults.unshift({
        ...newR,
        id: `res_${Date.now()}`
      });
    }

    setResults(updatedResults);
    saveToLocal('cms_results', updatedResults);
  };

  const handleDeleteResult = (id: string) => {
    const updated = results.filter(r => r.id !== id);
    setResults(updated);
    saveToLocal('cms_results', updated);
  };

  // Reset Storage to defaults
  const handleResetToDefaults = () => {
    if (confirm("Reset database to clean pre-loaded presentation values? All your custom edits will be reverted.")) {
      localStorage.clear();
      setStudents(INITIAL_STUDENTS);
      setFaculty(INITIAL_FACULTY);
      setCourses(INITIAL_COURSES);
      setAttendance(INITIAL_ATTENDANCE);
      setFees(INITIAL_FEES);
      setResults(INITIAL_RESULTS);
      setCurrentUser(null);
      setActivePortalView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/40 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* 1. TOP GLOBAL SHELL HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
              College Management System
            </h1>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5 uppercase tracking-widest font-mono">
              COMPANION & LIVE DEMO
            </span>
          </div>
        </div>

        {/* Global mode switcher */}
        <div className="hidden md:flex items-center bg-slate-150 p-1 rounded-xl border border-slate-200 bg-slate-100" id="global-nav-tabs">
          <button
            id="btn-global-presentation"
            onClick={() => setActiveTab('presentation')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'presentation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="inline-block w-4 h-4 mr-1.5" />
            Presentation & Viva Prep
          </button>
          <button
            id="btn-global-portal"
            onClick={() => setActiveTab('portal')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'portal'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="inline-block w-4 h-4 mr-1.5" />
            Live Project Demo
          </button>
        </div>

        {/* Reset Database and Session Controls */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <>
              <div className="hidden sm:flex flex-col items-end mr-1 text-right">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                  {currentUser.record.name}
                </span>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full capitalize mt-0.5">
                  {currentUser.role} Account
                </span>
              </div>
              <button
                id="btn-global-logout"
                onClick={handleLogout}
                title="Secure Sign Out"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all shadow-sm bg-white"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            id="btn-global-reset"
            onClick={handleResetToDefaults}
            title="Reset Database Logs to Initial Demo values"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-all shadow-sm bg-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mobile responsive toggle */}
          <button
            id="btn-mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl border border-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE NAV SIDE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm md:hidden flex justify-end">
          <div className="w-72 bg-white h-full p-6 space-y-6 shadow-xl animate-fadeIn relative">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pt-8">
              <h4 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Global Navigation</h4>
              
              <button
                onClick={() => {
                  setActiveTab('presentation');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl flex items-center gap-2 ${
                  activeTab === 'presentation' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600'
                }`}
              >
                <Presentation className="w-4 h-4" /> Presentation & Viva Prep
              </button>

              <button
                onClick={() => {
                  setActiveTab('portal');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl flex items-center gap-2 ${
                  activeTab === 'portal' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600'
                }`}
              >
                <Play className="w-4 h-4" /> Live System Demo
              </button>
            </div>

            {activeTab === 'portal' && (
              <div className="space-y-3 pt-6 border-t border-slate-100">
                {currentUser ? (
                  currentUser.role === 'admin' ? (
                    <>
                      <h4 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Admin Modules</h4>
                      {[
                        { id: 'dashboard', name: 'Dashboard', icon: Home },
                        { id: 'students', name: 'Students', icon: Users },
                        { id: 'faculty', name: 'Faculty', icon: GraduationCap },
                        { id: 'courses', name: 'Courses', icon: Layers },
                        { id: 'attendance', name: 'Attendance', icon: CalendarCheck },
                        { id: 'fees', name: 'Fees Management', icon: DollarSign },
                        { id: 'results', name: 'Result Ledger', icon: Award },
                        { id: 'reports', name: 'Official Reports', icon: FileText }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActivePortalView(item.id as any);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 ${
                              activePortalView === item.id ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" /> {item.name}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                          {currentUser.role} Account
                        </span>
                        <div className="text-xs font-bold text-slate-800 mt-1.5">{currentUser.record.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {currentUser.role === 'student' ? `Roll: ${currentUser.record.rollNo}` : `Emp ID: ${currentUser.record.employeeId}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out Session
                      </button>
                    </div>
                  )
                ) : (
                  <p className="text-[11px] text-slate-400 text-center py-4 italic">
                    Authentication is required to unlock portal panels.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PERSISTENT HELPER PRESENTATION ALERT BANNER */}
      {activeTab === 'presentation' && (
        <div className="bg-blue-600 text-blue-50 py-2.5 px-4 md:px-8 text-xs font-sans font-semibold flex items-center justify-between border-b border-blue-700 shadow-inner">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>Presentation Mode Active: Step-by-Step Viva outline has been structured matching your specified points!</span>
          </div>
          <button
            id="btn-quick-run-demo"
            onClick={() => setActiveTab('portal')}
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-[10px] font-bold text-white transition-colors"
          >
            Launch System Demo →
          </button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row items-stretch" id="applet-workspace">
        
        {/* SIDE BAR LAYOUT FOR LIVE PORTAL DEMO */}
        {activeTab === 'portal' && currentUser?.role === 'admin' && (
          <aside className="hidden md:block w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 flex-col p-6 space-y-6" id="portal-sidebar">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Administration</span>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Control Panel</h3>
            </div>

            {/* Sidebar navigation list */}
            <nav className="space-y-1.5 flex-1" id="sidebar-nav">
              {[
                { id: 'dashboard', name: 'Overview Dashboard', icon: Home },
                { id: 'students', name: 'Student Rosters', icon: Users },
                { id: 'faculty', name: 'Faculty Directory', icon: GraduationCap },
                { id: 'courses', name: 'Curriculum Streams', icon: Layers },
                { id: 'attendance', name: 'Daily Attendance', icon: CalendarCheck },
                { id: 'fees', name: 'Fee Collections', icon: DollarSign },
                { id: 'results', name: 'Exam Gradebook', icon: Award },
                { id: 'reports', name: 'Official Reports', icon: FileText }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activePortalView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-link-${item.id}`}
                    onClick={() => setActivePortalView(item.id as any)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-950/20'
                        : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
              Active Environment: Simulated Local DB
            </div>
          </aside>
        )}

        {/* CONTAINER FOR MODULE VIEWS */}
        <section className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full" id="stage-content">
          
          {/* Active View routers */}
          {activeTab === 'presentation' ? (
            <PresentationView />
          ) : !currentUser ? (
            <LoginView
              students={students}
              faculty={faculty}
              onLogin={handleLogin}
            />
          ) : currentUser.role === 'student' ? (
            <StudentDashboard
              student={currentUser.record}
              courses={courses}
              attendance={attendance}
              fees={fees}
              results={results}
              onAddPayment={handleAddPayment}
            />
          ) : currentUser.role === 'faculty' ? (
            <FacultyDashboard
              faculty={currentUser.record}
              students={students}
              courses={courses}
              attendance={attendance}
              results={results}
              onSaveAttendance={handleSaveAttendance}
              onAddResult={handleAddResult}
              onDeleteResult={handleDeleteResult}
            />
          ) : (
            <div className="space-y-6">
              
              {/* Portal Breadcrumbs banner */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2" id="portal-breadcrumb">
                <span className="cursor-pointer hover:text-slate-600" onClick={() => setActivePortalView('dashboard')}>Portal Shell</span>
                <span>/</span>
                <span className="text-slate-700 capitalize">{activePortalView} panel</span>
              </div>

              {/* Module Content Switch */}
              {activePortalView === 'dashboard' && (
                <DashboardView
                  students={students}
                  faculty={faculty}
                  courses={courses}
                  attendance={attendance}
                  fees={fees}
                  onNavigate={(view) => setActivePortalView(view)}
                />
              )}

              {activePortalView === 'students' && (
                <StudentManager
                  students={students}
                  courses={courses}
                  onAddStudent={handleAddStudent}
                  onEditStudent={handleEditStudent}
                  onDeleteStudent={handleDeleteStudent}
                />
              )}

              {activePortalView === 'faculty' && (
                <FacultyManager
                  faculty={faculty}
                  courses={courses}
                  onAddFaculty={handleAddFaculty}
                  onEditFaculty={handleEditFaculty}
                  onDeleteFaculty={handleDeleteFaculty}
                />
              )}

              {activePortalView === 'courses' && (
                <CourseManager
                  courses={courses}
                  students={students}
                  onAddCourse={handleAddCourse}
                  onEditCourse={handleEditCourse}
                  onDeleteCourse={handleDeleteCourse}
                />
              )}

              {activePortalView === 'attendance' && (
                <AttendanceManager
                  students={students}
                  courses={courses}
                  attendance={attendance}
                  onSaveAttendance={handleSaveAttendance}
                />
              )}

              {activePortalView === 'fees' && (
                <FeeManager
                  students={students}
                  courses={courses}
                  fees={fees}
                  onAddPayment={handleAddPayment}
                />
              )}

              {activePortalView === 'results' && (
                <ResultManager
                  students={students}
                  courses={courses}
                  results={results}
                  onAddResult={handleAddResult}
                  onDeleteResult={handleDeleteResult}
                />
              )}

              {activePortalView === 'reports' && (
                <ReportGenerator
                  students={students}
                  courses={courses}
                  attendance={attendance}
                  fees={fees}
                  results={results}
                />
              )}

            </div>
          )}

        </section>

      </main>

      {/* Global simple footer bar */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 md:px-8 text-center text-[11px] text-slate-400 font-semibold flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <span>© 2026 College Management System Project. Admin Dashboard & Viva Practice Deck.</span>
        <div className="flex gap-4">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => setActiveTab('presentation')}>Presentation Deck</span>
          <span>•</span>
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => { setActiveTab('portal'); if (currentUser?.role === 'admin') { setActivePortalView('dashboard'); } }}>Active System Portal</span>
        </div>
      </footer>

    </div>
  );
}
