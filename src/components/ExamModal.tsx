import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Exam } from '../types';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: Omit<Exam, 'id'>) => void;
  onDelete?: () => void;
  initialData?: Partial<Exam>;
}

export const ExamModal = ({ isOpen, onClose, onSave, onDelete, initialData }: ExamModalProps) => {
  const [data, setData] = React.useState({
    subject: initialData?.subject || '',
    date: initialData?.date || '',
    type: initialData?.type || 'Midterm',
    time: initialData?.time || '',
    room: initialData?.room || ''
  });

  React.useEffect(() => {
    if (initialData) {
      setData({
        subject: initialData.subject || '',
        date: initialData.date || '',
        type: initialData.type || 'Midterm',
        time: initialData.time || '',
        room: initialData.room || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.subject || !data.date) return;
    onSave(data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">{initialData?.id ? 'Edit Exam' : 'Add Exam'}</h3>
              {onDelete && initialData?.id && (
                <button 
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this exam?')) {
                      onDelete();
                      onClose();
                    }
                  }}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600"
                >
                  Delete
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                <input 
                  type="text"
                  required
                  value={data.subject}
                  onChange={e => setData({ ...data, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={data.date}
                    onChange={e => setData({ ...data, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                  <select 
                    value={data.type}
                    onChange={e => setData({ ...data, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Practical">Practical</option>
                    <option value="Viva">Viva</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time (Optional)</label>
                  <input 
                    type="time"
                    value={data.time}
                    onChange={e => setData({ ...data, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room (Optional)</label>
                  <input 
                    type="text"
                    value={data.room}
                    onChange={e => setData({ ...data, room: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="Room 101"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                >
                  {initialData?.id ? 'Save Changes' : 'Add Exam'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
