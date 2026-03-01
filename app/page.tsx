"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  Clock,
  GitCommit,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Crown,
  X,
  RefreshCw,
} from "lucide-react";

const DAILY_LIMIT = 5;
const STORAGE_KEY = "standup_usage";

interface UsageData {
  date: string;
  count: number;
}

function getUsage(): UsageData {
  if (typeof window === "undefined") return { date: "", count: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: "", count: 0 };
    return JSON.parse(raw) as UsageData;
  } catch {
    return { date: "", count: 0 };
  }
}

function incrementUsage(): number {
  const today = new Date().toISOString().split("T")[0];
  const usage = getUsage();
  const newCount = usage.date === today ? usage.count + 1 : 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
  return newCount;
}

function getRemainingReports(): number {
  const today = new Date().toISOString().split("T")[0];
  const usage = getUsage();
  if (usage.date !== today) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - usage.count);
}

function parseReport(text: string) {
  const sections = { yesterday: "", today: "", blockers: "" };
  const yesterdayMatch = text.match(/\*\*✅ Yesterday\*\*\s*([\s\S]*?)(?=\*\*🎯|\*\*Yesterday|\*\*Today|$)/);
  const todayMatch = text.match(/\*\*🎯 Today\*\*\s*([\s\S]*?)(?=\*\*🚧|\*\*Blockers|$)/);
  const blockersMatch = text.match(/\*\*🚧 Blockers\*\*\s*([\s\S]*?)$/);
  if (yesterdayMatch) sections.yesterday = yesterdayMatch[1].trim();
  if (todayMatch) sections.today = todayMatch[1].trim();
  if (blockersMatch) sections.blockers = blockersMatch[1].trim();
  return sections;
}

const PLACEHOLDER = `Paste your git commits, task list, or any work notes...

Examples:
• fix: auth bug on login page
• feat: add user dashboard
• reviewed PR #42
• wip: API rate limiting`;

function UpgradeModal({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Upgrade to Pro</h2>
            <p className="text-muted-foreground text-sm">You&apos;ve used all 5 free reports for today. Go Pro for unlimited daily standups.</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-4 w-full text-left space-y-2 text-sm">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /><span>Unlimited standup reports per day</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /><span>Priority AI generation</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /><span>Cancel anytime</span></div>
          </div>
          <Button onClick={onUpgrade} className="w-full bg-primary hover:bg-primary/90 h-11 gap-2">
            <Crown className="w-4 h-4" /> Upgrade for $6/month
          </Button>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Maybe later</button>
        </div>
      </div>
    </div>
  );
}

function ReportSection({ emoji, title, content }: { emoji: string; title: string; content: string }) {
  return (
    <div className="bg-background/60 border border-border/40 rounded-lg p-4">
      <h3 className="font-semibold mb-2">{emoji} {title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{content || "Nothing to report."}</p>
    </div>
  );
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(() => getRemainingReports());
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [sharedOnX, setSharedOnX] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pro") === "success") {
      document.cookie = "pro_user=true; path=/; max-age=31536000; SameSite=Lax";
      setIsPro(true);
      window.history.replaceState({}, "", "/");
    } else {
      const proUser = document.cookie.split(";").some((c) => c.trim().startsWith("pro_user=true"));
      setIsPro(proUser);
    }
  }, []);

  const handleUpgrade = useCallback(async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError("Failed to start checkout. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) { setError("Please enter some commits or tasks first."); return; }
    if (remaining <= 0 && !isPro) { setShowUpgradeModal(true); return; }
    setLoading(true); setError(""); setReport("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed. Please try again."); return; }
      setReport(data.report);
      if (!isPro) {
        const newCount = incrementUsage();
        setRemaining(Math.max(0, DAILY_LIMIT - newCount));
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [input, remaining, isPro]);

  const handleCopy = useCallback(async () => {
    if (!report) return;
    const plain = report.replace(/\*\*/g, "");
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [report]);

  const handleShareX = useCallback(() => {
    const text = encodeURIComponent("Just wrote my daily standup in 10 seconds with standup.so — paste commits, get a polished report. Try it free 👇\nhttps://standup-so.vercel.app");
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    setSharedOnX(true);
  }, []);

  const parsed = report ? parseReport(report) : null;

  return (
    <div className="min-h-screen bg-background">
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgrade} />}

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
            {isPro ? (
              <Badge className="bg-primary/10 text-primary border border-primary/30 gap-1 text-xs">
                <Crown className="w-3 h-3" /> Pro
              </Badge>
            ) : (
              <>
                <Badge variant="outline" className={`text-xs hidden sm:flex ${remaining <= 1 ? "border-destructive/50 text-destructive" : "border-primary/50 text-primary"}`}>
                  {remaining}/{DAILY_LIMIT} free today
                </Badge>
                <Button variant="outline" size="sm" className="gap-1 text-xs border-primary/40 text-primary hover:bg-primary/10" onClick={() => setShowUpgradeModal(true)}>
                  <Crown className="w-3 h-3" /> Go Pro $6/mo
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero + Tool */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            ✨ AI-Powered Standup Reports
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
            Standups done in<br /><span className="text-primary">10 seconds flat.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Paste your commits or tasks below. Get a polished standup — no sign-up, no Slack bot, no setup.
          </p>
        </div>

        {/* Tool */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your work notes</label>
              <span className="text-xs text-muted-foreground">{input.length} chars</span>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleGenerate(); }}
              placeholder={PLACEHOLDER}
              className="min-h-[260px] resize-none font-mono text-sm bg-card border-border/60 focus:border-primary/50"
            />
            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span>
              </div>
            )}
            <Button
              onClick={handleGenerate}
              disabled={loading || !input.trim() || (remaining <= 0 && !isPro)}
              className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
              ) : remaining <= 0 && !isPro ? (
                <><Crown className="w-4 h-4 mr-2" />Upgrade to Generate More</>
              ) : (
                <><Zap className="w-4 h-4 mr-2" />Generate Standup <span className="text-xs opacity-60 ml-2">⌘↵</span></>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">✓ Free &nbsp;·&nbsp; ✓ No sign-up &nbsp;·&nbsp; ✓ Works with git, Jira, or plain text</p>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your standup report</label>
              {report && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={() => { setReport(""); setInput(""); }}>
                    <RefreshCw className="w-3 h-3" /> Reset
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={handleCopy}>
                    {copied ? <><Check className="w-3 h-3 text-primary" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </Button>
                </div>
              )}
            </div>
            <div className="min-h-[260px] bg-card border border-border/60 rounded-md p-4 flex flex-col gap-4">
              {!report && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground/60">Your standup will appear here</p>
                    <p className="text-sm mt-1">Paste your notes and click Generate</p>
                  </div>
                </div>
              )}
              {loading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm">AI is writing your standup...</p>
                  </div>
                </div>
              )}
              {parsed && !loading && (
                <div className="flex flex-col gap-4 text-sm">
                  <ReportSection emoji="✅" title="Yesterday" content={parsed.yesterday} />
                  <ReportSection emoji="🎯" title="Today" content={parsed.today} />
                  <ReportSection emoji="🚧" title="Blockers" content={parsed.blockers} />
                  <div className="flex gap-2 mt-1">
                    <Button onClick={handleCopy} className="flex-1 bg-primary hover:bg-primary/90">
                      {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy standup</>}
                    </Button>
                    <Button variant="outline" onClick={handleShareX} className="gap-2 border-border/60">
                      {sharedOnX ? "Shared!" : "Share"}
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: <GitCommit className="w-6 h-6 text-primary" />, step: "1", title: "Paste your work", desc: "Git commits, task list, Jira tickets — anything that describes your day." },
            { icon: <Zap className="w-6 h-6 text-primary" />, step: "2", title: "AI does the magic", desc: "AI reads your input and structures it into a clean standup format in seconds." },
            { icon: <Copy className="w-6 h-6 text-primary" />, step: "3", title: "Copy and share", desc: "One click to copy your polished report. Paste into Slack, Teams, or email." },
          ].map((item) => (
            <div key={item.step} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{item.step}</div>
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
            <Button variant="outline" className="w-full" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Start for free</Button>
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
            <Button className="w-full bg-primary hover:bg-primary/90 gap-2" onClick={handleUpgrade} disabled={upgrading}>
              {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />} Upgrade to Pro
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-10">
          <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Save time every morning</h2>
          <p className="text-muted-foreground mb-6">Stop dreading standups. Let AI write them for you.</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Try it now — it&apos;s free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

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
