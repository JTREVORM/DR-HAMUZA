import type { SiteSettings } from '@/lib/types';
import { HEALER_MESSAGE } from '@/content/healer-message';

/**
 * Fallback values used before the admin has saved Site Settings, and as the
 * defaults for any single field the admin leaves blank. Everything here is
 * editable from /admin/settings — nothing about the business is hard-coded
 * anywhere else in the application.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Dr Salongo Hamuza',
  tagline: 'Professional Traditional Healer',
  short_description:
    'Dr Salongo Hamuza is a professional traditional healer from Uganda offering traditional and spiritual consultation to people facing personal, family, relationship, business and other difficulties in life.',
  phone: '0777172119',
  whatsapp: '0777172119',
  email: '',
  location: 'Uganda',
  map_embed_url: '',
  logo_url: '',
  favicon_url: '',
  hero_title: 'Traditional Guidance, Healing & Spiritual Consultation',
  hero_subtitle:
    'Dr Salongo Hamuza is a professional traditional healer from Uganda, offering traditional and spiritual consultation to people facing personal, family, relationship, business, career and other challenges in life. Every consultation is private, unhurried and treated in confidence.',
  hero_media_type: 'image',
  hero_media_url: '',
  hero_media_urls: [],
  hero_poster_url: '',
  consultation_cta: 'Request a Consultation',
  healer_message: HEALER_MESSAGE,
  about_short:
    'Dr Salongo Hamuza practises as a traditional healer in Uganda, receiving people who come to him with the difficulties of ordinary life — a marriage under strain, a household that has lost its peace, a business that will not move, a child falling behind at school, a journey that has stalled. He listens first, and gives guidance according to traditional practice.',
  about_long: '',
  years_experience: '',
  clients_served: '',
  languages_spoken: '',
  business_hours: [],
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  youtube_url: '',
  twitter_url: '',
  footer_text:
    'Traditional and spiritual consultation from Uganda. Every enquiry is treated privately and in confidence.',
  health_disclaimer:
    'Traditional and spiritual services are based on traditional beliefs and practices and should not replace diagnosis, treatment or advice from qualified healthcare professionals. Anyone experiencing a serious medical or mental-health condition should seek appropriate professional medical care.',
  general_disclaimer:
    'Traditional consultation is offered as guidance rooted in traditional belief and practice. No specific outcome, result or financial gain is promised or guaranteed, and individual experiences differ from person to person. Nothing unlawful is offered, and no request to cause harm to another person is accepted.',
  whatsapp_message:
    'Hello Dr Salongo Hamuza, I visited your website and would like to inquire about a consultation.',
  default_seo_title:
    'Dr Salongo Hamuza | Professional Traditional Healer in Uganda',
  default_seo_description:
    'Dr Salongo Hamuza is a professional traditional healer from Uganda offering traditional and spiritual consultation for relationship, family, business, career and other personal matters.',
  default_og_image: '/brand/logo.webp',
  google_site_verification: '',
  google_analytics_id: '',
};

/** Reasons people give for coming — used on the homepage and the About page. */
export const TRUST_POINTS = [
  {
    title: 'You are listened to first',
    body: 'Every consultation begins with the visitor speaking and Dr Salongo Hamuza listening. Nothing is assumed about your situation before you have described it in your own words.',
  },
  {
    title: 'Conversations stay private',
    body: 'What is said in a consultation stays between you and Dr Salongo Hamuza. No name, photograph or story is ever published on this website without permission given first.',
  },
  {
    title: 'Rooted in Ugandan tradition',
    body: 'The practice follows traditional Ugandan understanding, carried through generations, and is offered with respect for the beliefs each visitor brings with them.',
  },
  {
    title: 'Honest about what is offered',
    body: 'Guidance is offered; outcomes are never promised. Where a situation needs a doctor, the police, a lawyer or a teacher, you will be told so plainly.',
  },
  {
    title: 'Open to everyone',
    body: 'People come from every part of Uganda and from many faiths and backgrounds. Nobody is asked to leave their beliefs at the door.',
  },
  {
    title: 'Reachable by telephone',
    body: 'A call or a WhatsApp message is all that is needed to begin. You can describe your situation before deciding whether to come at all.',
  },
];

/** The shape of a consultation, shown on the About and Services pages. */
export const APPROACH_STEPS = [
  {
    step: '01',
    title: 'You make contact',
    body: 'You telephone or send a WhatsApp message and describe, in your own words, what you are carrying. There is no form to fill in and nothing to prepare beforehand.',
  },
  {
    step: '02',
    title: 'The matter is discussed',
    body: 'Dr Salongo Hamuza listens to the situation in full and asks the questions he needs to understand it. Nothing is rushed and nothing is assumed.',
  },
  {
    step: '03',
    title: 'Guidance is given',
    body: 'Guidance follows according to traditional practice. Where a matter also belongs with a doctor, the police, a teacher or a lawyer, that is said plainly.',
  },
  {
    step: '04',
    title: 'The decision stays yours',
    body: 'You are free to accept the guidance, to consider it, or to leave it. Nobody is pressed, and nobody is asked to do anything unlawful or harmful to another person.',
  },
];

export const CONSULTATION_TYPES = [
  'Relationship & Love Matters',
  'Family Matters',
  'Business & Career Matters',
  'Musicians & Entertainment',
  'Police & Army Career Matters',
  'Church & Spiritual Matters',
  'Travel Matters',
  'Fertility & Family Consultation',
  'Children & Education',
  'Fishermen',
  'Financial & Personal Progress',
  'Lost Property / Theft Concerns',
  'General Traditional Consultation',
];
