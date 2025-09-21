import Link from "next/link";

import type { BankDetails, DonateLinks } from "@/lib/types";

export function DonateBox({ bank, donate }: { bank?: BankDetails; donate?: DonateLinks }) {
  if (!bank && !donate) return null;

  return (
    <section className="mx-auto mt-12 max-w-5xl rounded-3xl bg-white p-8 shadow-soft sm:p-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary/70">Direct deposit</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Bank transfer details</h3>
          </div>
          <dl className="space-y-3 text-sm">
            {bank?.accountName && (
              <div>
                <dt className="font-semibold text-charcoal/90">Account name</dt>
                <dd className="text-charcoal/80">{bank.accountName}</dd>
              </div>
            )}
            {bank?.bsb && (
              <div>
                <dt className="font-semibold text-charcoal/90">BSB</dt>
                <dd className="text-charcoal/80">{bank.bsb}</dd>
              </div>
            )}
            {bank?.accountNumber && (
              <div>
                <dt className="font-semibold text-charcoal/90">Account number</dt>
                <dd className="text-charcoal/80">{bank.accountNumber}</dd>
              </div>
            )}
            {bank?.reference && (
              <div>
                <dt className="font-semibold text-charcoal/90">Reference</dt>
                <dd className="text-charcoal/80">{bank.reference}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary/70">Give online</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Secure donate links</h3>
          </div>
          <div className="flex flex-col gap-3">
            {donate?.paypal && (
              <Link
                href={donate.paypal}
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                Donate via PayPal
              </Link>
            )}
            {donate?.stripe && (
              <Link
                href={donate.stripe}
                className="inline-flex items-center justify-center rounded-full border border-brand-primary/40 px-6 py-3 text-sm font-semibold text-brand-primary transition hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                Donate via Stripe
              </Link>
            )}
          </div>
          {donate?.note && <p className="text-xs text-charcoal/70">{donate.note}</p>}
        </div>
      </div>
    </section>
  );
}
