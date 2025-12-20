import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: Request) {
  const { topic, questionCount } = await req.json()

  const prompt = `
Generate ${questionCount} multiple-choice quiz questions on the topic "${topic}".
Format them as JSON with this structure:

[
  {
    "id": number,
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": number, // index of the correct option
    "explanation": "string",
    "difficulty": "Easy" | "Medium" | "Hard"
  }
]
  Note just give me the JSON array, without any extra text.
  `

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct", // Groq's fast model
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })

  const raw = completion.choices[0]?.message?.content ?? "[]"
  console.log("Raw response:", raw)
  let questions
  try {
    questions = JSON.parse(raw)
  } catch {
    questions = []
  }
  console.log("Generated questions:", questions)
  return NextResponse.json({ questions })
}
