'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-t');
    setTheme(t === 'dark' ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-t', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light or dark theme"
      className="flex h-[34px] w-[34px] items-center justify-center rounded-[2px] border border-line2 text-[13px] text-tx2 transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
