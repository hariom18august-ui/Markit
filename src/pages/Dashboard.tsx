import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Clock, MapPin, CalendarCheck, GraduationCap } from 'lucide-react';
import { Timetable, AttendanceRecord, ClassSession, AttendanceStatus, ExtraClass, Exam } from '../types';
import { getTodayClasses } from '../utils/mockOcr';
import { cn } from '../utils/cn';
import { format } from 'date-fns';
import { EditClassModal } from '../components/EditClassModal';
import { ExamModal } from '../components/ExamModal';

interface DashboardProps {
  timetable: Timetable;
  attendance: AttendanceRecord[];
  onMarkAttendance: (classId: string, subject: string, status: 'present' | 'absent') => void;
  onMarkWholeDay: () => void;
  onAddExtraClass: (extraClass: Omit<ExtraClass, 'id'>) => void;
  onMarkHoliday: (date: string) => void;
  onRemoveHoliday: (date: string) => void;
  onUpdateClass: (dayName: string, classId: string, updates: Partial<ClassSession>) => void;
  onUpdateExtraClass: (classId: string, updates: Partial<ExtraClass>) => void;
  onDeleteClass: (dayName: string, classId: string) => void;
  onDeleteExtraClass: (classId: string) => void;
  onUpdateExam: (examId: string, updates: Partial<Exam>) => void;
  onDeleteExam: (examId: string) => void;
}

export const Dashboard = ({ 
  timetable, 
  attendance, 
  onMarkAttendance, 
  onMarkWholeDay, 
  onAddExtraClass,
  onMarkHoliday,
  onRemoveHoliday,
  onUpdateClass,
  onUpdateExtraClass,
  onDeleteClass,
  onDeleteExtraClass,
  onUpdateExam,
  onDeleteExam
}: DashboardProps) => {
  const [showExtraForm, setShowExtraForm] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<{
    id: string;
    subject: string;
    startTime: string;
    endTime: string;
    room?: string;
    isExtra?: boolean;
  } | null>(null);
  const [editingExam, setEditingExam] = React.useState<Exam | null>(null);
  const [extraClassData, setExtraClassData] = React.useState({
    subject: '',
    startTime: '09:00',
    endTime: '10:00',
    room: ''
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayClasses = getTodayClasses(timetable);
  const extraToday = (timetable.extraClasses || []).filter(c => c.date === todayStr);
  const todayExams = (timetable.exams || []).filter(e => e.date === todayStr);
  
  const allToday = [...todayClasses, ...extraToday];
  const progressItems = [...allToday, ...todayExams];
  
  const isHoliday = (timetable.holidays || []).some(h => h.date === todayStr);

  const getStatus = (classId: string) => {
    const record = attendance.find(r => r.date === todayStr && r.classId === classId);
    return record?.status || 'pending';
  };

  const stats = {
    total: attendance.length,
    present: attendance.filter(r => r.status === 'present').length,
  };
  const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
  const todayProgress = progressItems.length > 0 
    ? Math.round((progressItems.filter(c => getStatus(c.id) !== 'pending').length / progressItems.length) * 100) 
    : 0;

  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExtraClass({
      ...extraClassData,
      date: todayStr
    });
    setShowExtraForm(false);
    setExtraClassData({ subject: '', startTime: '09:00', endTime: '10:00', room: '' });
  };

  const handleSaveEdit = (updates: Partial<ClassSession>) => {
    if (!editingClass) return;
    if (editingClass.isExtra) {
      onUpdateExtraClass(editingClass.id, updates);
    } else {
      onUpdateClass(todayName, editingClass.id, updates);
    }
  };

  const handleDeleteClass = () => {
    if (!editingClass) return;
    if (editingClass.isExtra) {
      onDeleteExtraClass(editingClass.id);
    } else {
      onDeleteClass(todayName, editingClass.id);
    }
  };

  const handleSaveExam = (examData: Omit<Exam, 'id'>) => {
    if (editingExam) {
      onUpdateExam(editingExam.id, examData);
    }
    setEditingExam(null);
  };

  const handleDeleteExam = () => {
    if (editingExam) {
      onDeleteExam(editingExam.id);
      setEditingExam(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-200"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">Overall Attendance</p>
            <h3 className="mt-1 text-4xl font-bold">{percentage}%</h3>
            <p className="mt-2 text-xs text-indigo-100">
              Keep it up! You've attended {stats.present} classes.
            </p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-400/30 bg-indigo-500/20 backdrop-blur-sm">
            <CalendarCheck size={32} />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 relative z-10">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
            <span>Today's Progress</span>
            <span>{todayProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-900/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${todayProgress}%` }}
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            />
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl"></div>
      </motion.div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Today's Schedule</h2>
          <p className="text-sm text-slate-500">{format(new Date(), 'EEEE, MMMM do')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowExtraForm(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={onMarkWholeDay}
            className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            Mark Whole Day
          </button>
        </div>
      </div>

      {todayExams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap size={16} />
            Today's Exams
          </h3>
          {todayExams.map(exam => {
            const status = getStatus(exam.id);
            return (
              <motion.div 
                key={exam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl p-4 text-white shadow-lg transition-all",
                  status === 'present' ? "bg-emerald-600 shadow-emerald-200" :
                  status === 'absent' ? "bg-rose-700 shadow-rose-200" : "bg-rose-600 shadow-rose-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex flex-1 items-center gap-3 cursor-pointer"
                    onClick={() => setEditingExam(exam)}
                  >
                    <div className="rounded-xl bg-white/20 p-2">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">{exam.subject}</h4>
                      <p className="text-xs text-rose-100">{exam.type}{exam.time ? ` • ${exam.time}` : ''}{exam.room ? ` • ${exam.room}` : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => onMarkAttendance(exam.id, exam.subject, 'present')}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                          title="Mark Present"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => onMarkAttendance(exam.id, exam.subject, 'absent')}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                          title="Mark Absent"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase">
                        {status}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {isHoliday && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-center space-y-3">
          <p className="text-sm font-medium text-amber-700">Today is marked as a Holiday! 🏖️</p>
          <button 
            onClick={() => onRemoveHoliday(todayStr)}
            className="text-xs font-bold text-amber-600 underline underline-offset-4"
          >
            Remove Holiday
          </button>
        </div>
      )}

      {/* Extra Class Form Modal */}
      <AnimatePresence>
        {showExtraForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add Extra Class</h3>
              <form onSubmit={handleAddExtra} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={extraClassData.subject}
                    onChange={e => setExtraClassData({...extraClassData, subject: e.target.value})}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Advanced Math"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start</label>
                    <input 
                      required
                      type="time" 
                      value={extraClassData.startTime}
                      onChange={e => setExtraClassData({...extraClassData, startTime: e.target.value})}
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End</label>
                    <input 
                      required
                      type="time" 
                      value={extraClassData.endTime}
                      onChange={e => setExtraClassData({...extraClassData, endTime: e.target.value})}
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room (Optional)</label>
                  <input 
                    type="text" 
                    value={extraClassData.room}
                    onChange={e => setExtraClassData({...extraClassData, room: e.target.value})}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm"
                    placeholder="e.g. Lab 2"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowExtraForm(false)}
                    className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100"
                  >
                    Add Class
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EditClassModal 
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteClass}
        initialData={editingClass || { subject: '', startTime: '', endTime: '' }}
      />

      <ExamModal 
        isOpen={!!editingExam}
        onClose={() => setEditingExam(null)}
        onSave={handleSaveExam}
        onDelete={handleDeleteExam}
        initialData={editingExam || undefined}
      />

      {/* Classes List */}
      <div className="space-y-4">
        {allToday.length > 0 ? (
          allToday.map((session, idx) => (
            <ClassCard 
              key={session.id} 
              session={session} 
              status={getStatus(session.id)}
              onMark={(status) => onMarkAttendance(session.id, session.subject, status)}
              onEdit={() => setEditingClass({
                ...session,
                isExtra: (timetable.extraClasses || []).some(c => c.id === session.id)
              })}
              index={idx}
            />
          ))
        ) : (
          !isHoliday && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-12 text-center">
              <Clock className="mb-3 text-slate-300" size={40} />
              <p className="text-slate-500">No classes scheduled for today.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface ClassCardProps {
  key?: string | number;
  session: ClassSession;
  status: AttendanceStatus;
  onMark: (status: 'present' | 'absent') => void;
  onEdit: () => void;
  index: number;
}

const ClassCard = ({ 
  session, 
  status, 
  onMark, 
  onEdit,
  index 
}: ClassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all",
        status === 'present' ? "border-emerald-100 bg-emerald-50/30" : 
        status === 'absent' ? "border-rose-100 bg-rose-50/30" : "border-slate-100 shadow-sm"
      )}
    >
      <div className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
        status === 'present' ? "bg-emerald-100 text-emerald-600" : 
        status === 'absent' ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
      )}>
        <Clock size={20} />
      </div>

      <div 
        className="flex-1 overflow-hidden cursor-pointer"
        onClick={onEdit}
        title="Click to edit class"
      >
        <h4 className="truncate font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{session.subject}</h4>
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {session.startTime} - {session.endTime}
          </span>
          {session.room && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {session.room}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === 'pending' ? (
          <>
            <button 
              onClick={() => onMark('present')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={() => onMark('absent')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
            status === 'present' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {status === 'present' ? <Check size={12} /> : <X size={12} />}
            {status}
          </div>
        )}
      </div>
    </motion.div>
  );
};
