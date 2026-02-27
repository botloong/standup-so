import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a helpful assistant that converts developer work notes (git commits, task lists, Jira tickets, etc.) into a clean, professional daily standup report.

Given this input from a developer:
${input}

Generate a standup report with exactly these three sections:
1. **✅ Yesterday** — What was accomplished (past tense, clear and professional)
2. **🎯 Today** — What will be worked on today (based on context clues like "wip", "working on", or logical next steps)
3. **🚧 Blockers** — Any blockers or impediments (if none are mentioned, write "None at this time.")

Rules:
- Be concise but descriptive — 2-4 sentences per section
- Use professional language suitable for a team standup
- Group related items logically
- Don't include bullet points inside sections, write as flowing sentences
- Return only the standup report, no preamble or explanation

Format your response exactly like this:
**✅ Yesterday**
[content]

**🎯 Today**
[content]

**🚧 Blockers**
[content]`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ report: text });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
