export interface NavItem {
  label: string;
  href: string;
}

/** Single source of truth for the primary navigation and the footer links. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'Videos', href: '/videos' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Insights', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

/**
 * The cornerstone guides. They are kept out of the main navigation, which is
 * already full, and surfaced in the footer and from the pages they relate to —
 * where someone reading about the practice is actually likely to want them.
 */
export const GUIDE_ITEMS: NavItem[] = [
  { label: 'Traditional Healer in Uganda', href: '/traditional-healer-uganda' },
  { label: 'Traditional Doctor in Uganda', href: '/traditional-doctor-uganda' },
  { label: 'A Note on Terminology', href: '/witch-doctor-uganda' },
];

export const LEGAL_ITEMS: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
];
