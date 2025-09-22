"use client";

import { useEffect } from "react";

const IDENTITY_HASH_PARAMS = [
  "invite_token",
  "confirmation_token",
  "recovery_token",
  "access_token",
];

function shouldRedirect(hash: string | undefined | null) {
  if (!hash || hash.length <= 1) {
    return false;
  }

  const params = new URLSearchParams(hash.replace(/^#/, ""));

  return IDENTITY_HASH_PARAMS.some((param) => params.has(param));
}

export function IdentityRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const { hash, pathname } = window.location;

    if (pathname.startsWith("/admin")) {
      return;
    }

    if (shouldRedirect(hash)) {
      window.location.replace(`/admin/${hash}`);
    }
  }, []);

  return null;
}
