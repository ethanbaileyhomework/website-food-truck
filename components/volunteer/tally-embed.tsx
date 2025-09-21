import type { SiteSettings } from "@/lib/types";

export function TallyEmbed({ tallyUrl }: { tallyUrl?: SiteSettings["tallyFormUrl"] }) {
  return (
    <>
      {!tallyUrl ? (
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-dashed border-brand-primary/40 bg-white/60 p-10 text-center text-sm text-charcoal/70">
          <p className="font-semibold text-charcoal">Volunteer form coming soon</p>
          <p className="mt-2">Add your Tally.so form URL in the CMS to display it here.</p>
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-soft">
          <iframe
            src={tallyUrl}
            title="Volunteer expression of interest form"
            className="h-[900px] w-full border-0"
            allow="fullscreen"
          />
        </div>
      )}
      <form name="volunteer-fallback" data-netlify="true" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message" />
      </form>
    </>
  );
}
