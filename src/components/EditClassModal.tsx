import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassSession } from '../types';

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<ClassSession>) => void;
  onDelete?: () => void;
  initialData: {
    subject: string;
    startTime: string;
    endTime: string;
    room?: string;
  };
}

export const EditClassModal = ({ isOpen, onClose, onSave, onDelete, initialData }: EditClassModalProps) => {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <h3 className="text-lg font-bold text-slate-900">Edit Class</h3>
              {onDelete && (
                <button 
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this class?')) {
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
                  required
                  type="text" 
                  value={data.subject}
                  onChange={e => setData({...data, subject: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start</label>
                  <input 
                    required
                    type="time" 
                    value={data.startTime}
                    onChange={e => setData({...data, startTime: e.target.value})}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End</label>
                  <input 
                    required
                    type="time" 
                    value={data.endTime}
                    onChange={e => setData({...data, endTime: e.target.value})}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room (Optional)</label>
                <input 
                  type="text" 
                  value={data.room || ''}
                  onChange={e => setData({...data, room: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
