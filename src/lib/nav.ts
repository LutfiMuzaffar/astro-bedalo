// Public-site navigation config. Used by TopNav, MobileBottomNav, and Footer.
// `key` is matched against an `active` prop to decide which link gets the
// underline highlight. Adding a new section is a one-line change here.

export type NavKey =
  | 'home'
  | 'profil'
  | 'potensi'
  | 'agenda-berita'
  | 'galeri'
  | 'kontak'
  | 'kkn';

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
}

export const PUBLIC_NAV: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'profil', label: 'Profil', href: '/profil' },
  { key: 'potensi', label: 'Potensi', href: '/potensi' },
  { key: 'agenda-berita', label: 'Agenda & Berita', href: '/agenda-berita' },
  { key: 'galeri', label: 'Galeri', href: '/galeri' },
  { key: 'kontak', label: 'Kontak', href: '/kontak' },
];

export const FOOTER_PRIMARY_LINKS: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'potensi', label: 'Potensi Wisata', href: '/potensi/wisata' },
  { key: 'profil', label: 'Struktur Organisasi', href: '/profil/pemerintahan' },
];

export const FOOTER_LAYANAN_LINKS: NavItem[] = [
  { key: 'kkn', label: 'Program KKN', href: '/kkn' },
  { key: 'kkn', label: 'Arsip Desa', href: '/kkn/arsip' },
  { key: 'home', label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
];
