export const metadata = {
  title: "Privacy",
  description: "Privacy statement placeholder for Cranbourne Food Truck.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold text-charcoal">Privacy statement</h1>
      <p className="text-base text-charcoal/75">
        This is a placeholder privacy statement. Update this page through the CMS or by editing app/privacy/page.tsx with your organisation’s privacy policy.
      </p>
      <p className="text-base text-charcoal/75">
        For questions please email <a className="text-brand-primary" href="mailto:hello@cranbournefoodtruck.com">hello@cranbournefoodtruck.com</a>.
      </p>
    </div>
  );
}
