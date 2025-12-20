-- Create jobs table for posted jobs
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  job_type VARCHAR(100),
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  posted_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  user_email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  resume_url TEXT,
  cover_letter TEXT,
  experience_years INTEGER,
  skills TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  score_percentage DECIMAL(5,2),
  quiz_data JSONB, -- store questions and answers
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pyqs table for Previous Year Questions
CREATE TABLE IF NOT EXISTS pyqs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(100) NOT NULL, -- TCS, Google, Amazon, etc.
  category VARCHAR(100) NOT NULL, -- Technical, Aptitude, HR, etc.
  question TEXT NOT NULL,
  options JSONB, -- for multiple choice questions
  correct_answer TEXT,
  explanation TEXT,
  difficulty VARCHAR(50), -- Easy, Medium, Hard
  year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_guidance_sessions table
CREATE TABLE IF NOT EXISTS ai_guidance_sessions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  topic VARCHAR(255),
  question TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
