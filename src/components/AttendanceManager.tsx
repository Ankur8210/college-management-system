/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Student, Course, AttendanceRecord } from '../types';
import { CalendarCheck, Save, Check, X, AlertCircle, Calendar, Filter } from 'lucide-react';

interface AttendanceManagerProps {
  students: Student[];
  courses: Course[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
}

export default function AttendanceManager({
  students,
  courses,
  attendance,
  onSaveAttendance
}: AttendanceManagerProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Get formatted today's date YYYY-MM-DD
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [tempStatus, setTempStatus] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  // Filter students active in the course
  const activeStudentsInCourse = students.filter(s => s.courseId === selectedCourseId && s.status === 'Active');

  // Load existing records or set defaults
  const handleLoadClass = () => {
    const freshStatus: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    activeStudentsInCourse.forEach(s => {
      const match = attendance.find(a => a.studentId === s.id && a.date === selectedDate);
      freshStatus[s.id] = match ? match.status : 'Present'; // Default to present
    });
    setTempStatus(freshStatus);
    setIsSavedNotify(false);
  };

  // Run on initial load and state changes
  useState(() => {
    handleLoadClass();
  });

  const handleToggleStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setTempStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsSavedNotify(false);
  };

  const handleMarkAll = (status: 'Present' | 'Absent' | 'Late') => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    activeStudentsInCourse.forEach(s => {
      updated[s.id] = status;
    });
    setTempStatus(updated);
  };

  const handleSave = () => {
    const recordsToSave = activeStudentsInCourse.map(s => ({
      studentId: s.id,
      date: selectedDate,
      status: tempStatus[s.id] || 'Present'
    }));
    onSaveAttendance(recordsToSave);
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 3000);
  };

  // Calculate student overall attendance percentage helper
  const getOverallAttendancePct = (studentId: string) => {
    const studentRecords = attendance.filter(a => a.studentId === studentId);
    if (studentRecords.length === 0) return 100;
    const presentCount = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    return Math.round((presentCount / studentRecords.length) * 100);
  };

  return (
    <div className="space-y-6" id="attendance-manager-container">
      {/* Header and trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4" id="attendance-manager-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Class Attendance Register</h2>
          <p className="text-xs text-slate-500">Record daily class attendance, calculate overall terms percentages, and check default rates.</p>
        </div>
        
        {/* Bulk tools */}
        <div className="flex items-center gap-2">
          <button
            id="btn-mark-present-all"
            onClick={() => handleMarkAll('Present')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg text-[11px] font-bold border border-slate-200 transition-colors"
          >
            Mark All Present
          </button>
          <button
            id="btn-mark-absent-all"
            onClick={() => handleMarkAll('Absent')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-[11px] font-bold border border-slate-200 transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Class Selector Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm" id="attendance-selectors">
        
        {/* Date Selector */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="attendance-date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              // Trigger reload
              setTimeout(() => handleLoadClass(), 50);
            }}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-mono font-bold text-slate-700"
          />
        </div>

        {/* Course stream selector */}
        <div className="md:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="attendance-course-select"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              // Trigger reload
              setTimeout(() => handleLoadClass(), 50);
            }}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-medium text-slate-600"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Load button */}
        <div className="md:col-span-3">
          <button
            id="btn-load-class"
            onClick={handleLoadClass}
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow"
          >
            Load Class Roster
          </button>
        </div>

      </div>

      {/* Attendance Roster list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="attendance-roster">
        {activeStudentsInCourse.length > 0 ? (
          <div>
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Registering <strong className="text-slate-800">{activeStudentsInCourse.length}</strong> active students in {courses.find(c => c.id === selectedCourseId)?.name}
              </span>
              <span className="text-xs text-slate-400 font-medium">Selected Date: <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-150">{selectedDate}</span></span>
            </div>

            <div className="divide-y divide-slate-100">
              {activeStudentsInCourse.map(s => {
                const currentVal = tempStatus[s.id] || 'Present';
                const overallPct = getOverallAttendancePct(s.id);
                
                return (
                  <div key={s.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Bio details */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{s.name}</h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400 font-sans mt-0.5">
                        <span className="font-mono font-bold text-slate-500">{s.rollNo}</span>
                        <span>•</span>
                        <span>{s.semester}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-500">Term Attendance: <strong className={`font-bold font-mono ${overallPct < 75 ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100' : 'text-slate-700'}`}>{overallPct}%</strong></span>
                      </div>
                    </div>

                    {/* Radio state selectors */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center" id={`status-selector-${s.id}`}>
                      {/* Present */}
                      <button
                        id={`btn-mark-present-${s.id}`}
                        onClick={() => handleToggleStatus(s.id, 'Present')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          currentVal === 'Present'
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" /> Present
                      </button>

                      {/* Late */}
                      <button
                        id={`btn-mark-late-${s.id}`}
                        onClick={() => handleToggleStatus(s.id, 'Late')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          currentVal === 'Late'
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Late
                      </button>

                      {/* Absent */}
                      <button
                        id={`btn-mark-absent-${s.id}`}
                        onClick={() => handleToggleStatus(s.id, 'Absent')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          currentVal === 'Absent'
                            ? 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" /> Absent
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Save panel footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-sans">
                {isSavedNotify ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded-full p-0.5" /> Register saved and synchronized successfully to database logs.
                  </span>
                ) : (
                  <span>Unsaved changes are highlighted. Click Save Register to commit.</span>
                )}
              </div>
              <button
                id="btn-save-attendance"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
              >
                <Save className="w-4 h-4" /> Save Attendance Register
              </button>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400 text-xs">
            No active students enrolled in the selected course to take register.
          </div>
        )}
      </div>
    </div>
  );
}
