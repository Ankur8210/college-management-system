/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Faculty, Course } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  X, 
  UserCheck, 
  Briefcase, 
  Mail, 
  Phone, 
  BookOpen, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

interface FacultyManagerProps {
  faculty: Faculty[];
  courses: Course[];
  onAddFaculty: (professor: Omit<Faculty, 'id'>) => void;
  onEditFaculty: (professor: Faculty) => void;
  onDeleteFaculty: (id: string) => void;
}

export default function FacultyManager({
  faculty,
  courses,
  onAddFaculty,
  onEditFaculty,
  onDeleteFaculty
}: FacultyManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Form / Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedProf, setSelectedProf] = useState<Faculty | null>(null);

  // Field values
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [assignedCourseIds, setAssignedCourseIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'On Leave'>('Active');

  const departments = ['All', ...Array.from(new Set(courses.map(c => c.department)))];

  const resetForm = () => {
    setName('');
    setEmployeeId('');
    setEmail('');
    setPhone('');
    setDepartment('Computer Science');
    setDesignation('Assistant Professor');
    setAssignedCourseIds([]);
    setStatus('Active');
    setSelectedProf(null);
  };

  const openAddForm = () => {
    resetForm();
    setFormMode('add');
    setIsFormOpen(true);
  };

  const openEditForm = (prof: Faculty) => {
    setSelectedProf(prof);
    setName(prof.name);
    setEmployeeId(prof.employeeId);
    setEmail(prof.email);
    setPhone(prof.phone);
    setDepartment(prof.department);
    setDesignation(prof.designation);
    setAssignedCourseIds(prof.courseIds);
    setStatus(prof.status);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleToggleCourse = (courseId: string) => {
    if (assignedCourseIds.includes(courseId)) {
      setAssignedCourseIds(assignedCourseIds.filter(id => id !== courseId));
    } else {
      setAssignedCourseIds([...assignedCourseIds, courseId]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !employeeId || !email) return;

    if (formMode === 'add') {
      onAddFaculty({
        name,
        employeeId,
        email,
        phone,
        department,
        designation,
        courseIds: assignedCourseIds,
        status
      });
    } else if (formMode === 'edit' && selectedProf) {
      onEditFaculty({
        ...selectedProf,
        name,
        employeeId,
        email,
        phone,
        department,
        designation,
        courseIds: assignedCourseIds,
        status
      });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const toggleStatus = (prof: Faculty) => {
    onEditFaculty({
      ...prof,
      status: prof.status === 'Active' ? 'On Leave' : 'Active'
    });
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6" id="faculty-manager-container">
      {/* Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4" id="faculty-manager-header">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Directory</h2>
          <p className="text-xs text-slate-500">Manage academic professors, assign curriculums, and log leave applications.</p>
        </div>
        <button
          id="btn-add-faculty"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Hire New Professor
        </button>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm" id="faculty-filters">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            id="faculty-search-input"
            type="text"
            placeholder="Search professors by name, employee ID, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="faculty-dept-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50 font-medium text-slate-600"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="faculty-cards-grid">
        {filteredFaculty.map(f => (
          <div key={f.id} id={`faculty-card-${f.id}`} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-4">
              {/* Profile Bio block */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 font-extrabold text-sm border border-slate-200 shadow-inner">
                    {f.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{f.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{f.employeeId}</span>
                  </div>
                </div>
                
                {/* Status indicator button */}
                <button
                  id={`btn-toggle-status-${f.id}`}
                  onClick={() => toggleStatus(f)}
                  title="Toggle Active/Leave Status"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                    f.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {f.status}
                </button>
              </div>

              {/* Department and Designation details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">{f.designation}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                    {f.department}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{f.email}</span>
                </div>
                {f.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{f.phone}</span>
                  </div>
                )}
              </div>

              {/* Allocated Courses block */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Classes</span>
                <div className="flex flex-wrap gap-1">
                  {f.courseIds.length > 0 ? (
                    f.courseIds.map(cId => {
                      const cObj = courses.find(cr => cr.id === cId);
                      return (
                        <span key={cId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold border border-slate-200">
                          <BookOpen className="w-2.5 h-2.5 text-slate-400" />
                          {cObj ? cObj.code : 'Unknown'}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] italic text-slate-400">No classes assigned yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action panel */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                id={`btn-edit-prof-${f.id}`}
                onClick={() => openEditForm(f)}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors border border-slate-200 flex items-center gap-1 px-3.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Edit Info</span>
              </button>
              <button
                id={`btn-delete-prof-${f.id}`}
                onClick={() => {
                  if (confirm(`Remove Dr./Prof. ${f.name} from the college board?`)) {
                    onDeleteFaculty(f.id);
                  }
                }}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-slate-200"
                title="De-register Professor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FACULTY REGISTRATION MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="modal-faculty-form">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-fadeIn relative">
            <button
              id="btn-close-fac-modal"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {formMode === 'add' ? 'Register Faculty Member' : 'Modify Professor Record'}
                </h3>
                <p className="text-xs text-slate-400">Record credential details for administrative tracking and timetabling.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name (with honorific)</label>
                  <input
                    id="input-prof-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Alok Sharma"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Employee ID</label>
                  <input
                    id="input-prof-id"
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="FAC-1007"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select
                    id="select-prof-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="On Leave">Sabbatical / On Leave</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <input
                    id="input-prof-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    id="input-prof-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Department Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">College Department</label>
                  <select
                    id="select-prof-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {departments.filter(d => d !== 'All').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Designation selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Designation Designation</label>
                  <select
                    id="select-prof-desig"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Professor & HOD">Professor & HOD</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Guest Faculty">Guest Faculty</option>
                  </select>
                </div>

                {/* Course Allocations */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Class/Course Allocations</label>
                  <p className="text-[10px] text-slate-400 mb-2">Check the curriculum courses that this professor teaches:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 border border-slate-100 p-3 rounded-lg max-h-36 overflow-y-auto">
                    {courses.map(course => {
                      const isChecked = assignedCourseIds.includes(course.id);
                      return (
                        <label key={course.id} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCourse(course.id)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <span className="font-mono text-[11px] text-slate-700">{course.code}</span> - {course.name}
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  id="btn-fac-cancel"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-fac-submit"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-colors"
                >
                  {formMode === 'add' ? 'Confirm Hire' : 'Save Modifications'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
