"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertCircle,
  Crown,
  X,
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
  const sections = {
    yesterday: "",
    today: "",
    blockers: "",
  };

  const yesterdayMatch = text.match(/\*\*✅ Yesterday\*\*\s*([\s\S]*?)(?=\*\*🎯|\*\*Yesterday|\*\*Today|$)/);
  const todayMatch = text.match(/\*\*🎯 Today\*\*\s*([\s\S]*?)(?=\*\*🚧|\*\*Blockers|$)/);
  const blockersMatch = text.match(/\*\*🚧 Blockers\*\*\s*([\s\S]*?)$/);

  if (yesterdayMatch) sections.yesterday = yesterdayMatch[1].trim();
  if (todayMatch) sections.today = todayMatch[1].trim();
  if (blockersMatch) sections.blockers = blockersMatch[1].trim();

  return sections;
}

const PLACEHOLDER = `Paste your git commits, task list, or any work notes here...

Examples:
• fix: auth bug on login page
• feat: add user dashboard  
• reviewed PR #42 for user settings
• wip: working on API rate limiting
• attended sprint planning meeting`;

function UpgradeModal({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Upgrade to Pro</h2>
            <p className="text-muted-foreground text-sm">
              You&apos;ve used all 5 free reports for today. Go Pro for unlimited daily standups.
            </p>
          </div>
          <div className="bg-muted/40 rounded-xl p-4 w-full text-left space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Unlimited standup reports per day</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Priority AI generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
          <Button onClick={onUpgrade} className="w-full bg-primary hover:bg-primary/90 h-11 gap-2">
            <Crown className="w-4 h-4" />
            Upgrade for $6/month
          </Button>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(() => getRemainingReports());
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Check pro status via cookie on mount, and handle ?pro=success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pro") === "success") {
      // After successful Stripe checkout, call our webhook endpoint to set cookie
      // (In production this is handled by the webhook, but for immediate UX we also check)
      document.cookie = "pro_user=true; path=/; max-age=31536000; SameSite=Lax";
      setIsPro(true);
      // Clean URL
      window.history.replaceState({}, "", "/generate");
    } else {
      // Check for pro cookie
      const proUser = document.cookie.split(";").some((c) => c.trim().startsWith("pro_user=true"));
      setIsPro(proUser);
    }
  }, []);

  const handleUpgrade = useCallback(async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to start checkout. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError("Please enter some commits or tasks first.");
      return;
    }

    if (remaining <= 0 && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setReport("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.");
        return;
      }

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

  const parsed = report ? parseReport(report) : null;

  return (
    <div className="min-h-screen bg-background">
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
        />
      )}

      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Standup.so</span>
          </Link>
          <div className="flex items-center gap-3">
            {isPro ? (
              <Badge className="bg-primary/10 text-primary border border-primary/30 gap-1 text-xs">
                <Crown className="w-3 h-3" /> Pro
              </Badge>
            ) : (
              <>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    remaining <= 1
                      ? "border-destructive/50 text-destructive"
                      : "border-primary/50 text-primary"
                  }`}
                >
                  {remaining}/{DAILY_LIMIT} reports left today
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown className="w-3 h-3" /> Go Pro
                </Button>
              </>
            )}
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-3 h-3" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Free limit banner */}
      {remaining <= 0 && !isPro && (
        <div className="bg-primary/5 border-b border-primary/20">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-primary shrink-0" />
              <span>
                You&apos;ve used all your free reports for today.{" "}
                <strong>Upgrade to Pro</strong> for unlimited reports.
              </span>
            </div>
            <Button
              size="sm"
              className="shrink-0 bg-primary hover:bg-primary/90 gap-1"
              onClick={handleUpgrade}
              disabled={upgrading}
            >
              {upgrading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crown className="w-3 h-3" />}
              $6/month
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generate Standup Report</h1>
          <p className="text-muted-foreground">
            Paste your git commits, tasks, or work notes below and get an instant standup.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your work notes</label>
              <span className="text-xs text-muted-foreground">{input.length} chars</span>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              className="min-h-[300px] resize-none font-mono text-sm bg-card border-border/60 focus:border-primary/50"
            />

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={loading || !input.trim() || (remaining <= 0 && !isPro)}
              className="w-full bg-primary hover:bg-primary/90 h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : remaining <= 0 && !isPro ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Generate More
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Standup
                </>
              )}
            </Button>

            {remaining <= 0 && !isPro && (
              <Button
                onClick={() => setShowUpgradeModal(true)}
                variant="outline"
                className="w-full border-primary/40 text-primary hover:bg-primary/10 h-11 gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro — $6/month
              </Button>
            )}
          </div>

          {/* Output */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your standup report</label>
              {report && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 h-7 text-xs"
                    onClick={() => { setReport(""); setInput(""); }}
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-7 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <><Check className="w-3 h-3 text-primary" /> Copied!</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="min-h-[300px] bg-card border border-border/60 rounded-md p-4 flex flex-col gap-4">
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
                <div className="flex flex-col gap-5 text-sm">
                  <ReportSection emoji="✅" title="Yesterday" content={parsed.yesterday} />
                  <ReportSection emoji="🎯" title="Today" content={parsed.today} />
                  <ReportSection emoji="🚧" title="Blockers" content={parsed.blockers} />

                  <Button
                    onClick={handleCopy}
                    className="w-full mt-2 bg-primary hover:bg-primary/90"
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 mr-2" /> Copied to clipboard!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copy standup</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground mt-10">
        <p>
          <Link href="/terms" className="hover:text-foreground mx-2">Terms</Link>·
          <Link href="/privacy" className="hover:text-foreground mx-2">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}

function ReportSection({
  emoji,
  title,
  content,
}: {
  emoji: string;
  title: string;
  content: string;
}) {
  return (
    <div className="bg-background/60 border border-border/40 rounded-lg p-4">
      <h3 className="font-semibold mb-2">
        {emoji} {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {content || "Nothing to report."}
      </p>
    </div>
  );
}
