/**
 * Site-wide identity, metadata and links.
 * Change your headline, contact details or availability line here.
 */

export const site = {
  name: 'Laksh Gupta',
  /** Split so the surname can be italic-accented in the hero. */
  firstName: 'Laksh',
  lastName: 'Gupta',
  role: 'Backend Engineer · AI & Distributed Systems',
  /** Rotating hero eyebrow. Edit freely — 2 to 5 short roles works best. */
  roles: ['Backend Engineer', 'AI Engineer', 'Product Builder'],
  /** Browser tab and search-result title. */
  title: 'Laksh Portfolio',
  /** Search-result and link-preview description. Aim for 150–160 characters. */
  description:
    'Backend engineer with 4+ years building production services in Python and Golang — real-time enterprise systems, AI and retrieval platforms, and the infrastructure automation that keeps both shipping.',
  /** Hero paragraph. <b> marks the phrases that get emphasis. Keep it to one line of thought. */
  lede:
    'Four years building backend systems that hold up in production — <b>real-time services</b>, <b>AI platforms</b>, and the infrastructure that keeps them shipping.',

  location: 'Bengaluru, India',
  availability: 'Bengaluru, India · open to remote and relocation',
  /** Contact section heading. <br /> controls the line break. */
  contactHeading: 'Open to backend, platform<br />& AI infrastructure roles.',

  email: 'lakshgupta253@gmail.com',
  phone: '+91 96365 46575',
  links: {
    linkedin: 'https://linkedin.com/in/lakshg1',
    github: 'https://github.com/lakshg1',
  },

  /** Served from /public. Replace that file to update your résumé. */
  resumePath: '/resume.pdf',
  /** Filename recruiters see when they download it. */
  resumeFilename: 'Laksh_Gupta_Resume.pdf',
  /**
   * Shown next to the download button so recruiters know it is current.
   * `npm run resume <path-to-pdf>` updates the file AND this date for you.
   */
  resumeUpdated: 'July 2026',

  /** Headline figures in the hero. Four or five reads best. */
  stats: [
    { value: '4+', label: 'Years in production' },
    { value: '15+', label: 'Enterprise clients' },
    { value: '30%', label: 'Support tickets cut' },
    { value: '20+', label: 'Eng hours saved weekly' },
    { value: '4', label: 'Languages shipped' },
  ],

  /** Scrolling marquee. Order them by what you want noticed first. */
  ticker: [
    'Python', 'Golang', 'FastAPI', 'PostgreSQL', 'Kubernetes', 'WebSockets',
    'AsyncIO', 'pgvector', 'LangGraph', 'Django', 'MongoDB', 'Redis',
    'Docker', 'Ansible', 'Jenkins', 'SAML', 'AWS', 'Kotlin',
  ],
} as const;
