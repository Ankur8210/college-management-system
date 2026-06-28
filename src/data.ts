/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Faculty, Course, AttendanceRecord, FeeRecord, ResultRecord, PresentationSlide, VivaQuestion } from './types';

export const INITIAL_SLIDES: PresentationSlide[] = [
  {
    step: 1,
    title: "Introduction",
    hindiHeading: "College Management System - परिचय",
    englishHeading: "College Management System - Introduction",
    hindiContent: "College Management System ek software project hai jo college ke daily management ko digital aur easy banata hai.",
    englishContent: "The College Management System is a comprehensive software platform designed to digitalize and simplify the day-to-day administrative and academic operations of a college.",
    iconName: "Presentation",
    category: "Intro",
    details: [
      "Digitalizes paper-based traditional processes.",
      "Acts as a centralized hub for Students, Faculty, and Admin.",
      "Access control based on roles for enhanced safety.",
      "Improves transparency and efficiency within the institution."
    ]
  },
  {
    step: 2,
    title: "Problem Statement",
    hindiHeading: "समस्या का विवरण (Problem Statement)",
    englishHeading: "The Core Problem Statement",
    hindiContent: "Manual record maintain karna time-consuming hota hai aur errors hone ke chances zyada hote hain.",
    englishContent: "Maintaining records manually on paper or fragmented spreadsheets is extremely time-consuming, prone to calculation errors, and lacks fast retrieval options.",
    iconName: "AlertCircle",
    category: "Problem",
    details: [
      "High human effort required for attendance and grade calculation.",
      "Risk of data loss due to physical damage or misplaced papers.",
      "No real-time insights for administrators regarding fees or attendance.",
      "Difficulty in communicating notices and results to students instantly."
    ]
  },
  {
    step: 3,
    title: "Solution",
    hindiHeading: "हमारा समाधान (The Solution)",
    englishHeading: "The Integrated Solution",
    hindiContent: "Ye system student, faculty, attendance, fees aur result ko ek hi platform par manage karta hai.",
    englishContent: "A unified, fully digital platform that integrates all academic and financial modules under one single dashboard for seamless, instant operations.",
    iconName: "CheckCircle",
    category: "Solution",
    details: [
      "Single source of truth for all college records.",
      "Automated attendance percentages, fee reminders, and transcript generation.",
      "Highly accessible web-based portal anytime, anywhere.",
      "Automated analytics reports for management decision-making."
    ]
  },
  {
    step: 4,
    title: "Features",
    hindiHeading: "मुख्य विशेषताएं (Key Features)",
    englishHeading: "Core System Modules & Features",
    hindiContent: "Student, Faculty, Course, Attendance, Fee, Result aur Report Generation ko efficiently handle karne ke smart modules.",
    englishContent: "Robust modules tailored to college workflows, providing seamless data entry, tracking, and evaluation capabilities.",
    iconName: "Cpu",
    category: "Features",
    details: [
      "Student Management: Enrolling, profile tracking, and personal bio data.",
      "Faculty Management: Directory of professors, courses assigned, and department tags.",
      "Course Management: Adding curriculums, credit limits, and syllabus definitions.",
      "Attendance Management: Daily calendar tracking, absent/present logging, and notifications.",
      "Fee Management: Automated billing, record payments, and tracking outstanding dues.",
      "Result Management: GPA / CGPA calculations, report cards, and marksheets.",
      "Report Generation: Generating beautiful PDF transcripts, financial logs, and roll lists."
    ]
  },
  {
    step: 5,
    title: "Technology Used",
    hindiHeading: "उपयोग की गई तकनीक (Technology Stack)",
    englishHeading: "System Tech Stack Architecture",
    hindiContent: "Frontend me HTML, CSS, JavaScript; Backend me Java; aur Database me MySQL ka upyog hota hai.",
    englishContent: "Built using solid industry-standard architecture containing a modern responsive web interface, robust enterprise server logic, and a scalable relational database.",
    iconName: "Database",
    category: "Tech",
    details: [
      "Frontend: HTML5, CSS3 (Tailwind CSS for sleek design), React / JavaScript for reactive UI.",
      "Backend: Java (Spring Boot / Servlets) for high-performance enterprise business layers.",
      "Database: MySQL / PostgreSQL with complex relations for absolute data integrity.",
      "Architecture: MVC (Model-View-Controller) pattern to separate UI, server, and storage."
    ]
  },
  {
    step: 6,
    title: "Benefits",
    hindiHeading: "सिस्टम के लाभ (Key Benefits)",
    englishHeading: "Institutional Advantages",
    hindiContent: "Time ki bachat, accurate records, easy data management, aur secure information.",
    englishContent: "Saves massive operational time, ensures zero data replication errors, simplifies record tracking, and secures sensitive user information.",
    iconName: "ShieldCheck",
    category: "Benefits",
    details: [
      "Time Savings: Automated tasks free up teachers to focus purely on tutoring.",
      "High Accuracy: Computerized computations eliminate manual counting mistakes.",
      "Effortless Retrieval: Search any student in milliseconds instead of browsing registers.",
      "Information Security: Encrypted credentials and controlled database user access."
    ]
  },
  {
    step: 7,
    title: "Conclusion",
    hindiHeading: "निष्कर्ष (Conclusion)",
    englishHeading: "Conclusion & Future Scope",
    hindiContent: "College Management System colleges ke administration ko simple, fast aur efficient banata hai.",
    englishContent: "In conclusion, the College Management System transforms administrative overheads into quick, fluid, and modern experiences, making institutions highly efficient.",
    iconName: "Award",
    category: "Conclusion",
    details: [
      "Modernizes the overall educational infrastructure.",
      "Reduces paper carbon footprint to align with green campus goals.",
      "Scalable for future additions (AI-based grading, parents' messaging portal).",
      "Ready to deploy and upgrade today's modern educational institutions."
    ]
  }
];

export const INITIAL_VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: "What is the primary objective of this project?",
    answer: "The primary objective is to automate manual college administrative workflows such as student registration, faculty class allocation, attendance logging, fee processing, and exam marks calculation, reducing human errors and improving efficiency.",
    hindiQuestion: "इस प्रोजेक्ट का मुख्य उद्देश्य क्या है?",
    hindiAnswer: "मुख्य उद्देश्य कॉलेज के प्रशासनिक कार्यों जैसे स्टूडेंट रजिस्ट्रेशन, अटेंडेंस, फीस पेमेंट और रिजल्ट जेनरेशन को डिजिटल करके मैनुअल काम और गलतियों को खत्म करना है।",
    category: "General"
  },
  {
    question: "Why did we choose MySQL as our Database?",
    answer: "MySQL is a Relational Database Management System (RDBMS). Since college data is highly structured with clear entities (Students have courses, Courses have faculty, Students have attendance/fees), relational tables with Foreign Keys ensure complete data consistency and ACID compliance.",
    hindiQuestion: "MySQL डेटाबेस का उपयोग क्यों किया गया?",
    hindiAnswer: "क्योंकि कॉलेज का डेटा स्ट्रक्चर्ड होता है (जैसे स्टूडेंट्स, कोर्सेज, फैकल्टी)। MySQL एक रिलेशनल डेटाबेस है, जिसमें प्राइमरी और फॉरेन की (Foreign Keys) का उपयोग करके डेटा में कंसिस्टेंसी और सुरक्षा बनी रहती है।",
    category: "Database"
  },
  {
    question: "How is the Student-to-Course relationship structured in the database schema?",
    answer: "It is a One-to-Many relationship (or many-to-one). A student can enroll in exactly one Course (e.g., B.Tech CS), while a single Course can have multiple enrolled students. This is implemented by placing the course_id as a Foreign Key inside the students table.",
    hindiQuestion: "डेटाबेस में Student और Course का रिलेशन कैसे है?",
    hindiAnswer: "यह एक One-to-Many रिलेशन है। एक स्टूडेंट एक ही कोर्स में एनरोल हो सकता है, लेकिन एक कोर्स में कई स्टूडेंट्स हो सकते हैं। इसे Student टेबल में Course ID को फॉरेन की बनाकर लागू किया गया है।",
    category: "Database"
  },
  {
    question: "How does Java handle the backend business logic?",
    answer: "Java uses the MVC (Model-View-Controller) architecture. Controllers receive API requests from the frontend, Services apply business rules (like calculating attendance percentage or total due fees), and DAOs (Data Access Objects) or Spring Data JPA talk to the MySQL database to store or fetch data.",
    hindiQuestion: "जावा (Java) बैकएंड बिजनेस लॉजिक को कैसे हैंडल करता है?",
    hindiAnswer: "जावा MVC आर्किटेक्चर का उपयोग करता है। कंट्रोलर फ्रंटएंड से रिक्वेस्ट लेते हैं, सर्विस लेयर बिजनेस रूल्स लागू करती है (जैसे अटेंडेंस का प्रतिशत निकालना), और DAO या JPA हाइबरनेट के जरिए MySQL डेटाबेस से संपर्क करते हैं।",
    category: "Backend"
  },
  {
    question: "How do you handle security and authentication in this system?",
    answer: "Users have roles (Admin, Faculty, Student). We use Spring Security with JWT (JSON Web Tokens) or session cookies in Java. Every protected API endpoint checks the authenticated user's role before permitting data access or modifications.",
    hindiQuestion: "सिस्टम में सुरक्षा और ऑथेंटिकेशन को कैसे हैंडल किया जाता है?",
    hindiAnswer: "यूजर रोल्स (Admin, Faculty, Student) बनाए जाते हैं। जावा में JWT (JSON Web Token) या सेशन कुकीज़ का उपयोग किया जाता है। डेटा देखने या बदलने से पहले सर्वर पर यूजर का रोल चेक किया जाता है।",
    category: "Security"
  },
  {
    question: "What are some possible future enhancements for this project?",
    answer: "Future upgrades include implementing an AI engine for student performance forecasting, SMS/WhatsApp integration for automated fee due alerts, online payment gateway (Stripe/Razorpay) integrations, and an automated classroom scheduler/timetable generator.",
    hindiQuestion: "इस प्रोजेक्ट में भविष्य में क्या सुधार किए जा सकते हैं?",
    hindiAnswer: "भविष्य के सुधारों में: स्टूडेंट्स के परफॉरमेंस की भविष्यवाणी के लिए AI मॉडल, फीस रिमाइंडर के लिए SMS/WhatsApp ऑटोमेशन, ऑनलाइन पेमेंट गेटवे, और ऑटोमैटिक टाइमटेबल जनरेटर शामिल हैं।",
    category: "General"
  }
];

export const INITIAL_COURSES: Course[] = [
  { id: "c1", code: "CS-101", name: "B.Tech Computer Science", department: "Computer Science", duration: "4 Years", credits: 160, feeAmount: 120000 },
  { id: "c2", code: "EC-201", name: "B.Tech Electronics & Comm.", department: "Electronics", duration: "4 Years", credits: 158, feeAmount: 110000 },
  { id: "c3", code: "EE-301", name: "B.Tech Electrical Eng.", department: "Electrical", duration: "4 Years", credits: 155, feeAmount: 105000 },
  { id: "c4", code: "ME-401", name: "B.Tech Mechanical Eng.", department: "Mechanical", duration: "4 Years", credits: 160, feeAmount: 100000 },
  { id: "c5", code: "CA-501", name: "Master of Computer App (MCA)", department: "Computer Applications", duration: "2 Years", credits: 90, feeAmount: 85000 },
  { id: "c6", code: "BA-601", name: "Master of Business Admin (MBA)", department: "Management", duration: "2 Years", credits: 84, feeAmount: 150000 }
];

export const INITIAL_FACULTY: Faculty[] = [
  { id: "f1", employeeId: "FAC-1001", name: "Dr. Alok Sharma", email: "alok.sharma@college.edu", phone: "9876543210", department: "Computer Science", designation: "Professor & HOD", courseIds: ["c1", "c5"], status: "Active" },
  { id: "f2", employeeId: "FAC-1002", name: "Prof. Priya Patel", email: "priya.patel@college.edu", phone: "9876543211", department: "Electronics", designation: "Associate Professor", courseIds: ["c2"], status: "Active" },
  { id: "f3", employeeId: "FAC-1003", name: "Dr. Rajesh Gupta", email: "rajesh.gupta@college.edu", phone: "9876543212", department: "Computer Science", designation: "Assistant Professor", courseIds: ["c1"], status: "Active" },
  { id: "f4", employeeId: "FAC-1004", name: "Prof. Vikram Singh", email: "vikram.singh@college.edu", phone: "9876543213", department: "Electrical", designation: "Assistant Professor", courseIds: ["c3"], status: "Active" },
  { id: "f5", employeeId: "FAC-1005", name: "Dr. Neha Kapoor", email: "neha.kapoor@college.edu", phone: "9876543214", department: "Management", designation: "Professor", courseIds: ["c6"], status: "Active" },
  { id: "f6", employeeId: "FAC-1006", name: "Prof. Amit Verma", email: "amit.verma@college.edu", phone: "9876543215", department: "Mechanical", designation: "Associate Professor", courseIds: ["c4"], status: "On Leave" }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: "s1", rollNo: "CS23101", name: "Aarav Singh", email: "aarav.singh@student.edu", phone: "8881112220", courseId: "c1", department: "Computer Science", semester: "Semester 4", joinedYear: 2023, status: "Active" },
  { id: "s2", rollNo: "CS23102", name: "Ananya Roy", email: "ananya.roy@student.edu", phone: "8881112221", courseId: "c1", department: "Computer Science", semester: "Semester 4", joinedYear: 2023, status: "Active" },
  { id: "s3", rollNo: "EC23201", name: "Ishaan Mehta", email: "ishaan.mehta@student.edu", phone: "8881112222", courseId: "c2", department: "Electronics", semester: "Semester 4", joinedYear: 2023, status: "Active" },
  { id: "s4", rollNo: "EE23301", name: "Diya Sharma", email: "diya.sharma@student.edu", phone: "8881112223", courseId: "c3", department: "Electrical", semester: "Semester 4", joinedYear: 2023, status: "Active" },
  { id: "s5", rollNo: "ME22401", name: "Kabir Verma", email: "kabir.verma@student.edu", phone: "8881112224", courseId: "c4", department: "Mechanical", semester: "Semester 6", joinedYear: 2022, status: "Active" },
  { id: "s6", rollNo: "CA24501", name: "Riya Sen", email: "riya.sen@student.edu", phone: "8881112225", courseId: "c5", department: "Computer Applications", semester: "Semester 2", joinedYear: 2024, status: "Active" },
  { id: "s7", rollNo: "BA24601", name: "Arjun Reddy", email: "arjun.reddy@student.edu", phone: "8881112226", courseId: "c6", department: "Management", semester: "Semester 2", joinedYear: 2024, status: "Active" },
  { id: "s8", rollNo: "CS23103", name: "Sneha Nair", email: "sneha.nair@student.edu", phone: "8881112227", courseId: "c1", department: "Computer Science", semester: "Semester 4", joinedYear: 2023, status: "Active" },
  { id: "s9", rollNo: "EC22202", name: "Rahul Malhotra", email: "rahul.malhotra@student.edu", phone: "8881112228", courseId: "c2", department: "Electronics", semester: "Semester 6", joinedYear: 2022, status: "Alumni" },
  { id: "s10", rollNo: "CS23104", name: "Vivek Joshi", email: "vivek.joshi@student.edu", phone: "8881112229", courseId: "c1", department: "Computer Science", semester: "Semester 4", joinedYear: 2023, status: "Suspended" }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Student 1 (Aarav) - 5 days
  { id: "a1", studentId: "s1", date: "2026-06-23", status: "Present" },
  { id: "a2", studentId: "s1", date: "2026-06-24", status: "Present" },
  { id: "a3", studentId: "s1", date: "2026-06-25", status: "Present" },
  { id: "a4", studentId: "s1", date: "2026-06-26", status: "Absent" },
  { id: "a5", studentId: "s1", date: "2026-06-27", status: "Present" },
  
  // Student 2 (Ananya)
  { id: "a6", studentId: "s2", date: "2026-06-23", status: "Present" },
  { id: "a7", studentId: "s2", date: "2026-06-24", status: "Present" },
  { id: "a8", studentId: "s2", date: "2026-06-25", status: "Present" },
  { id: "a9", studentId: "s2", date: "2026-06-26", status: "Present" },
  { id: "a10", studentId: "s2", date: "2026-06-27", status: "Present" },

  // Student 3 (Ishaan)
  { id: "a11", studentId: "s3", date: "2026-06-23", status: "Present" },
  { id: "a12", studentId: "s3", date: "2026-06-24", status: "Absent" },
  { id: "a13", studentId: "s3", date: "2026-06-25", status: "Present" },
  { id: "a14", studentId: "s3", date: "2026-06-26", status: "Present" },
  { id: "a15", studentId: "s3", date: "2026-06-27", status: "Present" },

  // Student 4 (Diya)
  { id: "a16", studentId: "s4", date: "2026-06-23", status: "Absent" },
  { id: "a17", studentId: "s4", date: "2026-06-24", status: "Absent" },
  { id: "a18", studentId: "s4", date: "2026-06-25", status: "Present" },
  { id: "a19", studentId: "s4", date: "2026-06-26", status: "Present" },
  { id: "a20", studentId: "s4", date: "2026-06-27", status: "Present" },

  // Student 5 (Kabir)
  { id: "a21", studentId: "s5", date: "2026-06-23", status: "Present" },
  { id: "a22", studentId: "s5", date: "2026-06-24", status: "Present" },
  { id: "a23", studentId: "s5", date: "2026-06-25", status: "Present" },
  { id: "a24", studentId: "s5", date: "2026-06-26", status: "Present" },
  { id: "a25", studentId: "s5", date: "2026-06-27", status: "Absent" },

  // Student 6 (Riya)
  { id: "a26", studentId: "s6", date: "2026-06-23", status: "Present" },
  { id: "a27", studentId: "s6", date: "2026-06-24", status: "Present" },
  { id: "a28", studentId: "s6", date: "2026-06-25", status: "Present" },
  { id: "a29", studentId: "s6", date: "2026-06-26", status: "Present" },
  { id: "a30", studentId: "s6", date: "2026-06-27", status: "Present" }
];

export const INITIAL_FEES: FeeRecord[] = [
  { id: "f_rec1", studentId: "s1", totalAmount: 120000, paidAmount: 120000, lastPaymentDate: "2026-02-15", status: "Paid" },
  { id: "f_rec2", studentId: "s2", totalAmount: 120000, paidAmount: 80000, lastPaymentDate: "2026-03-10", status: "Partial" },
  { id: "f_rec3", studentId: "s3", totalAmount: 110000, paidAmount: 110000, lastPaymentDate: "2026-01-20", status: "Paid" },
  { id: "f_rec4", studentId: "s4", totalAmount: 105000, paidAmount: 0, status: "Pending" },
  { id: "f_rec5", studentId: "s5", totalAmount: 100000, paidAmount: 100000, lastPaymentDate: "2026-02-01", status: "Paid" },
  { id: "f_rec6", studentId: "s6", totalAmount: 85000, paidAmount: 45000, lastPaymentDate: "2026-04-05", status: "Partial" },
  { id: "f_rec7", studentId: "s7", totalAmount: 150000, paidAmount: 150000, lastPaymentDate: "2026-01-15", status: "Paid" },
  { id: "f_rec8", studentId: "s8", totalAmount: 120000, paidAmount: 0, status: "Pending" }
];

export const INITIAL_RESULTS: ResultRecord[] = [
  // Aarav (s1)
  { id: "r1", studentId: "s1", courseId: "c1", marks: 88, grade: "A", semester: "Semester 3" },
  { id: "r2", studentId: "s1", courseId: "c5", marks: 92, grade: "A+", semester: "Semester 3" },
  
  // Ananya (s2)
  { id: "r3", studentId: "s2", courseId: "c1", marks: 95, grade: "A+", semester: "Semester 3" },
  
  // Ishaan (s3)
  { id: "r4", studentId: "s3", courseId: "c2", marks: 76, grade: "B+", semester: "Semester 3" },
  
  // Diya (s4)
  { id: "r5", studentId: "s4", courseId: "c3", marks: 64, grade: "B", semester: "Semester 3" },
  
  // Kabir (s5)
  { id: "r6", studentId: "s5", courseId: "c4", marks: 82, grade: "A", semester: "Semester 5" },
  
  // Riya (s6)
  { id: "r7", studentId: "s6", courseId: "c5", marks: 89, grade: "A", semester: "Semester 1" }
];
