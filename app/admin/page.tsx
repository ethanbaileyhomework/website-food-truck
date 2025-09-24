"use client";

import { useEffect } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Admin() {
  useEffect(() => {
    window.CMS_MANUAL_INIT = true;

    let isCancelled = false;

    const initializeCms = async () => {
      if (isCancelled || !window.CMS || window.__decapInitialized) {
        return;
      }

      try {
        const response = await fetch("/api/cms-config", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const config = await response.json();

        if (!isCancelled) {
          window.CMS.init({ config });
          window.__decapInitialized = true;
        }
      } catch (error) {
        window.__decapInitialized = false;

        if (!isCancelled) {
          console.error("CMS config failed to load", error);
          alert("CMS config failed to load");
        }
      }
    };

    const handleLoad = () => {
      void initializeCms();
    };

    const handleError = () => {
      if (!isCancelled) {
        console.error("Failed to load Decap CMS script.");
        alert("CMS failed to load.");
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-decap-cms="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      if (window.CMS) {
        void initializeCms();
      }

      return () => {
        isCancelled = true;
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3/dist/decap-cms.js";
    script.async = true;
    script.dataset.decapCms = "true";
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    return () => {
      isCancelled = true;
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <div id="nc-root" />;
}
