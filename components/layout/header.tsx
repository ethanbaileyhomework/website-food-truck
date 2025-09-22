"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

import type { NavigationItem, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Stats", href: "/stats" },
  { label: "Donate", href: "/donate", variant: "button" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "About", href: "/about" },
  { label: "Sponsors", href: "/sponsors" },
];

function getInitials(name: string) {
  const words = name
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
  if (words.length === 0) return "";
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "");
  return initials.join("");
}

function getNavItems(settings: SiteSettings) {
  if (settings.navigation && settings.navigation.length > 0) {
    return settings.navigation;
  }
  return DEFAULT_NAV_ITEMS;
}

function linkClasses(variant: NavigationItem["variant"], isDesktop: boolean) {
  if (variant === "button") {
    const base =
      "items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
    if (isDesktop) {
      return cn(
        "inline-flex",
        base,
        "bg-brand-primary text-white shadow-soft hover:bg-brand-primary/90 focus-visible:outline-brand-primary"
      );
    }
    return cn(
      "flex w-full text-base",
      base,
      "bg-brand-primary text-white shadow-soft hover:bg-brand-primary/90 focus-visible:outline-brand-primary"
    );
  }

  const base =
    "rounded-full px-3 py-2 text-sm font-medium text-charcoal transition hover:bg-brand-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";
  if (isDesktop) {
    return base;
  }
  return cn(base, "block w-full text-base");
}

export function Header({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const navItems = useMemo(() => getNavItems(settings), [settings]);
  const initials = useMemo(() => getInitials(settings.siteName), [settings.siteName]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={close}>
          {settings.logo ? (
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white">
              <Image
                src={settings.logo}
                alt={`${settings.siteName} logo`}
                fill
                className="object-contain"
                sizes="48px"
              />
            </span>
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/15 font-semibold text-brand-primary">
              {initials || settings.siteName[0] || ""}
            </span>
          )}
          <span className="text-lg font-semibold text-charcoal sm:text-xl">{settings.siteName}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(item.variant, true)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-white p-2 text-charcoal shadow-soft transition hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:hidden"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-2 border-t border-white/60 bg-white px-4 py-4 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(item.variant, false)}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
