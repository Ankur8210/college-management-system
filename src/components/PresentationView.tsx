/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Presentation, 
  AlertCircle, 
  CheckCircle, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  FlipHorizontal,
  Layers,
  Code,
  Table
} from 'lucide-react';
import { INITIAL_SLIDES, INITIAL_VIVA_QUESTIONS } from '../data';
import { PresentationSlide, VivaQuestion } from '../types';

// Map icon names to Lucide icons
const iconMap: Record<string, any> = {
  Presentation,
  AlertCircle,
  CheckCircle,
  Cpu,
  Database,
  ShieldCheck,
  Award
};

export default function PresentationView() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [language, setLanguage] = useState<'both' | 'hinglish' | 'english'>('both');
  const [vivaCategory, setVivaCategory] = useState<string>('All');
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'deck' | 'viva' | 'tech'>('deck');

  const currentSlide = INITIAL_SLIDES[currentSlideIndex];
  const IconComponent = iconMap[currentSlide.iconName] || Presentation;

  const nextSlide = () => {
    if (currentSlideIndex < INITIAL_SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Viva filter
  const categories = ['All', 'General', 'Database', 'Backend', 'Security'];
  const filteredQuestions = vivaCategory === 'All'
    ? INITIAL_VIVA_QUESTIONS
    : INITIAL_VIVA_QUESTIONS.filter(q => q.category === vivaCategory);

  return (
    <div className="space-y-8" id="presentation-container">
      {/* Sub Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4" id="presentation-subnav">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Project Companion Guide</h2>
          <p className="text-sm text-slate-500">Perfect guide to present, promote, or prepare for your College Management System project viva.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200" id="deck-tabs">
          <button
            id="tab-deck-btn"
            onClick={() => setActiveTab('deck')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'deck'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="inline-block w-4 h-4 mr-2" />
            Presentation Deck
          </button>
          <button
            id="tab-viva-btn"
            onClick={() => setActiveTab('viva')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'viva'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="inline-block w-4 h-4 mr-2" />
            Viva / Q&A Prep
          </button>
          <button
            id="tab-tech-btn"
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'tech'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="inline-block w-4 h-4 mr-2" />
            Tech Architecture
          </button>
        </div>
      </div>

      {/* 1. PRESENTATION DECK TAB */}
      {activeTab === 'deck' && (
        <div className="space-y-6" id="presentation-deck-tab">
          {/* Deck Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                {currentSlide.step}
              </span>
              <div>
                <span className="text-xs uppercase font-semibold text-blue-700 tracking-wider">Step {currentSlide.step} of 7</span>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{currentSlide.title}</h3>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Content Mode:</span>
              <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-sm">
                <button
                  id="lang-both"
                  onClick={() => setLanguage('both')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    language === 'both' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Dual Lang
                </button>
                <button
                  id="lang-hinglish"
                  onClick={() => setLanguage('hinglish')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    language === 'hinglish' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Hindi / Hinglish
                </button>
                <button
                  id="lang-english"
                  onClick={() => setLanguage('english')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    language === 'english' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Slide Stage Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[420px]" id="slide-stage">
            {/* Left side: Main slide quote/heading */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              {/* Background Accent Deco */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full opacity-60 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-inner">
                  <IconComponent className="w-8 h-8" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentSlideIndex}-${language}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* HINGLISH CONTENT */}
                    {(language === 'both' || language === 'hinglish') && (
                      <div className="space-y-2 border-l-4 border-blue-500 pl-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Hinglish / Hindi Presentation Script</span>
                        <h4 className="text-2xl font-bold text-slate-800 leading-tight">
                          "{currentSlide.hindiHeading}"
                        </h4>
                        <p className="text-slate-600 italic text-lg font-sans leading-relaxed">
                          "{currentSlide.hindiContent}"
                        </p>
                      </div>
                    )}

                    {/* ENGLISH CONTENT */}
                    {(language === 'both' || language === 'english') && (
                      <div className="space-y-2 border-l-4 border-blue-500 pl-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">English Presentation Script</span>
                        <h4 className="text-2xl font-bold text-slate-800 leading-tight">
                          {currentSlide.englishHeading}
                        </h4>
                        <p className="text-slate-600 text-lg font-sans leading-relaxed">
                          {currentSlide.englishContent}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress dots at bottom */}
              <div className="flex items-center gap-2 mt-8 border-t border-slate-100 pt-6">
                {INITIAL_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.step}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                    title={`Go to Slide ${slide.step}`}
                  />
                ))}
              </div>
            </div>

            {/* Right side: Key Details & Technical notes */}
            <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-2xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
              {/* Grid background effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Presentation Bullet Points</span>
                </div>

                <p className="text-xs text-slate-400">Use these bullet points directly on your PPT slides or during viva explanation:</p>

                <ul className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlideIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {currentSlide.details.map((detail, index) => (
                        <motion.li 
                          key={index} 
                          initial={{ x: 15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 text-sm text-slate-300 font-sans"
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold shrink-0 mt-0.5 border border-blue-500/30">
                            {index + 1}
                          </span>
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </ul>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-800 relative z-10">
                <button
                  id="slide-prev-btn"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    currentSlideIndex === 0
                      ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  id="slide-next-btn"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === INITIAL_SLIDES.length - 1}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentSlideIndex === INITIAL_SLIDES.length - 1
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIVA / Q&A PREPARATION TAB */}
      {activeTab === 'viva' && (
        <div className="space-y-6 animate-fadeIn" id="presentation-viva-tab">
          {/* Filters & Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">Virtual Viva Exam Practice</h3>
              <p className="text-xs text-slate-500">Flip the flashcards to test your knowledge of College Management System concepts.</p>
            </div>
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              {categories.map(cat => (
                <button
                  key={cat}
                  id={`viva-cat-${cat}`}
                  onClick={() => {
                    setVivaCategory(cat);
                    setFlippedCardId(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    vivaCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="viva-cards-grid">
            {filteredQuestions.map((item, index) => {
              const isFlipped = flippedCardId === index;
              return (
                <div
                  key={index}
                  id={`viva-card-${index}`}
                  onClick={() => setFlippedCardId(isFlipped ? null : index)}
                  className="h-72 cursor-pointer group perspective"
                >
                  <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front of Card: Question */}
                    <div className="absolute inset-0 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all backface-hidden">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            item.category === 'Database' ? 'bg-amber-100 text-amber-700' :
                            item.category === 'Backend' ? 'bg-purple-100 text-purple-700' :
                            item.category === 'Security' ? 'bg-rose-100 text-rose-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">Q. {index + 1}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-700 transition-colors">
                            {item.question}
                          </h4>
                          {item.hindiQuestion && (
                            <p className="text-xs text-slate-500 italic leading-relaxed">
                              Hindi: "{item.hindiQuestion}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1">
                          <FlipHorizontal className="w-3.5 h-3.5" /> Click card to reveal answer
                        </span>
                        <span className="font-semibold text-blue-600 group-hover:underline">Reveal →</span>
                      </div>
                    </div>

                    {/* Back of Card: Answer */}
                    <div className="absolute inset-0 bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg rotate-y-180 backface-hidden">
                      <div className="space-y-3 overflow-y-auto max-h-[190px] pr-1 scrollbar-thin">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Answer Explanation</span>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {item.answer}
                        </p>
                        {item.hindiAnswer && (
                          <p className="text-xs text-slate-400 italic border-t border-slate-800 pt-2 leading-relaxed font-sans">
                            Hindi: "{item.hindiAnswer}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
                        <span className="flex items-center gap-1 text-slate-400">
                          <FlipHorizontal className="w-3.5 h-3.5 text-blue-500" /> Click to hide answer
                        </span>
                        <span className="text-blue-400 font-bold">Flip back</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TECHNOLOGY ARCHITECTURE EXPLORER */}
      {activeTab === 'tech' && (
        <div className="space-y-6 animate-fadeIn" id="presentation-tech-tab">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Relational Database & Backend Flow Architecture</h3>
            <p className="text-sm text-slate-500 mb-6">Learn how the frontend, Java backend controllers, and MySQL Database tables map together to execute real requests.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
              
              {/* Box 1: Frontend Client */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Client Browser (Frontend)</h4>
                    <span className="text-[10px] font-medium text-slate-400">HTML5 | Tailwind CSS | React</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Users fill out administrative forms or select filters. The web client compiles data into an HTTP request and dispatches it via API calls.
                </p>
                <div className="space-y-2 text-[11px] font-mono bg-white border border-slate-100 p-2.5 rounded-lg text-slate-600 shadow-inner">
                  <div className="text-blue-700 font-semibold">POST /api/students</div>
                  <div>Headers: {"{ Authorization: 'Bearer JWT_TOKEN' }"}</div>
                  <div>Body: {"{ name: 'Rohan', courseId: 'c1' }"}</div>
                </div>
              </div>

              {/* Box 2: Backend Logic Layer */}
              <div className="border border-slate-200 rounded-xl p-5 bg-blue-50/30 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Java Server Application</h4>
                    <span className="text-[10px] font-medium text-slate-400">Spring Boot | MVC | JPA Hibernate</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Java receives requests, filters them through interceptors to authorize permissions, applies constraints, and transforms model structures.
                </p>
                <div className="space-y-2 text-[11px] font-mono bg-white border border-slate-100 p-2.5 rounded-lg text-slate-600 shadow-inner">
                  <div className="text-blue-700 font-semibold">@RestController @PostMapping</div>
                  <div>Student saveStudent(@RequestBody Student s)</div>
                  <div className="text-slate-400">// Triggers database insertion</div>
                  <div>studentRepository.save(s);</div>
                </div>
              </div>

              {/* Box 3: Database Storage */}
              <div className="border border-slate-200 rounded-xl p-5 bg-amber-50/30 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">MySQL Database Storage</h4>
                    <span className="text-[10px] font-medium text-slate-400">Structured Tables | SQL Schema</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  The final repository of records. Tables are linked to prevent orphan data and keep entities perfectly consistent.
                </p>
                <div className="space-y-2 text-[11px] font-mono bg-white border border-slate-100 p-2.5 rounded-lg text-slate-600 shadow-inner">
                  <div className="text-amber-700 font-semibold">INSERT INTO students VALUES(...)</div>
                  <div className="border-t border-slate-100 pt-1 mt-1 text-[10px] text-slate-500">
                    <strong>Primary Key:</strong> id (uuid)<br/>
                    <strong>Foreign Key:</strong> course_id REFERENCES courses(id)
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Database Relations Map */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md border border-slate-800">
            <h4 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              MySQL Relational Schema Map (Entity Relations)
            </h4>
            <p className="text-xs text-slate-400 mb-6">This structure ensures complete referential integrity. Let's see how our simulated MySQL tables relate to each other:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-400">Table: courses</span>
                <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                  <li className="text-amber-400 font-semibold">id (VARCHAR, PK)</li>
                  <li>code (VARCHAR)</li>
                  <li>name (VARCHAR)</li>
                  <li>department (VARCHAR)</li>
                  <li>credits (INT)</li>
                  <li>fee_amount (DECIMAL)</li>
                </ul>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
                <span className="text-[10px] uppercase font-bold text-blue-400">Table: students</span>
                <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                  <li className="text-amber-400 font-semibold">id (VARCHAR, PK)</li>
                  <li>roll_no (VARCHAR, UNIQUE)</li>
                  <li>name (VARCHAR)</li>
                  <li>email (VARCHAR)</li>
                  <li className="text-blue-400 font-semibold">course_id (VARCHAR, FK) → courses.id</li>
                  <li>semester (VARCHAR)</li>
                </ul>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-400">Table: faculty</span>
                <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                  <li className="text-amber-400 font-semibold">id (VARCHAR, PK)</li>
                  <li>employee_id (VARCHAR, UNIQUE)</li>
                  <li>name (VARCHAR)</li>
                  <li>email (VARCHAR)</li>
                  <li>department (VARCHAR)</li>
                </ul>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-400">Table: attendance</span>
                <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                  <li className="text-amber-400 font-semibold">id (VARCHAR, PK)</li>
                  <li className="text-blue-400 font-semibold">student_id (VARCHAR, FK) → students.id</li>
                  <li>date (DATE)</li>
                  <li>status (VARCHAR)</li>
                </ul>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-400">Table: fees</span>
                <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                  <li className="text-amber-400 font-semibold">id (VARCHAR, PK)</li>
                  <li className="text-blue-400 font-semibold">student_id (VARCHAR, FK) → students.id</li>
                  <li>total_amount (DECIMAL)</li>
                  <li>paid_amount (DECIMAL)</li>
                  <li>status (VARCHAR)</li>
                </ul>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-400">Table: exam_results</span>
                <ul className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
                  <li className="text-amber-400 font-semibold">id (VARCHAR, PK)</li>
                  <li className="text-blue-400 font-semibold">student_id (VARCHAR, FK) → students.id</li>
                  <li className="text-blue-400 font-semibold">course_id (VARCHAR, FK) → courses.id</li>
                  <li>marks (INT)</li>
                  <li>grade (VARCHAR)</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
