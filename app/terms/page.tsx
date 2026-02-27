import Link from "next/link";

export const metadata = {
  title: "Terms of Service · Standup.so",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 mb-8 inline-block">
          ← Back to Standup.so
        </Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By using Standup.so, you agree to these Terms of Service. If you don't agree, please don't use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. What We Do</h2>
            <p>Standup.so is an AI-powered tool that helps developers generate daily standup reports. You provide context about your work; we generate a formatted standup summary.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Free and Pro Tiers</h2>
            <p className="mb-2"><strong className="text-white">Free tier:</strong> Up to 5 standup generations per day, tracked locally in your browser.</p>
            <p><strong className="text-white">Pro tier ($6/month):</strong> Unlimited generations and access to additional features. Billed monthly via Stripe. Cancel anytime — your subscription stays active until the end of the billing period.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Payments and Refunds</h2>
            <p>Payments are processed by Stripe. We don't store your payment details. Pro subscriptions are month-to-month with no lock-in. We don't offer refunds for partial billing periods, but you can cancel before your next renewal date to avoid future charges.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Prohibited Uses</h2>
            <p>Don't use Standup.so to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-400">
              <li>Generate harmful, abusive, or illegal content</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the service</li>
              <li>Circumvent usage limits through technical means</li>
              <li>Resell or redistribute the service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Disclaimer of Warranties</h2>
            <p>Standup.so is provided "as is" without warranties of any kind. We make no guarantees about uptime, accuracy of AI output, or fitness for a particular purpose. AI-generated content should be reviewed before use.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Standup.so and its operator are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid us in the last 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Changes to These Terms</h2>
            <p>We may update these terms from time to time. Continued use of the service after changes means you accept the new terms. We'll update the "last updated" date above.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Contact</h2>
            <p>Questions? Email us at <a href="mailto:legal@standup.so" className="text-white underline hover:text-zinc-300">legal@standup.so</a>.</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
          <Link href="/privacy" className="hover:text-zinc-300 mr-4">Privacy Policy</Link>
          <Link href="/" className="hover:text-zinc-300">← Home</Link>
        </div>
      </div>
    </div>
  );
}
