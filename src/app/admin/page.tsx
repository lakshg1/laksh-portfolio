import type { Metadata } from 'next';
import AdminClient from './AdminClient';

// Keep the route out of search engines. It's also intentionally undocumented.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

// Never statically prerender — it's all authed, dynamic data.
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminClient />;
}
