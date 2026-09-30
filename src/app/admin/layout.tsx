import type { Metadata } from 'next';

/**
 * Pass-through layout for everything under /admin. The authenticated shell
 * lives in the (dashboard) route group so that /admin/login can render
 * without being wrapped by the admin guard.
 */
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
