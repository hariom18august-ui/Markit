import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { Timetable, AttendanceRecord, AttendanceStatus, ClassSession, ExtraClass, Exam } from '../types';
import { cn } from '../utils/cn';
import { EditClassModal } from '../components/EditClassModal';
import { ExamModal } from '../components/ExamModal';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths,
  getDay,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { Plus, GraduationCap } from 'lucide-react';

interface CalendarChecklistProps {
  timetable: Timetable;
  attendance: AttendanceRecord[];
  onMarkAttendance: (date: string, classId: string, subject: string, status: 'present' | 'absent') => void;
  onMarkHoliday: (date: string) => void;
  onRemoveHoliday: (date: string) => void;
  onUpdateClass: (dayName: string, classId: string, updates: Partial<ClassSession>) => void;
  onUpdateExtraClass: (classId: string, updates: Partial<ExtraClass>) => void;
  onDeleteClass: (dayName: string, classId: string) => void;
  onDeleteExtraClass: (classId: string) => void;
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onUpdateExam: (examId: string, updates: Partial<Exam>) => void;
  onDeleteExam: (examId: string) => void;
}

export const CalendarChecklist = ({ 
  timetable, 
  attendance, 
  onMarkAttendance,
  onMarkHoliday,
  onRemoveHoliday,
  onUpdateClass,
  onUpdateExtraClass,
  onDeleteClass,
  onDeleteExtraClass,
  onAddExam,
  onUpdateExam,
  onDeleteExam
}: CalendarChecklistProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'list' | 'grid' | 'calendar'>('calendar');
  const [editingClass, setEditingClass] = React.useState<{
    id: string;
    subject: string;
    startTime: string;
    endTime: string;
    room?: string;
    date?: string;
    dayName?: string;
    isExtra?: boolean;
  } | null>(null);
  const [editingExam, setEditingExam] = React.useState<Exam | null>(null);
  const [showExamModal, setShowExamModal] = React.useState(false);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getClassesForDate = (date: Date) => {
    const dayName = format(date, 'EEEE');
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const regularClasses = timetable.schedule.find(d => d.day === dayName)?.classes || [];
    const extraClasses = (timetable.extraClasses || []).filter(c => c.date === dateStr);
    
    return [...regularClasses, ...extraClasses];
  };

  const getAttendanceStatus = (dateStr: string, classId: string): AttendanceStatus => {
    const record = attendance.find(r => r.date === dateStr && r.classId === classId);
    return record?.status || 'pending';
  };

  const isHoliday = (dateStr: string) => (timetable.holidays || []).some(h => h.date === dateStr);

  const getExamsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return (timetable.exams || []).filter(e => e.date === dateStr);
  };

  const handleSaveEdit = (updates: Partial<ClassSession>) => {
    if (!editingClass) return;
    if (editingClass.isExtra) {
      onUpdateExtraClass(editingClass.id, updates);
    } else if (editingClass.dayName) {
      onUpdateClass(editingClass.dayName, editingClass.id, updates);
    }
  };

  const handleDeleteClass = () => {
    if (!editingClass) return;
    if (editingClass.isExtra) {
      onDeleteExtraClass(editingClass.id);
    } else if (editingClass.dayName) {
      onDeleteClass(editingClass.dayName, editingClass.id);
    }
  };

  const handleSaveExam = (examData: Omit<Exam, 'id'>) => {
    if (editingExam) {
      onUpdateExam(editingExam.id, examData);
    } else {
      onAddExam(examData);
    }
    setEditingExam(null);
    setShowExamModal(false);
  };

  const handleDeleteExam = () => {
    if (editingExam) {
      onDeleteExam(editingExam.id);
      setEditingExam(null);
      setShowExamModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Monthly Schedule</h2>
          <div className="mt-1 flex items-center gap-2">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-slate-700">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button 
            onClick={() => setViewMode('calendar')}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all sm:px-4 sm:text-xs",
              viewMode === 'calendar' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Calendar
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all sm:px-4 sm:text-xs",
              viewMode === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            List
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all sm:px-4 sm:text-xs",
              viewMode === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Excel
          </button>
        </div>

        <button 
          onClick={() => setShowExamModal(true)}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
        >
          <Plus size={16} />
          Add Exam
        </button>
      </div>

      <EditClassModal 
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteClass}
        initialData={editingClass || { subject: '', startTime: '', endTime: '' }}
      />

      <ExamModal 
        isOpen={showExamModal || !!editingExam}
        onClose={() => {
          setShowExamModal(false);
          setEditingExam(null);
        }}
        onSave={handleSaveExam}
        onDelete={handleDeleteExam}
        initialData={editingExam || undefined}
      />

      {viewMode === 'calendar' ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const holiday = isHoliday(dateStr);
              const classes = getClassesForDate(day);
              const exams = getExamsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div 
                  key={dateStr}
                  className={cn(
                    "min-h-[100px] border-r border-b border-slate-100 p-1 transition-colors relative",
                    !isCurrentMonth && "bg-slate-50/50 opacity-40",
                    isToday(day) && "bg-indigo-50/30",
                    holiday && "bg-amber-50/50",
                    exams.length > 0 && "bg-rose-50/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1 px-1">
                    <span className={cn(
                      "text-xs font-bold",
                      isToday(day) ? "text-indigo-600" : "text-slate-400",
                      holiday && "text-amber-600",
                      exams.length > 0 && "text-rose-600"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {isCurrentMonth && (
                      <div className="flex gap-1">
                        {exams.length > 0 && (
                          <div className="text-rose-500">
                            <GraduationCap size={10} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isCurrentMonth && (
                    <div className="space-y-1">
                      {/* Exams */}
                      {exams.map(exam => (
                        <div 
                          key={exam.id}
                          onClick={() => setEditingExam(exam)}
                          className="rounded-md bg-rose-600 p-1 text-[8px] font-bold text-white cursor-pointer hover:bg-rose-700 transition-all flex items-center gap-1"
                        >
                          <GraduationCap size={8} />
                          <span className="truncate">{exam.subject} ({exam.type})</span>
                        </div>
                      ))}

                      {!holiday && classes.map(cls => {
                        const status = getAttendanceStatus(dateStr, cls.id);
                        if (status === 'pending') return null;
                        return (
                          <div 
                            key={cls.id}
                            className={cn(
                              "rounded-md p-1 text-[9px] font-bold border text-center text-white",
                              status === 'present' ? "bg-emerald-500 border-emerald-600" : "bg-rose-500 border-rose-600"
                            )}
                          >
                            <span className="truncate block">
                              {cls.subject}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {isCurrentMonth && holiday && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[8px] font-bold text-amber-500/30 uppercase tracking-widest rotate-[-45deg]">Holiday</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {days.map((day) => {
            const classes = getClassesForDate(day);
            const exams = getExamsForDate(day);
            const dateStr = format(day, 'yyyy-MM-dd');
            const holiday = isHoliday(dateStr);
            
            if (classes.length === 0 && !holiday && exams.length === 0) return null;

            return (
              <motion.div 
                key={dateStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl border p-4 transition-all",
                  holiday ? "border-amber-100 bg-amber-50/30" :
                  exams.length > 0 ? "border-rose-100 bg-rose-50/30" :
                  isToday(day) ? "border-indigo-200 bg-indigo-50/30 ring-1 ring-indigo-100" : "border-slate-100 bg-white"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                      holiday ? "bg-amber-500 text-white" :
                      exams.length > 0 ? "bg-rose-600 text-white" :
                      isToday(day) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {format(day, 'd')}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{format(day, 'EEEE')}</span>
                      {holiday && <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Holiday</span>}
                      {exams.length > 0 && <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Exam Day</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isToday(day) && !holiday && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 uppercase">Today</span>
                    )}
                    <button 
                      onClick={() => holiday ? onRemoveHoliday(dateStr) : onMarkHoliday(dateStr)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm",
                        holiday ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {holiday ? 'Holiday' : 'Mark Holiday'}
                    </button>
                  </div>
                </div>

                {exams.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {exams.map(exam => (
                      <div 
                        key={exam.id} 
                        onClick={() => setEditingExam(exam)}
                        className="flex items-center justify-between rounded-xl bg-rose-600 p-3 text-white cursor-pointer hover:bg-rose-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <GraduationCap size={20} />
                          <div>
                            <div className="text-sm font-bold">{exam.subject}</div>
                            <div className="text-[10px] opacity-80">{exam.type}{exam.time ? ` • ${exam.time}` : ''}{exam.room ? ` • ${exam.room}` : ''}</div>
                          </div>
                        </div>
                        <Edit2 size={14} />
                      </div>
                    ))}
                  </div>
                )}

                {!holiday && (
                  <div className="space-y-2">
                    {classes.map((cls) => {
                      const status = getAttendanceStatus(dateStr, cls.id);
                      return (
                        <div key={cls.id} className="flex items-center justify-between group">
                          <div className="flex flex-col flex-1 cursor-pointer group" onClick={() => setEditingClass({
                            ...cls,
                            dayName: format(day, 'EEEE'),
                            isExtra: (timetable.extraClasses || []).some(c => c.id === cls.id)
                          })}>
                            <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{cls.subject}</span>
                            <span className="text-[10px] text-slate-400">{cls.startTime} - {cls.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {status !== 'pending' ? (
                              <button 
                                onClick={() => onMarkAttendance(dateStr, cls.id, cls.subject, status === 'present' ? 'absent' : 'present')}
                                className={cn(
                                  "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all",
                                  status === 'present' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                )}
                              >
                                {status === 'present' ? <Check size={10} /> : <X size={10} />}
                                {status}
                              </button>
                            ) : (
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => onMarkAttendance(dateStr, cls.id, cls.subject, 'present')}
                                  className="h-6 w-6 rounded-full bg-slate-50 text-slate-300 hover:bg-emerald-50 hover:text-emerald-500 flex items-center justify-center transition-colors"
                                >
                                  <Check size={12} />
                                </button>
                                <button 
                                  onClick={() => onMarkAttendance(dateStr, cls.id, cls.subject, 'absent')}
                                  className="h-6 w-6 rounded-full bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 p-3 font-bold text-slate-700">Date</th>
                {timeSlots.map(slot => (
                  <th key={slot} className="border-b border-r border-slate-200 p-3 font-bold text-slate-700 text-center min-w-[100px]">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const holiday = isHoliday(dateStr);
                const classes = getClassesForDate(day);
                
                return (
                  <tr key={dateStr} className={cn(
                    "hover:bg-slate-50/50 transition-colors",
                    holiday && "bg-amber-50/30"
                  )}>
                    <td className={cn(
                      "sticky left-0 z-10 border-b border-r border-slate-200 p-3 font-medium",
                      isToday(day) ? "bg-indigo-50 text-indigo-700" : "bg-white text-slate-600",
                      holiday && "bg-amber-50"
                    )}>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{format(day, 'dd')} {format(day, 'MMM')}</span>
                        <span className="text-[10px] opacity-70">{format(day, 'EEE')}</span>
                        <button 
                          onClick={() => holiday ? onRemoveHoliday(dateStr) : onMarkHoliday(dateStr)}
                          className={cn(
                            "mt-1 rounded px-1 py-0.5 text-[8px] font-bold uppercase transition-all",
                            holiday ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          )}
                        >
                          {holiday ? 'Holiday' : 'Mark Holiday'}
                        </button>
                      </div>
                    </td>
                    {timeSlots.map(slot => {
                      const classAtSlot = classes.find(c => c.startTime.startsWith(slot.split(':')[0]));
                      const status = classAtSlot ? getAttendanceStatus(dateStr, classAtSlot.id) : null;
                      
                      return (
                        <td key={slot} className="border-b border-r border-slate-200 p-1 text-center">
                          {holiday ? (
                            <span className="text-[9px] text-amber-400 font-bold uppercase">Holiday</span>
                          ) : classAtSlot ? (
                            <div className={cn(
                              "flex h-full flex-col items-center justify-center rounded-lg p-1.5 transition-all border group relative min-h-[60px]",
                              status === 'present' ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100/50" :
                              status === 'absent' ? "bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-100/50" :
                              "bg-slate-50 border-slate-200 text-slate-600"
                            )}>
                              <button 
                                onClick={() => setEditingClass({
                                  ...classAtSlot,
                                  dayName: format(day, 'EEEE'),
                                  isExtra: (timetable.extraClasses || []).some(c => c.id === classAtSlot.id)
                                })}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/80 text-slate-400 hover:text-indigo-600"
                              >
                                <Edit2 size={10} />
                              </button>
                              <span className="font-bold text-[10px] leading-tight mb-2 truncate w-full text-center">
                                {classAtSlot.subject}
                              </span>
                              {status !== 'pending' ? (
                                <button 
                                  onClick={() => onMarkAttendance(dateStr, classAtSlot.id, classAtSlot.subject, status === 'present' ? 'absent' : 'present')}
                                  className={cn(
                                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider transition-all shadow-sm",
                                    status === 'present' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                  )}
                                >
                                  {status === 'present' ? <Check size={8} /> : <X size={8} />}
                                  {status}
                                </button>
                              ) : (
                                <div className="flex gap-1.5">
                                  <button 
                                    onClick={() => onMarkAttendance(dateStr, classAtSlot.id, classAtSlot.subject, 'present')}
                                    className="h-6 w-6 rounded-full bg-white border border-slate-200 text-slate-300 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-500 flex items-center justify-center transition-all shadow-sm"
                                    title="Mark Present"
                                  >
                                    <Check size={12} />
                                  </button>
                                  <button 
                                    onClick={() => onMarkAttendance(dateStr, classAtSlot.id, classAtSlot.subject, 'absent')}
                                    className="h-6 w-6 rounded-full bg-white border border-slate-200 text-slate-300 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all shadow-sm"
                                    title="Mark Absent"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
