import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Job {
  id: number
  title: string
  company: string
  location?: string
  job_type?: string
  salary_min?: number
  salary_max?: number
  description?: string
  requirements?: string
  benefits?: string
  posted_by?: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: number
  job_id: number
  user_email: string
  full_name: string
  phone?: string
  resume_url?: string
  cover_letter?: string
  experience_years?: number
  skills?: string
  created_at: string
}

export interface QuizResult {
  id: number
  user_email: string
  topic: string
  total_questions: number
  correct_answers: number
  time_taken?: number
  score_percentage: number
  quiz_data: any
  created_at: string
}

export interface PYQ {
  id: number
  company: string
  category: string
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
  difficulty: string
  year?: number
  created_at: string
}

export interface AIGuidanceSession {
  id: number
  user_email: string
  topic?: string
  question: string
  ai_response: string
  created_at: string
}

// ===================== Job functions =====================
export async function createJob(job: Omit<Job, "id" | "created_at" | "updated_at">) {
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      job_type TEXT,
      salary_min NUMERIC,
      salary_max NUMERIC,
      description TEXT,
      requirements TEXT,
      benefits TEXT,
      posted_by TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    INSERT INTO jobs (title, company, location, job_type, salary_min, salary_max, description, requirements, benefits, posted_by)
    VALUES (${job.title}, ${job.company}, ${job.location}, ${job.job_type}, ${job.salary_min}, ${job.salary_max}, ${job.description}, ${job.requirements}, ${job.benefits}, ${job.posted_by})
    RETURNING *
  `
  return result[0] as Job
}

export async function getJobs(limit = 50) {
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      job_type TEXT,
      salary_min NUMERIC,
      salary_max NUMERIC,
      description TEXT,
      requirements TEXT,
      benefits TEXT,
      posted_by TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    SELECT * FROM jobs 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `
  return result as Job[]
}

export async function getJobById(id: number) {
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      job_type TEXT,
      salary_min NUMERIC,
      salary_max NUMERIC,
      description TEXT,
      requirements TEXT,
      benefits TEXT,
      posted_by TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    SELECT * FROM jobs WHERE id = ${id}
  `
  return result[0] as Job | undefined
}

// ===================== Application functions =====================
export async function createApplication(application: Omit<Application, "id" | "created_at">) {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      resume_url TEXT,
      cover_letter TEXT,
      experience_years INT,
      skills TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    INSERT INTO applications (job_id, user_email, full_name, phone, resume_url, cover_letter, experience_years, skills)
    VALUES (${application.job_id}, ${application.user_email}, ${application.full_name}, ${application.phone}, ${application.resume_url}, ${application.cover_letter}, ${application.experience_years}, ${application.skills})
    RETURNING *
  `
  return result[0] as Application
}

export async function getUserApplications(userEmail: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      resume_url TEXT,
      cover_letter TEXT,
      experience_years INT,
      skills TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    SELECT a.*, j.title as job_title, j.company as job_company
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.user_email = ${userEmail}
    ORDER BY a.created_at DESC
  `
  return result
}

// ===================== Quiz functions =====================
export async function saveQuizResult(result: Omit<QuizResult, "id" | "created_at">) {
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      topic TEXT NOT NULL,
      total_questions INT NOT NULL,
      correct_answers INT NOT NULL,
      time_taken INT,
      score_percentage NUMERIC NOT NULL,
      quiz_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const dbResult = await sql`
    INSERT INTO quiz_results (user_email, topic, total_questions, correct_answers, time_taken, score_percentage, quiz_data)
    VALUES (${result.user_email}, ${result.topic}, ${result.total_questions}, ${result.correct_answers}, ${result.time_taken}, ${result.score_percentage}, ${JSON.stringify(result.quiz_data)})
    RETURNING *
  `
  return dbResult[0] as QuizResult
}

export async function getUserQuizResults(userEmail: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      topic TEXT NOT NULL,
      total_questions INT NOT NULL,
      correct_answers INT NOT NULL,
      time_taken INT,
      score_percentage NUMERIC NOT NULL,
      quiz_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    SELECT * FROM quiz_results 
    WHERE user_email = ${userEmail}
    ORDER BY created_at DESC
  `
  return result as QuizResult[]
}

// ===================== PYQ functions =====================
export async function getPYQs(company?: string, category?: string, limit = 20) {
  await sql`
    CREATE TABLE IF NOT EXISTS pyqs (
      id SERIAL PRIMARY KEY,
      company TEXT NOT NULL,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT[],
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      year INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `

  if (company && category) {
    const result = await sql`
      SELECT * FROM pyqs WHERE company = ${company} AND category = ${category}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `
    return result as PYQ[]
  }

  if (company) {
    const result = await sql`
      SELECT * FROM pyqs WHERE company = ${company}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `
    return result as PYQ[]
  }

  if (category) {
    const result = await sql`
      SELECT * FROM pyqs WHERE category = ${category}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `
    return result as PYQ[]
  }

  const result = await sql`
    SELECT * FROM pyqs
    ORDER BY RANDOM()
    LIMIT ${limit}
  `
  return result as PYQ[]
}

export async function getCompanies() {
  await sql`
    CREATE TABLE IF NOT EXISTS pyqs (
      id SERIAL PRIMARY KEY,
      company TEXT NOT NULL,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT[],
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      year INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    SELECT DISTINCT company FROM pyqs ORDER BY company
  `
  return result.map((r) => r.company) as string[]
}

export async function getCategories(company?: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS pyqs (
      id SERIAL PRIMARY KEY,
      company TEXT NOT NULL,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT[],
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      year INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `

  if (company) {
    const result = await sql`
      SELECT DISTINCT category FROM pyqs WHERE company = ${company} ORDER      BY category
    `
    return result.map((r) => r.category) as string[]
  }

  const result = await sql`
    SELECT DISTINCT category FROM pyqs ORDER BY category
  `
  return result.map((r) => r.category) as string[]
}

// ===================== AI Guidance functions =====================
export async function saveAIGuidanceSession(session: Omit<AIGuidanceSession, "id" | "created_at">) {
  await sql`
    CREATE TABLE IF NOT EXISTS ai_guidance_sessions (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      topic TEXT,
      question TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    INSERT INTO ai_guidance_sessions (user_email, topic, question, ai_response)
    VALUES (${session.user_email}, ${session.topic}, ${session.question}, ${session.ai_response})
    RETURNING *
  `
  return result[0] as AIGuidanceSession
}

export async function getUserGuidanceSessions(userEmail: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS ai_guidance_sessions (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      topic TEXT,
      question TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  const result = await sql`
    SELECT * FROM ai_guidance_sessions 
    WHERE user_email = ${userEmail}
    ORDER BY created_at DESC
    LIMIT 50
  `
  return result as AIGuidanceSession[]
}
