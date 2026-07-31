import type { Metadata } from 'next';
import { site } from '@/content/site';
import { resolveSkin, SKINS } from '@/content/skin';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: site.title,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
};

/**
 * Runs before paint: restores the visitor's saved theme, or falls back to
 * their system preference. Inline so there is no flash of the wrong theme.
 */
const themeBootstrap = `
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-t', t);
  } catch (e) {
    document.documentElement.setAttribute('data-t', 'light');
  }
})();
`;

/**
 * Restores a skin chosen in /studio (stored per-browser). Runs before paint.
 * Only affects the visitor who set it — the deployed default is untouched.
 */
const skinBootstrap = `
(function () {
  try {
    var s = localStorage.getItem('skin-override');
    var ok = ${JSON.stringify([...SKINS])};
    if (s && ok.indexOf(s) > -1) document.documentElement.setAttribute('data-skin', s);
  } catch (e) {}
})();
`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Backend Engineer',
  email: `mailto:${site.email}`,
  url: siteUrl,
  sameAs: [site.links.linkedin, site.links.github],
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const skin = resolveSkin();
  return (
    <html lang="en" data-skin={skin} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: skinBootstrap }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Space+Grotesk:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
