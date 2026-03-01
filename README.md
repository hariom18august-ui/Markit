# 📅 Smart Attendance App
<a href="https://markit-rouge-alpha.vercel.app/">Live Demo</a>

**Intelligent attendance management powered by AI. Transform your class timetable into a smart, automated tracking system.**
---

## 🚀 Overview
The **Smart Attendance App** is a modern, mobile-first solution for students to manage their academic life. By simply uploading a screenshot of their class timetable, users get an automated schedule with intelligent notifications, real-time attendance tracking, and smart "Full Day" attendance features.
--



### 📸 AI Timetable Extraction
Upload a screenshot or PDF of your class timetable. The app uses advanced OCR to extract subjects, timings, and room numbers automatically.
><img width="1804" height="825" alt="image" src="https://github.com/user-attachments/assets/4d38d53b-1177-4ac1-b289-8789bba70c10" />


### 🔔 Smart Notifications
Receive timely reminders before each class to mark your attendance. No more manual entry for every session.
><img width="1801" height="818" alt="image" src="https://github.com/user-attachments/assets/361e1dbc-7ca4-4358-bd51-20f25a55767d" />




### 📊 Attendance Dashboard
Track your overall attendance percentage and view today's progress with a sleek, interactive progress bar.
> <img width="1753" height="731" alt="image" src="https://github.com/user-attachments/assets/b1238363-9749-475e-b10f-65afa3a9704c" />
<img width="1705" height="716" alt="image" src="https://github.com/user-attachments/assets/abda7ceb-ac74-4090-8134-2d052ba908e3" />
<img width="1816" height="819" alt="image" src="https://github.com/user-attachments/assets/cc80ad38-926e-4b0a-bb00-528d531792cf" />
<img width="1795" height="819" alt="image" src="https://github.com/user-attachments/assets/f2e9c336-b678-4426-bf8a-dc4bb598450e" />


### ✅ One-Tap Attendance
Mark attendance for individual classes or use the **"Mark Whole Day"** feature. Selecting "Full Day Attendance" automatically silences individual class notifications for that day.
> <img width="1795" height="818" alt="image" src="https://github.com/user-attachments/assets/14b241bd-29f0-456f-971b-ee79e97dced3" />


### 📅 Exam & Extra Class Tracking
Stay ahead of your schedule by adding exams and extra classes directly to your dashboard.
> <img width="1804" height="835" alt="image" src="https://github.com/user-attachments/assets/ea072fd7-2560-4e82-8dde-6b080f48e171" />


---

## 🛠️ How It Works

1.  **Upload**: Drag and drop your timetable image or PDF.
2.  **Process**: The app extracts your weekly schedule using AI.
3.  **Monitor**: View your daily schedule on the dashboard.
4.  **Mark**: Tap to mark yourself as 'Present' or 'Absent'.
5.  **Analyze**: Keep an eye on your attendance percentage to stay above the required threshold.

---

## 💻 Tech Stack

-   **Frontend**: [React.js / Next.js]
-   **Styling**: [Tailwind CSS]
-   **Animations**: [Framer Motion]
-   **Icons**: [Lucide React]
-   **State Management**: [React Hooks / Context API]
-   **AI Engine**: [Gemini API / OCR Engine]
-   **Storage**: [Local Storage / Firebase / PostgreSQL]

---

## ⚙️ Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/smart-attendance-app.git
    cd smart-attendance-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file and add your API keys:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Start the development server**:
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Modals, Cards, etc.)
├── pages/          # Main application views (Dashboard, Landing, etc.)
├── services/       # API and AI integration logic
├── utils/          # Helper functions and constants
├── types.ts        # TypeScript interfaces and types
└── App.tsx         # Main application entry and routing
```

---

## 🔮 Future Improvements

-   [ ] **Cloud Sync**: Sync attendance data across multiple devices.
-   [ ] **Analytics Pro**: Detailed graphs showing attendance trends over months.
-   [ ] **Geofencing**: Automatically prompt for attendance when near the classroom.
-   [ ] **Export Reports**: Generate PDF attendance reports for official submissions.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for students everywhere.
</p>
