import React, { useState } from 'react';
import { Student, Faculty } from '../types';
import { Shield, GraduationCap, Users, Key, AlertCircle, ArrowRight, CornerDownRight } from 'lucide-react';

interface LoginViewProps {
  students: Student[];
  faculty: Faculty[];
  onLogin: (role: 'admin' | 'student' | 'faculty', userRecord: any) => void;
}

export default function LoginView({ students, faculty, onLogin }: LoginViewProps) {
  const [role, setRole] = useState<'admin' | 'student' | 'faculty'>('admin');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginId.trim()) {
      setError('Please enter your Login ID / Roll No / Employee ID.');
      return;
    }

    if (role === 'admin') {
      if (loginId.toLowerCase() === 'admin' && password === 'admin') {
        onLogin('admin', { name: 'Institutional Administrator', username: 'admin' });
      } else {
        setError('Invalid Admin credentials. Try Username: "admin" & Password: "admin"');
      }
    } else if (role === 'student') {
      const match = students.find(
        (s) => s.rollNo.toLowerCase() === loginId.trim().toLowerCase()
      );
      if (match) {
        onLogin('student', match);
      } else {
        setError(`Roll Number "${loginId}" not found in our database register.`);
      }
    } else if (role === 'faculty') {
      const match = faculty.find(
        (f) => f.employeeId.toLowerCase() === loginId.trim().toLowerCase()
      );
      if (match) {
        onLogin('faculty', match);
      } else {
        setError(`Faculty Employee ID "${loginId}" not registered.`);
      }
    }
  };

  const handleQuickLogin = (selectedRole: 'admin' | 'student' | 'faculty', id: string, customPass = 'admin') => {
    setRole(selectedRole);
    setLoginId(id);
    setPassword(customPass);
    setError('');

    if (selectedRole === 'admin') {
      onLogin('admin', { name: 'Institutional Administrator', username: 'admin' });
    } else if (selectedRole === 'student') {
      const match = students.find((s) => s.rollNo.toLowerCase() === id.toLowerCase());
      if (match) onLogin('student', match);
    } else if (selectedRole === 'faculty') {
      const match = faculty.find((f) => f.employeeId.toLowerCase() === id.toLowerCase());
      if (match) onLogin('faculty', match);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-4">
      {/* LEFT FORM BOX */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
            <Key className="w-3.5 h-3.5" /> Portal Gatekeeper
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Institutional Access Control
          </h2>
          <p className="text-xs text-slate-500">
            Please select your role and enter your secure credentials to proceed to your dedicated workspace.
          </p>
        </div>

        {/* ROLE PICKER TABS */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setLoginId('');
              setPassword('');
              setError('');
            }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${
              role === 'admin'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setLoginId('');
              setPassword('');
              setError('');
            }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Panel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('faculty');
              setLoginId('');
              setPassword('');
              setError('');
            }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${
              role === 'faculty'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Panel</span>
          </button>
        </div>

        {/* ERROR BOX */}
        {error && (
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold mb-6 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* GUIDELINE CREDENTIAL TIPS */}
        <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl mb-6 text-xs text-blue-800 font-semibold leading-relaxed">
          {role === 'admin' && (
            <div className="space-y-1">
              <div>🔑 <strong>Admin Sign In Credentials:</strong></div>
              <div className="font-mono text-[11px] text-blue-900 bg-blue-100/50 p-1.5 rounded mt-1">
                Username: <span className="font-bold underline text-blue-950">admin</span><br />
                Password: <span className="font-bold underline text-blue-950">admin</span>
              </div>
            </div>
          )}
          {role === 'student' && (
            <div className="space-y-1">
              <div>🎓 <strong>Student Roll Numbers:</strong></div>
              <div className="font-mono text-[11px] text-blue-900 bg-blue-100/50 p-1.5 rounded mt-1">
                Roll No: <span className="font-bold text-blue-950">CS23101</span> (Aarav Singh)<br />
                Roll No: <span className="font-bold text-blue-950">CS23102</span> (Ananya Roy)<br />
                Roll No: <span className="font-bold text-blue-950">EC23201</span> (Ishaan Mehta)
              </div>
              <div className="text-[10px] text-blue-700/80 mt-1">Password check is bypassed for testing—you can enter anything or leave it empty.</div>
            </div>
          )}
          {role === 'faculty' && (
            <div className="space-y-1">
              <div>🧑‍🏫 <strong>Faculty Employee IDs:</strong></div>
              <div className="font-mono text-[11px] text-blue-900 bg-blue-100/50 p-1.5 rounded mt-1">
                Employee ID: <span className="font-bold text-blue-950">FAC-1001</span> (Dr. Alok Sharma)<br />
                Employee ID: <span className="font-bold text-blue-950">FAC-1002</span> (Prof. Priya Patel)<br />
                Employee ID: <span className="font-bold text-blue-950">FAC-1003</span> (Dr. Rajesh Gupta)
              </div>
              <div className="text-[10px] text-blue-700/80 mt-1">Password check is bypassed for testing—you can enter anything or leave it empty.</div>
            </div>
          )}
          <div className="mt-2.5 pt-2 border-t border-blue-150 text-[10px] text-slate-500 font-medium">
            💡 Pro-Tip: You can also use the <strong>"Quick 1-Click Demo Helper"</strong> box on the right to login instantly!
          </div>
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {role === 'admin' && 'Admin Login ID (Username)'}
              {role === 'student' && 'Student Roll Number'}
              {role === 'faculty' && 'Faculty Employee ID'}
            </label>
            <input
              type="text"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder={
                role === 'admin'
                  ? 'e.g. admin'
                  : role === 'student'
                  ? 'e.g. CS23101'
                  : 'e.g. FAC-1001'
              }
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono bg-slate-50 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Secure Access Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono bg-slate-50 text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {role === 'admin'
                ? 'Sandbox demo password is "admin".'
                : 'For Student/Faculty testing, password checks are bypassed on ID match.'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all hover:-translate-y-0.5"
          >
            <span>Authenticate Secure Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* RIGHT HELP PANEL (DEMO PREFILLS) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Sandbox Live Sync Active
            </span>
          </div>
          <h3 className="font-extrabold text-white text-base mb-2">
            Quick 1-Click Demo Helper
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Simulate realistic role-based access instantly. Click any profile below to bypass forms and load that user's customized interface.
          </p>

          <div className="space-y-4">
            {/* Admin Prefill */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> System Admin
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin', 'admin')}
                  className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded hover:bg-blue-500 transition-colors"
                >
                  Quick Log In
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                Login ID: <span className="text-white">admin</span> | Pass: <span className="text-white">admin</span>
              </p>
            </div>

            {/* Students Prefill */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1 mb-2">
                <Users className="w-3 h-3" /> Student Demo Accounts
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {students.slice(0, 3).map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 bg-slate-800 rounded-lg hover:bg-slate-750 border border-slate-700/50"
                  >
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{st.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">Roll: {st.rollNo} • {st.department}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('student', st.rollNo)}
                      className="px-2 py-0.5 bg-slate-700 hover:bg-blue-600 text-[10px] text-white font-bold rounded transition-colors"
                    >
                      Login
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Prefill */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 flex items-center gap-1 mb-2">
                <GraduationCap className="w-3 h-3" /> Faculty Demo Accounts
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {faculty.slice(0, 3).map((fa) => (
                  <div
                    key={fa.id}
                    className="flex items-center justify-between p-2 bg-slate-800 rounded-lg hover:bg-slate-750 border border-slate-700/50"
                  >
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{fa.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">ID: {fa.employeeId} • {fa.department}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('faculty', fa.employeeId)}
                      className="px-2 py-0.5 bg-slate-700 hover:bg-blue-600 text-[10px] text-white font-bold rounded transition-colors"
                    >
                      Login
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
          <h4 className="text-xs font-bold text-slate-700 mb-2">Why separate dashboards?</h4>
          <ul className="space-y-1.5 text-[11px] text-slate-500 leading-relaxed font-medium">
            <li className="flex items-start gap-1">
              <CornerDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Students</strong> can view personal transcripts, pay term dues in real-time, and check lecture presence records.</span>
            </li>
            <li className="flex items-start gap-1">
              <CornerDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Faculty Members</strong> can mark attendance and submit grades for only their assigned curriculum streams.</span>
            </li>
            <li className="flex items-start gap-1">
              <CornerDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Administrators</strong> hold master privileges for institutional profiles, databases, and general reports.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
