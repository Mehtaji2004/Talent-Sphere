# TalentSphere

TalentSphere is a job search and career development platform. It allows users to search for jobs, post jobs, take AI-powered skills quizzes, access past year question (PYQ) resources, and receive AI career guidance.

## Features

* **Job Search:** Search for remote and local jobs by keyword, category, and location.
* **Job Posting:** Post job listings with detailed information and requirements. (Currently local storage only)
* **AI Skill Quizzes:** Take AI-generated quizzes to assess your skills in various topics.
* **PYQs (Past Year Questions):** Access and practice interview questions from top companies.
* **AI Career Guidance:** Get personalized career advice and development tips from an AI assistant.
* **Mock Interviews:** Conduct simulated interviews with AI feedback.

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Lucide, Radix UI, Sonner, clsx, tailwind-merge, Next-Themes
* **Backend:** Next.js API routes, Neon Database (PostgreSQL), Groq, Vapi AI


## Setup

1.  **Clone the repository:**  `git clone <repository_url>`
2.  **Install dependencies:** `npm install`
3.  **Set environment variables:**  You'll need to set environment variables for database connection (`DATABASE_URL`), Vapi AI tokens (`NEXT_PUBLIC_VAPI_WEB_TOKEN`, `NEXT_PUBLIC_VAPI_WORKFLOW_ID`), and Groq API key (`GROQ_API_KEY`).  Create a `.env.local` file in the root directory and add your API keys.
4.  **Run the development server:** `npm run dev`


## Usage

Navigate to the different pages to utilize the platform's features.  Authentication (currently via local storage) is required for certain features like job posting, saving quiz results and AI guidance history.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


## License

MIT License
