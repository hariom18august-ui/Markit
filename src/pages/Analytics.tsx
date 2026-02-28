import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { AttendanceRecord, Timetable } from '../types';
import { cn } from '../utils/cn';
import { format, parseISO, isSameDay } from 'date-fns';

interface AnalyticsProps {
  attendance: AttendanceRecord[];
  timetable: Timetable;
}

export const Analytics = ({ attendance, timetable }: AnalyticsProps) => {
  // Calculate subject-wise stats
  const subjects = Array.from(new Set(attendance.map(r => r.subject)));
  const subjectStats = subjects.map(subject => {
    const records = attendance.filter(r => r.subject === subject);
    const present = records.filter(r => r.status === 'present').length;
    const percentage = Math.round((present / records.length) * 100);
    return { subject, present, total: records.length, percentage };
  }).sort((a, b) => b.percentage - a.percentage);

  // Group by day for history
  const history = attendance.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  const sortedDates = Object.keys(history).sort((a, b) => b.localeCompare(a));

  const overallPercentage = attendance.length > 0 
    ? Math.round((attendance.filter(r => r.status === 'present').length / attendance.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500">Your attendance performance at a glance.</p>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500">Average Rate</p>
          <h4 className="text-2xl font-bold text-slate-900">{overallPercentage}%</h4>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
            <BookOpen size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500">Subjects</p>
          <h4 className="text-2xl font-bold text-slate-900">{subjects.length}</h4>
        </div>
      </div>

      {/* Subject Wise Progress */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Subject Performance</h3>
        <div className="space-y-4">
          {subjectStats.map((stat, i) => (
            <motion.div 
              key={stat.subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">{stat.subject}</span>
                <span className="text-xs font-bold text-indigo-600">{stat.percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  className={cn(
                    "h-full rounded-full transition-all",
                    stat.percentage > 75 ? "bg-emerald-500" : stat.percentage > 50 ? "bg-amber-500" : "bg-rose-500"
                  )}
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                {stat.present} of {stat.total} classes attended
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* History List */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Attendance History</h3>
        <div className="space-y-3">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {format(parseISO(date), 'MMM do, yyyy')}
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {history[date].map((record, idx) => (
                  <div 
                    key={`${record.classId}-${idx}`}
                    className={cn(
                      "flex items-center justify-between px-4 py-3",
                      idx !== history[date].length - 1 && "border-bottom border-slate-50"
                    )}
                  >
                    <span className="text-sm font-medium text-slate-700">{record.subject}</span>
                    {record.status === 'present' ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check size={14} />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                        <X size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
