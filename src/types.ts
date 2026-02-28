export interface ClassSession {
  id: string;
  subject: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  room?: string;
}

export interface DayTimetable {
  day: string; // Monday, Tuesday, etc.
  classes: ClassSession[];
}

export interface ExtraClass {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  reason?: string;
}

export interface Exam {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  type: string; // Midterm, Final, Quiz, etc.
  time?: string;
  room?: string;
}

export interface Timetable {
  id: string;
  name: string;
  schedule: DayTimetable[];
  extraClasses: ExtraClass[];
  holidays: Holiday[];
  exams: Exam[];
  createdAt: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'pending';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  classId: string;
  subject: string;
  status: AttendanceStatus;
  timestamp: number;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  reminderMinutesBefore: number;
}
