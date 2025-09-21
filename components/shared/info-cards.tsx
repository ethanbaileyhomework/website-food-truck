import { HandHeart, ShoppingBasket, Soup } from "lucide-react";

import type { WhatWeDoCard } from "@/lib/types";

const iconMap = {
  bowl: Soup,
  basket: ShoppingBasket,
  hands: HandHeart,
};

export function InfoCards({ title, description, cards }: { title: string; description?: string; cards: WhatWeDoCard[] }) {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-charcoal sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base text-charcoal/75">{description}</p>}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = iconMap[card.icon as keyof typeof iconMap] ?? Soup;
          return (
            <article key={card.title} className="flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg">
              <div className="space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="text-xl font-semibold text-charcoal">{card.title}</h3>
                <p className="text-sm text-charcoal/75">{card.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
