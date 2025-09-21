export const metadata = {
  title: "Terms",
  description: "Terms of use placeholder for Cranbourne Food Truck.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold text-charcoal">Terms of use</h1>
      <p className="text-base text-charcoal/75">
        This is a placeholder terms of use page. Provide your service terms through the CMS or by editing app/terms/page.tsx with the appropriate information.
      </p>
      <p className="text-base text-charcoal/75">
        Contact us at <a className="text-brand-primary" href="mailto:hello@cranbournefoodtruck.com">hello@cranbournefoodtruck.com</a> with any questions.
      </p>
    </div>
  );
}
