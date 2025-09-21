import Link from "next/link";

import type { SiteSettings } from "@/lib/types";
import { ensureHttps } from "@/lib/utils";

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  tiktok: "TikTok",
};

export function Footer({ settings }: { settings: SiteSettings }) {
  const { contact, socials } = settings;

  return (
    <footer className="mt-16 border-t border-white/60 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-charcoal">Stay connected</h2>
          <p className="max-w-lg text-sm text-charcoal/80">
            {settings.siteTagline ?? "We’re here to serve our Cranbourne neighbours with warmth and dignity."}
          </p>
          <div className="space-y-2 text-sm">
            {contact?.email && (
              <p>
                <span className="font-medium">Email:</span>{" "}
                <Link href={`mailto:${contact.email}`} className="text-brand-primary">
                  {contact.email}
                </Link>
              </p>
            )}
            {contact?.phone && (
              <p>
                <span className="font-medium">Phone:</span>{" "}
                <Link href={`tel:${contact.phone}`} className="text-brand-primary">
                  {contact.phone}
                </Link>
              </p>
            )}
            {contact?.address && (
              <p>
                <span className="font-medium">Address:</span> {contact.address}
              </p>
            )}
            {contact?.abn && (
              <p>
                <span className="font-medium">ABN:</span> {contact.abn}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-charcoal">Follow our journey</h2>
          <div className="flex flex-wrap gap-3">
            {socials &&
              Object.entries(socials)
                .filter(([, url]) => Boolean(url))
                .map(([platform, url]) => (
                  <Link
                    key={platform}
                    href={ensureHttps(url)!}
                    className="inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    {socialLabels[platform] ?? platform}
                  </Link>
                ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/60 bg-sand/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-charcoal/70 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-brand-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-primary">
              Terms
            </Link>
            <span>Built with care for the Cranbourne community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
