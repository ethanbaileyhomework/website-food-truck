export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  [key: string]: string | undefined;
};

export type ContactDetails = {
  email?: string;
  phone?: string;
  address?: string;
  abn?: string;
};

export type BankDetails = {
  accountName?: string;
  bsb?: string;
  accountNumber?: string;
  reference?: string;
};

export type DonateLinks = {
  paypal?: string;
  stripe?: string;
  note?: string;
};

export type DonationCopy = {
  bankSection?: {
    eyebrow?: string;
    title?: string;
    fieldLabels?: {
      accountName?: string;
      bsb?: string;
      accountNumber?: string;
      reference?: string;
    };
  };
  onlineSection?: {
    eyebrow?: string;
    title?: string;
    paypalLabel?: string;
    stripeLabel?: string;
  };
};

export type MapSettings = {
  embedUrl?: string;
  directionsUrl?: string;
};

export type ServiceLabels = {
  heroEyebrow?: string;
  sectionEyebrow?: string;
  notesTitle?: string;
  callCta?: string;
  emailCta?: string;
  mapTitle?: string;
};

export type ServiceDetails = {
  title?: string;
  days?: string;
  time?: string;
  location?: string;
  description?: string;
  phone?: string;
  email?: string;
  notes?: string[];
  ctaLabel?: string;
  labels?: ServiceLabels;
};

export type LookerSettings = {
  statsUrl?: string;
  embedTitle?: string;
};

export type AnalyticsSettings = {
  gaMeasurementId?: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  variant?: "link" | "button";
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSettings = {
  contactHeading?: string;
  contactBody?: string;
  socialHeading?: string;
  bottomNote?: string;
  links?: FooterLink[];
};

export type VolunteerFormSettings = {
  placeholderTitle?: string;
  placeholderBody?: string;
  iframeTitle?: string;
};

export type SeoSettings = {
  defaultDescription?: string;
  ogImage?: string;
};

export type SiteSettings = {
  siteName: string;
  siteTagline?: string;
  logo?: string;
  primaryColor?: string;
  contact: ContactDetails;
  socials?: SocialLinks;
  navigation?: NavigationItem[];
  bank?: BankDetails;
  donate?: DonateLinks;
  donationCopy?: DonationCopy;
  map?: MapSettings;
  service?: ServiceDetails;
  lookers?: LookerSettings;
  tallyFormUrl?: string;
  volunteerForm?: VolunteerFormSettings;
  footer?: FooterSettings;
  analytics?: AnalyticsSettings;
  seo?: SeoSettings;
};

export type HomeHeroCta = {
  label: string;
  href: string;
};

export type HomeHero = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image?: string;
  imageAlt?: string;
  ctas: {
    primary: HomeHeroCta;
    secondary?: HomeHeroCta;
  };
};

export type WhatWeDoCard = {
  title: string;
  description: string;
  icon: "bowl" | "basket" | "hands" | string;
};

export type WhatWeDoSection = {
  title: string;
  description?: string;
  cards: WhatWeDoCard[];
};

export type ImpactSection = {
  title: string;
  description?: string;
};

export type CarouselItem = {
  quote: string;
  name: string;
  role?: string;
  image?: string;
};

export type CarouselSection = {
  title?: string;
  items: CarouselItem[];
};

export type HomeContent = {
  hero: HomeHero;
  whatWeDo: WhatWeDoSection;
  impact: ImpactSection;
  carousel: CarouselSection;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type StatsFieldMapping = {
  date: string;
  meals: string;
  guests: string;
  volunteers: string;
  groceries: string;
  notes?: string;
};

export type StatsSettings = {
  sheet: {
    csvUrl?: string;
    fieldMapping: StatsFieldMapping;
    serviceDateFormat?: string;
  };
  fallbackTotals: {
    meals: number;
    guests: number;
    volunteers: number;
    groceries: number;
    services: number;
  };
  fallbackLatestService: {
    date: string;
    meals: number;
    guests: number;
    volunteers: number;
    groceries: number;
    notes?: string;
  };
  lookers?: LookerSettings;
  page?: {
    heading?: string;
    intro?: string;
  };
  latestSection?: {
    eyebrow?: string;
    srLabel?: string;
    streamingMessage?: string;
    fallbackMessage?: string;
    metrics?: {
      meals?: string;
      guests?: string;
      volunteers?: string;
      groceries?: string;
    };
  };
  totalsSection?: {
    metrics?: {
      meals?: string;
      guests?: string;
      volunteers?: string;
      services?: string;
    };
  };
  dashboardSection?: {
    title?: string;
    description?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
};

export type TeamMember = {
  name: string;
  role?: string;
  email?: string;
  headshot?: string;
  order?: number;
  body?: string;
  slug: string;
};

export type Story = {
  title: string;
  date: string;
  coverImage?: string;
  body?: string;
  slug: string;
};

export type Partner = {
  name: string;
  link?: string;
  logo?: string;
  blurb?: string;
  category?: string;
  order?: number;
  slug: string;
};

export type AboutContent = {
  story: {
    title: string;
    body: string;
  };
  missionVision: {
    title: string;
    mission: string;
    vision: string;
  };
  impact: {
    title: string;
    points: {
      title: string;
      description: string;
    }[];
  };
  partnerships: {
    title: string;
    description: string;
  };
  futurePlans: {
    title: string;
    body: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
};

export type DonateContent = {
  introTitle: string;
  introBody: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type VolunteerContent = {
  introTitle: string;
  introBody: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type SponsorsContent = {
  introTitle: string;
  introBody: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type LegalPageContent = {
  title: string;
  description?: string;
  body: string;
};

export type StatsApiLatestService = {
  date: string;
  meals: number;
  guests: number;
  volunteers: number;
  groceries: number;
  notes?: string;
};

export type StatsApiResponse = {
  totals: {
    meals: number;
    guests: number;
    volunteers: number;
    groceries: number;
    services: number;
  };
  latestService: StatsApiLatestService;
};
