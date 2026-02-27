# Standup.so

AI-powered daily standup report generator for developers.

## Features

- 🤖 AI-powered report generation via Google Gemini
- 📋 Clean, structured output (Yesterday / Today / Blockers)
- 📋 One-click copy to clipboard
- 🆓 Free tier: 5 reports/day (tracked in localStorage)
- 🌙 Dark mode design
- 📱 Mobile responsive

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **AI:** Google Gemini 1.5 Flash

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and add your Gemini API key
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |

## Roadmap

- [ ] Stripe integration for Pro plan (unlimited reports)
- [ ] Save report history
- [ ] Slack/Teams integration
- [ ] Custom standup templates
- [ ] Team accounts

## Deployment

Deploy to Vercel:

```bash
npx vercel --prod
```

Set `GEMINI_API_KEY` in your Vercel environment variables.
