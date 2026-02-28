"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Clock, Copy, GitCommit, Check, Crown } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Standup.so</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs border-primary/50 text-primary hidden sm:flex">
              Free: 5 reports/day
            </Badge>
            <Link href="/generate">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Try it free <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          ✨ AI-Powered Standup Reports
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
          Standups done in<br />
          <span className="text-primary">10 seconds flat.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Paste your git commits or task list. Get a polished standup report with Yesterday, Today, and Blockers — ready to share with your team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/generate">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8 h-14">
              Try it free — takes 10 seconds <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">✓ Free &nbsp;·&nbsp; ✓ No sign-up &nbsp;·&nbsp; ✓ Works with git commits, Jira, or plain text</p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <GitCommit className="w-6 h-6 text-primary" />,
              step: "1",
              title: "Paste your work",
              desc: "Git commits, task list, Jira tickets — anything that describes your day.",
            },
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              step: "2",
              title: "AI does the magic",
              desc: "AI reads your input and structures it into a clean standup format in seconds.",
            },
            {
              icon: <Copy className="w-6 h-6 text-primary" />,
              step: "3",
              title: "Copy and share",
              desc: "One click to copy your polished report. Paste into Slack, Teams, or email.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {item.step}
                </div>
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example output */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Example output</h2>
        <p className="text-center text-muted-foreground mb-10">From messy commits to clean standup in seconds.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">Input</p>
            <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">{`fix: auth bug on login page
feat: add user dashboard
wip: working on API rate limiting
reviewed PR #42`}</pre>
          </div>
          <div className="bg-card border border-primary/20 rounded-xl p-5">
            <p className="text-xs font-mono text-primary mb-3 uppercase tracking-wider">✨ Generated standup</p>
            <div className="text-sm text-foreground/80 space-y-3 leading-relaxed">
              <div>
                <p className="font-semibold text-foreground">✅ Yesterday</p>
                <p>Fixed authentication bug on the login page. Completed user dashboard feature. Reviewed and provided feedback on PR #42.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">🎯 Today</p>
                <p>Continue implementing API rate limiting. Testing and QA for recent changes.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">🚧 Blockers</p>
                <p>None at this time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-center text-muted-foreground mb-10">Start free. Upgrade when you need more.</p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Free</p>
              <p className="text-4xl font-bold">$0</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground flex-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />5 reports per day</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />No sign-up required</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />All output formats</li>
            </ul>
            <Link href="/generate">
              <Button variant="outline" className="w-full">Get started free</Button>
            </Link>
          </div>
          <div className="bg-card border border-primary/50 rounded-xl p-6 flex flex-col gap-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-white border-0 text-xs">Most popular</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Pro</p>
              <p className="text-4xl font-bold">$6<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
            </div>
            <ul className="flex flex-col gap-2 text-sm flex-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /><strong>Unlimited</strong> reports per day</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Priority AI generation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Cancel anytime</li>
            </ul>
            <Link href="/generate">
              <Button className="w-full bg-primary hover:bg-primary/90 gap-2"><Crown className="w-4 h-4" />Upgrade to Pro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-10">
          <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Save time every morning</h2>
          <p className="text-muted-foreground mb-6">Stop dreading standups. Let AI write them for you.</p>
          <Link href="/generate">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Generate my standup now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Standup.so · Built for developers who hate writing standups</p>
        <p className="mt-2">
          <Link href="/terms" className="hover:text-foreground mx-2">Terms</Link>·
          <Link href="/privacy" className="hover:text-foreground mx-2">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
