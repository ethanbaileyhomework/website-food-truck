import Image from "next/image";
import Link from "next/link";

import type { TeamMember } from "@/lib/types";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

export function TeamGrid({ team }: { team: TeamMember[] }) {
  if (team.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <article key={member.slug} className="flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-soft">
            {member.headshot && (
              <div className="relative mb-4 h-36 w-36 overflow-hidden rounded-full bg-sand">
                <Image src={member.headshot} alt={`${member.name} headshot`} fill className="object-cover" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-charcoal">{member.name}</h3>
            {member.role && <p className="text-sm text-brand-primary/80">{member.role}</p>}
            {member.body && (
              <div className="mt-3 text-sm text-charcoal/70">
                <MarkdownRenderer content={member.body} />
              </div>
            )}
            {member.email && (
              <Link href={`mailto:${member.email}`} className="mt-4 text-sm font-semibold text-brand-primary">
                Email {member.name.split(" ")[0]}
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
