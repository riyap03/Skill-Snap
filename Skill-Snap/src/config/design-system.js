export const designSystem = {
  colors: {
    ink: '#18302b',
    muted: '#6d7b75',
    paper: '#f7f8f3',
    panel: '#ffffff',
    line: '#dfe7df',
    accent: '#2f7564',
    accentSoft: '#e3f0ea',
    warm: '#c98645',
  },
  motion: {
    ease: [0.22, 1, 0.36, 1],
    page: { duration: 0.45 },
    stagger: 0.06,
  },
};

export const navGroups = [
  { label: 'Workspace', items: [
    { to: '/dashboard', label: 'Overview', glyph: '⌂' },
    { to: '/roadmap', label: 'Roadmap', glyph: '↗' },
    { to: '/projects', label: 'Projects', glyph: '＋' },
    { to: '/analytics', label: 'Progress', glyph: '◒' },
    { to: '/portfolio', label: 'Portfolio', glyph: '▧' },
  ]},
  { label: 'Explore', items: [
    { to: '/assessment', label: 'Assessment', glyph: '⌁' },
    { to: '/readiness', label: 'Readiness', glyph: '◎' },
  ]},
];

export default designSystem;

