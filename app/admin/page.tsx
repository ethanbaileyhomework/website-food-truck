// app/admin/page.tsx
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Admin() {
  return (
    <>
      <Script src="https://unpkg.com/decap-cms@^3/dist/decap-cms.js" strategy="afterInteractive" />
      <Script id="init-decap" strategy="afterInteractive">{`
        fetch('/api/cms-config', { cache: 'no-store' })
          .then(r => r.json())
          .then(cfg => window.CMS && window.CMS.init({ config: cfg }))
          .catch(() => alert('CMS config failed to load'));
      `}</Script>
      <div id="cms-root" />
    </>
  );
}
