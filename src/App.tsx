import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CalendarChecklist } from './pages/CalendarChecklist';
import { Timetable, AttendanceRecord, AppSettings, ExtraClass, ClassSession, Exam } from './types';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { getTodayClasses } from './utils/mockOcr';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

export default function App() {
  const [timetable, setTimetable] = useLocalStorage<Timetable | null>('timetable', null);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('settings', {
    notificationsEnabled: true,
    reminderMinutesBefore: 10
  });
  const [notification, setNotification] = useState<{ 
    title: string, 
    body: string, 
    classId?: string, 
    subject?: string,
    date?: string 
  } | null>(null);

  // Handle marking attendance
  const markAttendance = useCallback((date: string, classId: string, subject: string, status: 'present' | 'absent') => {
    setAttendance(prev => {
      const filtered = prev.filter(r => !(r.date === date && r.classId === classId));
      return [...filtered, {
        date,
        classId,
        subject,
        status,
        timestamp: Date.now()
      }];
    });
  }, [setAttendance]);

  const markHoliday = useCallback((date: string) => {
    setTimetable(prev => {
      if (!prev) return prev;
      if ((prev.holidays || []).some(h => h.date === date)) return prev;
      return {
        ...prev,
        holidays: [...(prev.holidays || []), { date }]
      };
    });
    setNotification(null);
  }, [setTimetable]);

  const removeHoliday = useCallback((date: string) => {
    setTimetable(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        holidays: (prev.holidays || []).filter(h => h.date !== date)
      };
    });
  }, [setTimetable]);

  const addExtraClass = useCallback((extraClass: Omit<ExtraClass, 'id'>) => {
    const newClass = { ...extraClass, id: `extra-${Date.now()}` };
    setTimetable(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        extraClasses: [...(prev.extraClasses || []), newClass]
      };
    });
  }, [setTimetable]);

  const updateClass = useCallback((dayName: string, classId: string, updates: Partial<ClassSession>) => {
    setTimetable(prev => {
      if (!prev) return prev;
      const newSchedule = prev.schedule.map(day => {
        if (day.day === dayName) {
          return {
            ...day,
            classes: day.classes.map(c => c.id === classId ? { ...c, ...updates } : c)
          };
        }
        return day;
      });
      return { ...prev, schedule: newSchedule };
    });
  }, [setTimetable]);

  const updateExtraClass = useCallback((classId: string, updates: Partial<ExtraClass>) => {
    setTimetable(prev => {
      if (!prev) return prev;
      const newExtraClasses = (prev.extraClasses || []).map(c => 
        c.id === classId ? { ...c, ...updates } : c
      );
      return { ...prev, extraClasses: newExtraClasses };
    });
  }, [setTimetable]);

  const deleteClass = useCallback((dayName: string, classId: string) => {
    setTimetable(prev => {
      if (!prev) return prev;
      const newSchedule = prev.schedule.map(day => {
        if (day.day === dayName) {
          return {
            ...day,
            classes: day.classes.filter(c => c.id !== classId)
          };
        }
        return day;
      });
      return { ...prev, schedule: newSchedule };
    });
  }, [setTimetable]);

  const deleteExtraClass = useCallback((classId: string) => {
    setTimetable(prev => {
      if (!prev) return prev;
      const newExtraClasses = (prev.extraClasses || []).filter(c => c.id !== classId);
      return { ...prev, extraClasses: newExtraClasses };
    });
  }, [setTimetable]);

  const addExam = useCallback((exam: Omit<Exam, 'id'>) => {
    const newExam = { ...exam, id: `exam-${Date.now()}` };
    setTimetable(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exams: [...(prev.exams || []), newExam]
      };
    });
  }, [setTimetable]);

  const updateExam = useCallback((examId: string, updates: Partial<Exam>) => {
    setTimetable(prev => {
      if (!prev) return prev;
      const newExams = (prev.exams || []).map(e => 
        e.id === examId ? { ...e, ...updates } : e
      );
      return { ...prev, exams: newExams };
    });
  }, [setTimetable]);

  const deleteExam = useCallback((examId: string) => {
    setTimetable(prev => {
      if (!prev) return prev;
      const newExams = (prev.exams || []).filter(e => e.id !== examId);
      return { ...prev, exams: newExams };
    });
  }, [setTimetable]);

  // Mark whole day attendance
  const markWholeDay = useCallback(() => {
    if (!timetable) return;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayClasses = getTodayClasses(timetable);
    const extraToday = (timetable.extraClasses || []).filter(c => c.date === todayStr);
    const examsToday = (timetable.exams || []).filter(e => e.date === todayStr);
    
    const allToday = [
      ...todayClasses,
      ...extraToday,
      ...examsToday.map(e => ({ id: e.id, subject: e.subject }))
    ];

    setAttendance(prev => {
      const filtered = prev.filter(r => r.date !== todayStr);
      const newRecords: AttendanceRecord[] = allToday.map(c => ({
        date: todayStr,
        classId: c.id,
        subject: c.subject,
        status: 'present',
        timestamp: Date.now()
      }));
      return [...filtered, ...newRecords];
    });
  }, [timetable, setAttendance]);

  // Notification simulation
  useEffect(() => {
    if (!settings.notificationsEnabled || !timetable) return;

    const todayClasses = getTodayClasses(timetable);
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // Add extra classes for today
    const extraToday = (timetable.extraClasses || []).filter(c => c.date === todayStr);
    const allToday = [...todayClasses, ...extraToday];

    // Check if it's a holiday
    if ((timetable.holidays || []).some(h => h.date === todayStr)) return;

    // Check if whole day is already marked
    const todayRecords = attendance.filter(r => r.date === todayStr);
    if (todayRecords.length === allToday.length && allToday.length > 0) return;

    // Check for exams tomorrow
    const tomorrow = addDays(new Date(), 1);
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
    const tomorrowExams = (timetable.exams || []).filter(e => e.date === tomorrowStr);

    if (tomorrowExams.length > 0) {
      const exam = tomorrowExams[0];
      setNotification({
        title: 'Upcoming Exam Tomorrow!',
        body: `Don't forget: ${exam.subject} (${exam.type}) is scheduled for tomorrow${exam.time ? ` at ${exam.time}` : ''}.`,
      });
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    allToday.forEach(session => {
      if (todayRecords.some(r => r.classId === session.id)) return;

      const [hours, minutes] = session.startTime.split(':').map(Number);
      const classTime = new Date();
      classTime.setHours(hours, minutes, 0, 0);
      
      const reminderTime = new Date(classTime.getTime() - settings.reminderMinutesBefore * 60000);
      const now = new Date();

      if (reminderTime > now) {
        const delay = reminderTime.getTime() - now.getTime();
        const timer = setTimeout(() => {
          setNotification({
            title: 'Class Reminder',
            body: `Your ${session.subject} class starts in ${settings.reminderMinutesBefore} minutes.`,
            classId: session.id,
            subject: session.subject,
            date: todayStr
          });
        }, delay);
        timers.push(timer);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [timetable, settings, attendance]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const clearAllData = () => {
    localStorage.removeItem('timetable');
    localStorage.removeItem('attendance');
    localStorage.removeItem('settings');
    setTimetable(null);
    setAttendance([]);
    window.location.href = '/';
  };

  useEffect(() => {
    (window as any).resetTimetable = () => {
      setTimetable(null);
      window.location.href = '/';
    };
  }, [setTimetable]);

  const onResetTimetable = () => {
    setTimetable(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <Layout>
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed left-4 right-4 top-4 z-[100] flex items-center gap-4 rounded-2xl bg-indigo-600 p-4 text-white shadow-2xl"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Bell size={20} />
              </div>
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => {
                  if (notification.classId) {
                    markAttendance(notification.date!, notification.classId!, notification.subject!, 'present');
                    setNotification(null);
                  }
                }}
              >
                <h5 className="font-bold text-sm">{notification.title}</h5>
                <p className="text-xs text-indigo-100">{notification.body}</p>
                {notification.classId && (
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAttendance(notification.date!, notification.classId!, notification.subject!, 'present');
                        setNotification(null);
                      }}
                      className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-indigo-600 shadow-sm"
                    >
                      Mark Present
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markHoliday(notification.date!);
                      }}
                      className="rounded-lg bg-indigo-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm border border-indigo-400"
                    >
                      Holiday
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => setNotification(null)} className="text-indigo-200 hover:text-white">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Routes>
          <Route 
            path="/" 
            element={
              !timetable ? (
                <LandingPage onTimetableGenerated={setTimetable} />
              ) : (
                <Dashboard 
                  timetable={timetable} 
                  attendance={attendance} 
                  onMarkAttendance={(id, sub, status) => markAttendance(format(new Date(), 'yyyy-MM-dd'), id, sub, status)}
                  onMarkWholeDay={markWholeDay}
                  onAddExtraClass={addExtraClass}
                  onMarkHoliday={markHoliday}
                  onRemoveHoliday={removeHoliday}
                  onUpdateClass={updateClass}
                  onUpdateExtraClass={updateExtraClass}
                  onDeleteClass={deleteClass}
                  onDeleteExtraClass={deleteExtraClass}
                  onUpdateExam={updateExam}
                  onDeleteExam={deleteExam}
                />
              )
            } 
          />
          <Route 
            path="/checklist" 
            element={
              timetable ? (
                <CalendarChecklist 
                  timetable={timetable} 
                  attendance={attendance} 
                  onMarkAttendance={markAttendance}
                  onMarkHoliday={markHoliday}
                  onRemoveHoliday={removeHoliday}
                  onUpdateClass={updateClass}
                  onUpdateExtraClass={updateExtraClass}
                  onDeleteClass={deleteClass}
                  onDeleteExtraClass={deleteExtraClass}
                  onAddExam={addExam}
                  onUpdateExam={updateExam}
                  onDeleteExam={deleteExam}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/analytics" 
            element={
              timetable ? (
                <Analytics attendance={attendance} timetable={timetable} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                settings={settings} 
                onUpdateSettings={setSettings} 
                onClearData={clearAllData}
                onResetTimetable={onResetTimetable}
              />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}
