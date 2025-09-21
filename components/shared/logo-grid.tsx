import Image from "next/image";
import Link from "next/link";

import type { Partner } from "@/lib/types";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

export function LogoGrid({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => {
          const content = (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
              {partner.logo && (
                <div className="relative mb-4 h-20 w-40">
                  <Image src={partner.logo} alt={`${partner.name} logo`} fill className="object-contain" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-charcoal">{partner.name}</h3>
              {partner.blurb && (
                <div className="mt-2 text-sm text-charcoal/70">
                  <MarkdownRenderer content={partner.blurb} />
                </div>
              )}
            </div>
          );

          return partner.link ? (
            <Link key={partner.slug} href={partner.link} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary">
              {content}
            </Link>
          ) : (
            <div key={partner.slug}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
