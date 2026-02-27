import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · Standup.so",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 mb-8 inline-block">
          ← Back to Standup.so
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">What We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li><strong className="text-white">Input text:</strong> The work context you type in is sent to our AI provider to generate your standup. We don't store this text on our servers.</li>
              <li><strong className="text-white">Usage count:</strong> Free-tier usage limits are tracked in your browser's localStorage — this never leaves your device.</li>
              <li><strong className="text-white">Payment info:</strong> If you subscribe to Pro, Stripe collects and stores your payment details. We receive only a customer ID and subscription status — never your card number.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">How We Use It</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Provide the standup generation service</li>
              <li>Manage your subscription and billing</li>
              <li>Improve AI output quality over time</li>
            </ul>
            <p className="mt-3">We don't sell your data. We don't use it for advertising.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Third Parties</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li><strong className="text-white">Groq:</strong> Your input text is sent to Groq's API to generate AI responses. Groq's own <a href="https://groq.com/privacy-policy/" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">privacy policy</a> applies to that processing.</li>
              <li><strong className="text-white">Stripe:</strong> Payment processing for Pro subscriptions. Stripe's <a href="https://stripe.com/privacy" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">privacy policy</a> applies to all payment data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Data Retention</h2>
            <p>We don't retain your standup input text. Usage data stays in your browser and can be cleared by clearing your localStorage. Subscription records are retained as required for billing and legal compliance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Your Rights</h2>
            <p>You can request deletion of any account or billing data we hold by emailing us. Since we don't store standup content, there's nothing to delete there.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
            <p>Questions about your privacy? Email us at <a href="mailto:legal@standup.so" className="text-white underline hover:text-zinc-300">legal@standup.so</a>.</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-300 mr-4">Terms of Service</Link>
          <Link href="/" className="hover:text-zinc-300">← Home</Link>
        </div>
      </div>
    </div>
  );
}
