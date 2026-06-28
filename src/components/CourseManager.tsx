/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Course, Student } from '../types';
import { Plus, Search, Trash2, Edit, X, BookOpen, Layers, Award, Clock, DollarSign } from 'lucide-react';

interface CourseManagerProps {
  courses: Course[];
  students: Student[];
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export default function CourseManager({
  courses,
  students,
  onAddCourse,
  onEditCourse,
  onDeleteCourse
}: CourseManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form / Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Field values
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [duration, setDuration] = useState('4 Years');
  const [credits, setCredits] = useState(120);
  const [feeAmount, setFeeAmount] = useState(100000);

  const resetForm = () => {
    setName('');
    setCode('');
    setDepartment('Computer Science');
    setDuration('4 Years');
    setCredits(120);
    setFeeAmount(100000);
    setSelectedCourse(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormMode('add');
    setIsFormOpen(true);
  };

  const openEditForm = (course: Course) => {
    setSelectedCourse(course);
    setName(course.name);
    setCode(course.code);
    setDepartment(course.department);
    setDuration(course.duration);
    setCredits(course.credits);
    setFeeAmount(course.feeAmount);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code || !department) return;

    if (formMode === 'add') {
      onAddCourse({
        name,
        code,
        department,
        duration,
        credits,
        feeAmount
      });
    } else if (formMode === 'edit' && selectedCourse) {
      onEditCourse({
        ...selectedCourse,
        name,
        code,
        department,
        duration,
        credits,
        feeAmount
      });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="course-manager-container">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4" id="course-manager-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Curriculum & Course Directories</h2>
          <p className="text-xs text-slate-500">Configure study streams, assign credit weighings, and establish tuition fee baselines.</p>
        </div>
        <button
          id="btn-add-course"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Course Stream
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm" id="course-filters">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            id="course-search-input"
            type="text"
            placeholder="Search courses by name, code, or department field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="courses-grid">
        {filteredCourses.map(c => {
          // Count enrolled students
          const enrolledCount = students.filter(s => s.courseId === c.id && s.status === 'Active').length;
          
          return (
            <div key={c.id} id={`course-card-${c.id}`} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="p-6 space-y-4">
                
                {/* Header Icon Block */}
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform duration-300 border border-emerald-100">
                    <BookOpen className="w-5.5 h-5.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                    {c.code}
                  </span>
                </div>

                {/* Course Details block */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{c.department}</span>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{c.name}</h4>
                </div>

                {/* Grid attributes */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Duration</span>
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.duration}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Credits</span>
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Award className="w-3.5 h-3.5 text-slate-400" /> {c.credits}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Tuition Rate</span>
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      ₹{(c.feeAmount / 1000).toFixed(0)}k/yr
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer: Enroll Status */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Active Enrollment: <strong className="text-slate-800 font-bold font-mono">{enrolledCount} Students</strong>
                </span>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    id={`btn-edit-course-${c.id}`}
                    onClick={() => openEditForm(c)}
                    className="p-1 hover:bg-slate-200 text-slate-500 hover:text-emerald-600 rounded transition-colors"
                    title="Edit Curriculum"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-delete-course-${c.id}`}
                    onClick={() => {
                      if (enrolledCount > 0) {
                        alert(`Cannot delete this course. There are currently ${enrolledCount} active students enrolled in it. Please withdraw them or change their course first.`);
                        return;
                      }
                      if (confirm(`Remove course ${c.name} completely from directories?`)) {
                        onDeleteCourse(c.id);
                      }
                    }}
                    className="p-1 hover:bg-slate-200 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete Stream"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="modal-course-form">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-fadeIn relative">
            <button
              id="btn-close-course-modal"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {formMode === 'add' ? 'Create New Course Stream' : 'Modify Course Settings'}
                </h3>
                <p className="text-xs text-slate-400">Add degree programs to the college administrative curriculum catalog.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Course Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Course Name</label>
                <input
                  id="input-course-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master of Business Administration"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Code & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Course Code</label>
                  <input
                    id="input-course-code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="MBA-602"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Department Area</label>
                  <select
                    id="select-course-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Computer Applications">Computer Applications</option>
                    <option value="Management">Management</option>
                    <option value="Science & Arts">Science & Arts</option>
                  </select>
                </div>
              </div>

              {/* Credits & Fee & Duration */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Credits Weight</label>
                  <input
                    id="input-course-credits"
                    type="number"
                    required
                    value={credits}
                    onChange={(e) => setCredits(parseInt(e.target.value) || 80)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tuition Rate (₹/yr)</label>
                  <input
                    id="input-course-fee"
                    type="number"
                    required
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(parseInt(e.target.value) || 50000)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Program Duration</label>
                  <select
                    id="select-course-dur"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="4 Years">4 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="2 Years">2 Years</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  id="btn-course-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-course-submit"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-colors"
                >
                  {formMode === 'add' ? 'Publish Course' : 'Save Adjustments'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
