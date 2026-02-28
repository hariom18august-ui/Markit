import { ClassSession, DayTimetable, Timetable } from '../types';

const SUBJECTS = [
  'Mathematics', 'Physics', 'Computer Science', 'Data Structures', 
  'Digital Logic', 'Economics', 'English', 'Operating Systems'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const mockOCRProcess = async (file: File): Promise<Timetable> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const schedule: DayTimetable[] = DAYS.map(day => {
    const numClasses = Math.floor(Math.random() * 3) + 3; // 3-5 classes per day
    const classes: ClassSession[] = [];
    
    let currentHour = 9;
    for (let i = 0; i < numClasses; i++) {
      classes.push({
        id: `${day.toLowerCase()}-${i}`,
        subject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
        startTime: `${String(currentHour).padStart(2, '0')}:00`,
        endTime: `${String(currentHour + 1).padStart(2, '0')}:00`,
        room: `Room ${100 + Math.floor(Math.random() * 50)}`
      });
      currentHour += 1;
      if (currentHour === 12) currentHour += 1; // Lunch break
    }
    
    return { day, classes };
  });

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: "Extracted Timetable",
    schedule,
    extraClasses: [],
    holidays: [],
    exams: [],
    createdAt: Date.now()
  };
};

export const getTodayClasses = (timetable: Timetable | null) => {
  if (!timetable) return [];
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const daySchedule = timetable.schedule.find(d => d.day === today);
  return daySchedule ? daySchedule.classes : [];
};
