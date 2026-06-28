/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  courseId: string; // Enrolled Course
  department: string;
  semester: string;
  joinedYear: number;
  status: 'Active' | 'Suspended' | 'Alumni';
}

export interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  courseIds: string[]; // Courses taught by this faculty member
  status: 'Active' | 'On Leave';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  duration: string; // e.g., "4 Years", "2 Years"
  credits: number;
  feeAmount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
}

export interface FeeRecord {
  id: string;
  studentId: string;
  totalAmount: number;
  paidAmount: number;
  lastPaymentDate?: string;
  status: 'Paid' | 'Pending' | 'Partial';
}

export interface ResultRecord {
  id: string;
  studentId: string;
  courseId: string;
  marks: number; // Out of 100
  grade: string;
  semester: string;
}

export interface PresentationSlide {
  step: number;
  title: string;
  hindiHeading: string;
  englishHeading: string;
  hindiContent: string;
  englishContent: string;
  details: string[];
  iconName: string;
  category: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
  hindiQuestion?: string;
  hindiAnswer?: string;
  category: string;
}
