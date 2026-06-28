/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Student, Course, ResultRecord } from '../types';
import { Plus, Search, Trash2, Edit, X, Award, Percent, ChevronRight, BarChart } from 'lucide-react';

interface ResultManagerProps {
  students: Student[];
  courses: Course[];
  results: ResultRecord[];
  onAddResult: (record: Omit<ResultRecord, 'id'>) => void;
  onDeleteResult: (id: string) => void;
}

export default function ResultManager({
  students,
  courses,
  results,
  onAddResult,
  onDeleteResult
}: ResultManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');

  // New Grade Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [marksString, setMarksString] = useState('');
  const [semester, setSemester] = useState('Semester 3');

  const handleOpenForm = () => {
    setSelectedStudentId(students[0]?.id || '');
    setSelectedCourseId(courses[0]?.id || '');
    setMarksString('');
    setSemester('Semester 3');
    setIsFormOpen(true);
  };

  // Automated Grade calculator helper
  const computeGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const marks = parseInt(marksString);
    if (!selectedStudentId || !selectedCourseId || isNaN(marks) || marks < 0 || marks > 100) return;

    onAddResult({
      studentId: selectedStudentId,
      courseId: selectedCourseId,
      marks,
      grade: computeGrade(marks),
      semester
    });

    setIsFormOpen(false);
    setMarksString('');
  };

  // Compile full record
  const resultCardList = results.map(rec => {
    const student = students.find(s => s.id === rec.studentId);
    const course = courses.find(c => c.id === rec.courseId);
    return {
      rec,
      student,
      course
    };
  });

  const filteredResults = resultCardList.filter(item => {
    const matchesSearch = item.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.student?.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'All' || item.rec.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // Calculate grade distribution metrics
  const gradeCounts: Record<string, number> = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'F': 0 };
  filteredResults.forEach(item => {
    const gr = item.rec.grade;
    if (gradeCounts[gr] !== undefined) {
      gradeCounts[gr] += 1;
    }
  });

  const totalFilteredResults = filteredResults.length || 1;
  const averageClassMark = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((sum, item) => sum + item.rec.marks, 0) / filteredResults.length)
    : 82;

  return (
    <div className="space-y-6" id="result-manager-container">
      {/* High level grading summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="result-widgets">
        
        {/* Metric panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Class Grade Summary</h4>
            </div>

            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-slate-800">{averageClassMark}%</span>
              <p className="text-xs text-slate-400 font-sans">Average accumulative percentage mark computed across graded exams.</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Graded exam rosters:</span>
            <strong className="text-slate-800">{results.length} Papers</strong>
          </div>
        </div>

        {/* Grade distribution SVG visual bar chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-slate-800 text-sm">Grades Distribution Array</h4>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Normal distribution curve</span>
          </div>

          <div className="grid grid-cols-6 gap-2 pt-2 h-24 items-end border-b border-slate-100 pb-1.5">
            {Object.entries(gradeCounts).map(([grade, count]) => {
              const heightPct = Math.round((count / totalFilteredResults) * 100);
              return (
                <div key={grade} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[9px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div 
                    style={{ height: `${Math.max(heightPct, 6)}%` }} 
                    className="w-full bg-blue-600 hover:bg-blue-500 rounded-t transition-all duration-300 shadow cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-slate-500 block mt-1.5 font-sans">{grade}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Header and filters */}
      <div className="flex flex-wrap items-center justify-between gap-4" id="result-manager-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Grade Register</h2>
          <p className="text-xs text-slate-500">Record midterm or semester finals subject marks, calculate grade letters, and review class profiles.</p>
        </div>
        <button
          id="btn-trigger-grading"
          onClick={handleOpenForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all"
        >
          <Plus className="w-4 h-4" />
          Assign Student Grades
        </button>
      </div>

      {/* Filters Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm" id="result-filters">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            id="result-search-input"
            type="text"
            placeholder="Search marks ledger by student name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50"
          />
        </div>

        <div className="md:col-span-4">
          <select
            id="result-course-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 font-medium text-slate-600"
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="result-table-container">
        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course/Exam Subject</th>
                  <th className="py-3 px-4">Semester Term</th>
                  <th className="py-3 px-4 text-right">Raw Score</th>
                  <th className="py-3 px-4 text-center">Letter Grade</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map(({ rec, student, course }) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 text-xs text-slate-600 font-sans" id={`result-row-${rec.id}`}>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{student?.name || 'Unknown Student'}</span>
                      <span className="font-mono text-[10px] text-slate-400 block">{student?.rollNo}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {course ? course.name : 'General Subject'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-500">
                      {rec.semester}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-md">
                        {rec.marks}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                        rec.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        rec.grade.startsWith('B') ? 'bg-sky-50 text-sky-700 border border-sky-150' :
                        rec.grade === 'F' ? 'bg-rose-50 text-rose-700 border border-rose-150 animate-pulse' :
                        'bg-amber-50 text-amber-700 border border-amber-150'
                      }`}>
                        {rec.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        id={`btn-delete-result-${rec.id}`}
                        onClick={() => {
                          if (confirm(`Remove this grade record?`)) {
                            onDeleteResult(rec.id);
                          }
                        }}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-slate-200"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400 text-xs">
            No academic marks records found matching your selected parameters.
          </div>
        )}
      </div>

      {/* RECORD MARKS MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="modal-result-form">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 animate-fadeIn relative">
            <button
              id="btn-close-result-modal"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Record Academic Grades</h3>
                <p className="text-xs text-slate-400">Record subject percentages directly into exam tables.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Select Student */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Student Profile</label>
                <select
                  id="select-grade-student"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                  ))}
                </select>
              </div>

              {/* Select Course Exam */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subject Exam Paper</label>
                <select
                  id="select-grade-course"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              {/* Semester select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Semester Term</label>
                <select
                  id="select-grade-sem"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              {/* Marks input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Exam Percentage Score (0-100)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">%</span>
                  <input
                    id="input-grade-marks"
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={marksString}
                    onChange={(e) => setMarksString(e.target.value)}
                    placeholder="Enter percentage score (e.g. 85)"
                    className="w-full pl-7 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Letter grades are auto-compiled on submission.</p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  id="btn-grade-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-grade-submit"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-colors"
                >
                  Publish Grades
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
