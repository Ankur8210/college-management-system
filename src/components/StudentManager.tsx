/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Student, Course } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  Check, 
  UserPlus, 
  BookOpen, 
  GraduationCap, 
  Phone, 
  Mail, 
  Calendar 
} from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  courses: Course[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export default function StudentManager({
  students,
  courses,
  onAddStudent,
  onEditStudent,
  onDeleteStudent
}: StudentManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'Alumni'>('Active');
  const [joinedYear, setJoinedYear] = useState(2026);

  // Departments list compiled dynamically
  const departments = ['All', ...Array.from(new Set(courses.map(c => c.department)))];

  const resetForm = () => {
    setName('');
    setRollNo('');
    setEmail('');
    setPhone('');
    setCourseId(courses[0]?.id || '');
    setSemester('Semester 1');
    setStatus('Active');
    setJoinedYear(new Date().getFullYear());
    setSelectedStudent(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormMode('add');
    setIsFormOpen(true);
  };

  const openEditForm = (student: Student) => {
    setSelectedStudent(student);
    setName(student.name);
    setRollNo(student.rollNo);
    setEmail(student.email);
    setPhone(student.phone);
    setCourseId(student.courseId);
    setSemester(student.semester);
    setStatus(student.status);
    setJoinedYear(student.joinedYear);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !rollNo || !email || !courseId) return;

    const course = courses.find(c => c.id === courseId);
    const department = course ? course.department : "General";

    if (formMode === 'add') {
      onAddStudent({
        name,
        rollNo,
        email,
        phone,
        courseId,
        department,
        semester,
        joinedYear,
        status
      });
    } else if (formMode === 'edit' && selectedStudent) {
      onEditStudent({
        ...selectedStudent,
        name,
        rollNo,
        email,
        phone,
        courseId,
        department,
        semester,
        joinedYear,
        status
      });
    }
    setIsFormOpen(false);
    resetForm();
  };

  // Filters
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6" id="student-manager-container">
      {/* Header and Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4" id="student-manager-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-xs text-slate-500">Register, inspect profiles, update semester stages, or withdraw students.</p>
        </div>
        <button
          id="btn-add-student"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Enroll New Student
        </button>
      </div>

      {/* Filters Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm" id="student-filters">
        {/* Search bar */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search students by name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50"
          />
        </div>

        {/* Dept filter */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="student-dept-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50 font-medium text-slate-600"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="md:col-span-3">
          <select
            id="student-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50 font-medium text-slate-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Enrolled</option>
            <option value="Suspended">Suspended</option>
            <option value="Alumni">Alumni / Graduated</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="student-table-container">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Enrolled Course</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Joined Year</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => {
                  const course = courses.find(c => c.id === s.courseId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 text-xs text-slate-600 font-sans" id={`student-row-${s.id}`}>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{s.rollNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{s.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{course ? course.name : 'Unknown Course'}</span>
                        <span className="block text-[9px] text-slate-400">{s.department}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-500">{s.semester}</td>
                      <td className="py-3 px-4 font-mono">{s.joinedYear}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          s.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            id={`btn-view-${s.id}`}
                            onClick={() => setInspectStudent(s)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-950 rounded-lg transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-edit-${s.id}`}
                            onClick={() => openEditForm(s)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors"
                            title="Edit Student Info"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-${s.id}`}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${s.name}?`)) {
                                onDeleteStudent(s.id);
                              }
                            }}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Remove Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
            No enrolled students match your selected search filters.
          </div>
        )}
      </div>

      {/* 1. REGISTER / EDIT STUDENT MODAL DIALOG */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="modal-student-form">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-fadeIn relative">
            <button
              id="btn-close-modal"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {formMode === 'add' ? 'Register New Student Profile' : 'Modify Student Profile'}
                </h3>
                <p className="text-xs text-slate-400">Specify precise details to write directly to the MySQL database tables.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Full name */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <input
                    id="input-form-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name (e.g. Rohan Kumar)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Roll No */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Roll Number</label>
                  <input
                    id="input-form-roll"
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="CS23105"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                {/* Joined Year */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Joined Year</label>
                  <input
                    id="input-form-year"
                    type="number"
                    required
                    value={joinedYear}
                    onChange={(e) => setJoinedYear(parseInt(e.target.value) || 2026)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <input
                    id="input-form-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@student.edu"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Contact Number</label>
                  <input
                    id="input-form-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Select Course */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Enrolled Course</label>
                  <select
                    id="select-form-course"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                    ))}
                  </select>
                </div>

                {/* Semester selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Semester</label>
                  <select
                    id="select-form-sem"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                {/* Status selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Academic Status</label>
                  <select
                    id="select-form-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Active">Active Enrolled</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Alumni">Alumni / Alumni Status</option>
                  </select>
                </div>

              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  id="btn-form-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-form-submit"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-colors"
                >
                  {formMode === 'add' ? 'Add Student' : 'Save Profiles'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. INSPECT STUDENT PROFILE PROFILE MODAL */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" id="modal-student-inspect">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl border border-slate-100 animate-fadeIn relative">
            
            {/* Modal Header Cover block */}
            <div className="bg-slate-900 text-slate-100 p-6 relative">
              <button
                id="btn-close-inspect"
                onClick={() => setInspectStudent(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold uppercase border-2 border-white shadow shadow-emerald-700">
                  {inspectStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{inspectStudent.name}</h3>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold">{inspectStudent.rollNo}</span>
                </div>
              </div>
            </div>

            {/* Inspect Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Program</span>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    {courses.find(c => c.id === inspectStudent.courseId)?.name || 'Unknown'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department Tag</span>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    {inspectStudent.department}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{inspectStudent.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Contact</span>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {inspectStudent.phone || 'Not Provided'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Term</span>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {inspectStudent.semester}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration Status</span>
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      inspectStudent.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      inspectStudent.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {inspectStudent.status}
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  id="btn-close-inspect-ok"
                  onClick={() => setInspectStudent(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  OK, Go Back
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
