import type { SiteSettings } from "@/lib/types";

export function TallyEmbed({
  tallyUrl,
  form,
}: {
  tallyUrl?: SiteSettings["tallyFormUrl"];
  form?: SiteSettings["volunteerForm"];
}) {
  const placeholderTitle = form?.placeholderTitle ?? "Volunteer form coming soon";
  const placeholderBody =
    form?.placeholderBody ?? "Add your Tally.so form URL in the CMS to display it here.";
  const iframeTitle = form?.iframeTitle ?? "Volunteer expression of interest form";

  return (
    <>
      {!tallyUrl ? (
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-dashed border-brand-primary/40 bg-white/60 p-10 text-center text-sm text-charcoal/70">
          <p className="font-semibold text-charcoal">{placeholderTitle}</p>
          <p className="mt-2">{placeholderBody}</p>
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-soft">
          <iframe
            src={tallyUrl}
            title={iframeTitle}
            className="h-[900px] w-full border-0"
            allow="fullscreen"
          />
        </div>
      )}
    </>
  );
}
