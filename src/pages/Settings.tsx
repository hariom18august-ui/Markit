import React from 'react';
import { Bell, BellOff, Trash2, Info, Github, Upload } from 'lucide-react';
import { AppSettings } from '../types';
import { motion } from 'framer-motion';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClearData: () => void;
  onResetTimetable: () => void;
}

export const Settings = ({ settings, onUpdateSettings, onClearData, onResetTimetable }: SettingsProps) => {
  const toggleNotifications = () => {
    onUpdateSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled });
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Manage your preferences and data.</p>
      </header>

      <div className="space-y-6">
        {/* Notifications Section */}
        <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${settings.notificationsEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                {settings.notificationsEnabled ? <Bell size={24} /> : <BellOff size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Notifications</h4>
                <p className="text-xs text-slate-500">Get reminders before classes</p>
              </div>
            </div>
            <button 
              onClick={toggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          {settings.notificationsEnabled && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-6 pt-6 border-t border-slate-50"
            >
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Reminder Time (minutes before)
              </label>
              <select 
                value={settings.reminderMinutesBefore}
                onChange={(e) => onUpdateSettings({ ...settings, reminderMinutesBefore: parseInt(e.target.value) })}
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </motion.div>
          )}
        </section>

        {/* Data Management */}
        <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-4">Data Management</h4>
          <div className="space-y-3">
            <button 
              onClick={() => {
                if (confirm('This will remove your current timetable but keep your attendance records. You will be redirected to the upload page. Continue?')) {
                  onResetTimetable();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
            >
              <Upload size={18} />
              Upload New Timetable
            </button>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                  onClearData();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <Trash2 size={18} />
              Clear All Data
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-4">About</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-indigo-500 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart Timetable Attendance Tracker helps students stay organized and maintain their attendance goals effortlessly.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Github size={18} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-400">Version 1.0.0</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
