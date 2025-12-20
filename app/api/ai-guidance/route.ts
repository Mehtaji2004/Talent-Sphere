import { type NextRequest, NextResponse } from "next/server"
import { saveAIGuidanceSession } from "@/lib/database"
import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { question, topic } = await request.json()

    // Get user email from headers or session (simplified for demo)
    const userEmail = request.headers.get("x-user-email") || "demo@example.com"

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // Create a comprehensive prompt for career guidance
    const prompt = `You are an expert career counselor and professional development coach. Provide helpful, actionable advice for the following career-related question.

${topic ? `Topic: ${topic}` : ""}
Question: ${question}

Please provide:
1. A clear, comprehensive answer
2. Specific actionable steps
3. Relevant examples or best practices
4. Additional resources or tips if applicable

Keep your response professional, encouraging, and practical. Focus on providing value that can help advance their career.`

    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt,
      // maxTokens: 1000,
    })

    // Save the session to database
    await saveAIGuidanceSession({
      user_email: userEmail,
      topic,
      question,
      ai_response: text,
    })

    return NextResponse.json({ success: true, response: text })
  } catch (error) {
    console.error("Error generating AI guidance:", error)
    return NextResponse.json({ error: "Failed to generate guidance" }, { status: 500 })
  }
}
