import {
  Anchor,
  Baby,
  Briefcase,
  Church,
  GraduationCap,
  Heart,
  Music,
  Plane,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  briefcase: Briefcase,
  music: Music,
  shield: Shield,
  church: Church,
  plane: Plane,
  baby: Baby,
  'graduation-cap': GraduationCap,
  anchor: Anchor,
  'trending-up': TrendingUp,
  search: Search,
  sparkles: Sparkles,
};

/** Maps the admin-chosen icon name to a Lucide icon, defaulting gracefully. */
export function ServiceIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = ICONS[name ?? ''] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}

export const SERVICE_ICON_NAMES = Object.keys(ICONS);
