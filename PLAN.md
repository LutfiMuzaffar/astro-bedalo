# Astro Migration Plan — Dusun Bedalo Official Website

## TL;DR — Verdict

**Yes, this site can be migrated to Astro with content collections and reusable components while preserving the design exactly as-is.** Confidence is high.

Why it's a clean fit:

- **No JavaScript runtime to port.** A grep of all 78 HTML files turned up zero `<script>` tags other than the Tailwind CDN loader and the inline `tailwind.config` block. There's no React/Vue/Alpine/jQuery/vanilla JS — just static markup styled with Tailwind. That eliminates the riskiest class of "design drift" failures.
- **One unified design system across all pages.** Every page embeds the same Tailwind config (same color tokens, font families, fontSize scale, custom spacing like `px-margin-desktop`, `mt-section-gap`, etc.) and the same `DESIGN.md` ("Coastal Heritage System") describes it formally. Porting it to a single static `tailwind.config.mjs` is mechanical.
- **The original designer already annotated the intended structure.** Several pages contain comments like `<!-- TopNavBar (Shared Component) -->` and `<!-- Footer (Shared Component) -->`. We're formalizing intent, not refactoring against the grain.
- **Content shapes are obvious.** "Berita / Agenda / Pengumuman / Wisata / UMKM / Album Galeri / Program Kerja KKN / Anggota KKN / Pemerintahan / Kuliner" map 1:1 to Astro content collections.

Caveats (call-outs the user must decide on, listed in §11):

1. The per-page nav markup has small drifts (different padding, different button radii, mobile-bottom-nav present on some). We need to canonicalize.
2. 17 of the 78 folders are `variant_*` design alternates — most of them are alternative explorations of the same 4–5 KKN pages. We need a decision on which variant is canonical.
3. All hero/article images point at `lh3.googleusercontent.com` (Stitch's image CDN). Those URLs eventually expire/rotate; we should download and self-host.
4. The site loads Tailwind via the CDN script (`cdn.tailwindcss.com`). Going production-grade means moving to a build-time Tailwind, which we'll do in a way that produces *byte-identical* utility class output to avoid any visual regression.

The rest of this document is the full migration plan.

---

## 1. Repository Inventory

Total: **79 directories**, **78 `code.html` pages**, **78 `screen.png` design references**, **1 `DESIGN.md` (Coastal Heritage System tokens)**.

### 1.1. Page inventory (62 product pages)

The following table groups every non-variant page into its target Astro route and content collection.

| # | Source folder | Page title | Target route | Becomes |
|---|---|---|---|---|
| 1 | `beranda_dusun_bedalo` | Dusun Bedalo - Keharmonisan Pesisir & Tradisi | `/` | Static page (`src/pages/index.astro`) |
| 2 | `profil_dusun_bedalo` | Profil Dusun Bedalo | `/profil` | Static page |
| 3 | `tentang_dusun_dusun_bedalo` | Tentang Dusun Bedalo | `/profil/tentang` | Static page |
| 4 | `demografi_dusun_bedalo_dusun_bedalo` | Demografi Dusun Bedalo | `/profil/demografi` | Static page |
| 5 | `letak_geografis_dusun_bedalo` | Letak Geografis | `/profil/letak-geografis` | Static page |
| 6 | `pemerintahan_dusun_dusun_bedalo` | Pemerintahan Dusun | `/profil/pemerintahan` | Static page (data from `pemerintahan` collection) |
| 7 | `lokasi_peta_dusun_bedalo` | Lokasi & Peta | `/profil/lokasi` | Static page |
| 8 | `fasilitas_umum_dusun_bedalo` | Fasilitas Umum | `/profil/fasilitas-umum` | Static page (data from `fasilitas` collection) |
| 9 | `karang_taruna_dan_pemuda_dusun_bedalo` | Karang Taruna dan Pemuda | `/profil/karang-taruna` | Static page |
| 10 | `sosial_agama_dan_budaya_dusun_bedalo` | Sosial, Agama, dan Budaya | `/profil/sosial-budaya` | Static page |
| 11 | `seni_dan_budaya_dusun_bedalo` | Seni dan Budaya | `/profil/seni-budaya` | Static page |
| 12 | `potensi_dusun_dusun_bedalo` | Potensi Dusun Bedalo | `/potensi` | Static page (links to wisata/umkm/etc.) |
| 13 | `pertanian_dan_perkebunan_dusun_bedalo` | Pertanian dan Perkebunan | `/potensi/pertanian` | Static page |
| 14 | `peternakan_dusun_bedalo` | Peternakan | `/potensi/peternakan` | Static page |
| 15 | `wisata_alam_dusun_bedalo` | Wisata Alam | `/potensi/wisata` | Index → `wisata` collection |
| 16 | `pantai_butuh_detail_wisata` | Pantai Butuh | `/potensi/wisata/pantai-butuh` | `wisata` collection entry |
| 17 | `pantai_mbirit_wisata_alam_dusun_bedalo` | Pantai Mbirit | `/potensi/wisata/pantai-mbirit` | `wisata` collection entry |
| 18 | `pantai_ngedan_wisata_alam_dusun_bedalo` | Pantai Ngedan | `/potensi/wisata/pantai-ngedan` | `wisata` collection entry |
| 19 | `pantai_ngluwen_dusun_bedalo` | Pantai Ngluwen | `/potensi/wisata/pantai-ngluwen` | `wisata` collection entry |
| 20 | `umkm_lokal_dusun_bedalo` | UMKM Lokal Dusun Bedalo | `/potensi/umkm` | Index → `umkm` collection |
| 21 | `detail_umkm_dusun_bedalo` | UMKM Detail | `/potensi/umkm/[slug]` | `umkm` detail template |
| 22 | `kuliner_lokal_bedalo` | Kuliner Lokal Bedalo | `/potensi/kuliner` | Index → `kuliner` collection |
| 23 | `agenda_berita_dusun_bedalo` | Agenda & Berita | `/agenda-berita` | Static page (combined index) |
| 24 | `agenda_dusun_bedalo` | Agenda Dusun | `/agenda` | Index → `agenda` collection |
| 25 | `detail_agenda_dusun_bedalo` | Agenda Detail | `/agenda/[slug]` | `agenda` detail template |
| 26 | `berita_dusun_bedalo` | Berita Dusun Bedalo | `/berita` | Index → `berita` collection |
| 27 | `detail_berita_dusun_bedalo` | Berita Detail | `/berita/[slug]` | `berita` detail template |
| 28 | `pengumuman_dusun_bedalo` | Pengumuman & Agenda | `/pengumuman` | Index → `pengumuman` collection |
| 29 | `detail_pengumuman_dusun_bedalo` | Pengumuman Detail | `/pengumuman/[slug]` | `pengumuman` detail template |
| 30 | `galeri_dusun_bedalo` | Galeri Desa | `/galeri` | Index hub |
| 31 | `galeri_foto_dusun_bedalo` | Galeri - Dusun Bedalo | `/galeri/foto` | Index → `galeri-album` collection |
| 32 | `galeri_video_dusun_bedalo` | Galeri Video | `/galeri/video` | Static page (or `galeri-video` collection if scaled) |
| 33 | `detail_album_galeri_dusun_bedalo` | Galeri Album KKN | `/galeri/album/[slug]` | `galeri-album` detail template |
| 34 | `case_study_digitalisasi_dusun_bedalo` | Digitalisasi Dusun Bedalo - Case Study | `/case-study/digitalisasi` | Static page |
| 35 | `media_sosial_dusun_bedalo` | Media Sosial Dusun | `/media-sosial` | Static page |
| 36 | `kontak_kami_dusun_bedalo` | Kontak | `/kontak` | Static page (form) |
| 37 | `kirim_pesan_dusun_bedalo` | Kirim Pesan | `/kontak/kirim-pesan` | Static page (form) |
| 38 | `kirim_dokumentasi_kkn` | Kirim Dokumentasi KKN | `/kkn/kirim-dokumentasi` | Static page (form, multi-step) |
| 39 | `kkn_di_dusun_bedalo_arsip_kenangan` | KKN di Dusun Bedalo - Arsip Desa | `/kkn` | Static landing page |
| 40 | `detail_kelompok_129_kkn_uin_suka_117` | KKN Reguler Angkatan 117 — Kelompok 129 | `/kkn/kelompok/129` | `kkn-kelompok` detail (or static) |
| 41 | `anggota_kkn_kelompok_129` | Anggota Kelompok 129 | `/kkn/kelompok/129/anggota` | Index → `kkn-anggota` collection |
| 42 | `program_kerja_kkn_kelompok_129` | Program Kerja KKN Kelompok 129 | `/kkn/kelompok/129/program-kerja` | Index → `kkn-proker` collection |
| 43 | `detail_program_kerja_kkn_kelompok_129` | Program Kerja KKN | `/kkn/proker/[slug]` | `kkn-proker` detail template |
| 44 | `detail_proker_bedalo_terang` | Proker Detail - Bedalo Terang | (sample data for `/kkn/proker/bedalo-terang`) | `kkn-proker` collection entry |
| 45 | `detail_proker_jumat_bersih_pantai_ngedan` | Jumat Bersih Pantai Ngedan | (sample data for `/kkn/proker/jumat-bersih`) | `kkn-proker` collection entry |
| 46 | `timeline_kkn_kelompok_129` | Timeline Pengabdian | `/kkn/kelompok/129/timeline` | Static page (data from `kkn-proker`) |
| 47 | `refleksi_kkn_kelompok_129` | Refleksi & Kenangan | `/kkn/kelompok/129/refleksi` | Static page |
| 48 | `dinding_kenangan_kkn` | Dinding Kenangan KKN | `/kkn/dinding-kenangan` | Index → `kkn-kenangan` collection |
| 49 | `peta_kegiatan_kkn_bedalo` | Peta Aktivitas KKN | `/kkn/peta` | Static page |
| 50 | `galeri_kegiatan_kkn_kelompok_129` | Galeri Kegiatan Kelompok 129 | `/kkn/galeri` | Index → `kkn-album` collection |
| 51 | `galeri_kenangan_kkn_dusun_bedalo` | Galeri Kenangan KKN | `/kkn/galeri/kenangan` | Index → `kkn-album` collection (filter: kenangan) |
| 52 | `detail_album_kkn_template` | Galeri Album KKN | `/kkn/galeri/[slug]` | `kkn-album` detail template |
| 53 | `arsip_dokumentasi_kegiatan` | Arsip Dokumentasi Kegiatan | `/kkn/arsip/dokumentasi` | Index → `kkn-album` (filter: arsip) |
| 54 | `arsip_proker_kkn_dusun_bedalo` | Arsip Program KKN | `/kkn/arsip/proker` | Index → `kkn-proker` (cross-batch) |
| 55 | `arsip_tulisan_kkn_dusun_bedalo` | Artikel KKN | `/kkn/arsip/tulisan` | Index → `kkn-tulisan` collection |
| 56 | `daftar_arsip_kkn_dusun_bedalo` | Daftar Arsip KKN | `/kkn/arsip` | Static landing page |
| 57 | `admin_dashboard_kontak_aspirasi` | Bedalo Admin - Kontak & Aspirasi | `/admin/kontak-aspirasi` | Admin layout (static demo) |
| 58 | `admin_dashboard_kontak_aspirasi_operational_view` | Kontak & Aspirasi - Bedalo Admin | `/admin/kontak-aspirasi/operational` | Admin layout (static demo) |

### 1.2. Variant pages (17, alternates needing triage)

These are alternative design explorations of a small number of public pages. Each needs a "keep / replace canonical / drop" decision before migration begins (see §11.2).

| Source folder | Variant of | Decision needed |
|---|---|---|
| `variant_1_clean_alternating_editorial` | Program Kerja KKN | Pick one |
| `variant_1_high_efficiency_list_view` | Program Kerja KKN | Pick one |
| `variant_2_high_impact_magazine_grid` | Program Kerja KKN | Pick one |
| `variant_2_horizontal_feature_strips` | Program Kerja KKN | Pick one |
| `variant_2_split_screen_high_contrast` | Program Kerja KKN | Pick one |
| `variant_3_editorial_narrative_layout` | Program Kerja KKN | Pick one |
| `variant_1_staggered_asymmetric_grid` | Program Kerja KKN Kelompok 129 | Pick one |
| `variant_2_high_energy_experimental_grid` | Program Kerja KKN Kelompok 129 | Pick one |
| `variant_3_interactive_glass_cards` | Program Kerja KKN Kelompok 129 | Pick one |
| `variant_1_kkn_impact_command_center_radical_1` | Mission Report (impact command center) | Pick one or drop |
| `variant_1_kkn_impact_command_center_radical_2` | Mission Report (impact command center) | Pick one or drop |
| `variant_2_kkn_digital_scrapbook_radical_1` | Program Kerja KKN Digital | Pick one |
| `variant_2_kkn_digital_scrapbook_radical_2` | Program Kerja KKN Digital | Pick one |
| `variant_2_immersive_showcase_gallery` | Album Galeri | Pick one |
| `variant_3_overlapping_path_narrative` | Jejak Pengabdian | Pick one |
| `variant_1_cinematic_editorial_narrative` | Arsip Program KKN | Pick one |
| `variant_1_cinematic_impact_timeline` | Arsip Program KKN | Pick one |

### 1.3. Asset inventory

- **240 inline `<img>` tags** across all pages, all sourced from `https://lh3.googleusercontent.com/aida-public/...`. These are Stitch CDN URLs and **must** be downloaded — they will rotate.
- **838 Material Symbols icon usages** (`<span class="material-symbols-outlined">`). The most-used icons are `arrow_forward`, `location_on`, `menu`, `chevron_right`, `chat`, `expand_more`, `calendar_today`, `search`, `schedule`, `photo_camera`, etc. The `data-icon="<name>"` attribute is informational (Stitch annotation) and should be dropped.
- **3 forms**: contact (`kontak_kami_dusun_bedalo`), kirim pesan (`kirim_pesan_dusun_bedalo`), kirim dokumentasi KKN (`kirim_dokumentasi_kkn`). All currently have no submit handler.
- **2 admin pages** with their own sidebar/topbar layout (no public footer).

---

## 2. Design System Audit

### 2.1. Tokens (from inline `tailwind.config` + `DESIGN.md`)

The same Tailwind config block appears in every page. We will lift it into `tailwind.config.mjs` verbatim.

**Colors** (Material 3 tonal palette — "Coastal Heritage"):

```
primary               #005d90    on-primary               #ffffff
primary-container     #0077b6    on-primary-container     #f3f7ff
primary-fixed         #cde5ff    primary-fixed-dim        #94ccff
on-primary-fixed      #001d32    on-primary-fixed-variant #004b74
secondary             #315ca9    on-secondary             #ffffff
secondary-container   #86adff    on-secondary-container   #033e8a
secondary-fixed       #d8e2ff    secondary-fixed-dim      #aec6ff
on-secondary-fixed    #001a42    on-secondary-fixed-variant #0f4490
tertiary              #864a00    on-tertiary              #ffffff
tertiary-container    #a95f00    on-tertiary-container    #fff6f1
tertiary-fixed        #ffdcc0    tertiary-fixed-dim       #ffb877
on-tertiary-fixed     #2e1600    on-tertiary-fixed-variant #6c3a00
error                 #ba1a1a    error-container          #ffdad6
on-error              #ffffff    on-error-container       #93000a
inverse-primary       #94ccff    inverse-surface          #2d3135
inverse-on-surface    #eef1f6    surface-tint             #006399
surface               #f7f9ff    surface-bright           #f7f9ff
surface-dim           #d7dae0    surface-variant          #e0e2e8
surface-container-lowest #ffffff surface-container-low    #f1f4f9
surface-container     #ebeef4    surface-container-high   #e6e8ee
surface-container-highest #e0e2e8 outline                 #707881
outline-variant       #bfc7d1
on-surface            #181c20    on-surface-variant       #404850
background            #f7f9ff    on-background            #181c20
```

**Spacing extensions** (must be ported precisely — these are referenced as utility names like `px-margin-desktop`, `mt-section-gap`):

```
unit            8px
gutter          32px
container-max   1280px
margin-desktop  64px
margin-mobile   20px
section-gap     120px
```

**Border radius** (note: this OVERRIDES Tailwind defaults):

```
DEFAULT  0.25rem
lg       0.5rem
xl       0.75rem
full     9999px
```

There is no `rounded-md`, `rounded-2xl`, etc. defined — but pages still use `rounded-2xl`, `rounded-[24px]`, `rounded-[48px]`. The Tailwind CDN treats unknown radius classes as JIT arbitrary values; our build-time Tailwind config must have JIT enabled (default in v3+) so these still work.

**Font families & sizes**:

```
display-lg          Sora 48px / 1.1 / -0.02em / 600
display-lg-mobile   Sora 36px / 1.2 / 600
headline-md         Sora 32px / 1.2 / 500
headline-sm         Sora 24px / 1.3 / 500
body-lg             Inter 18px / 1.6 / 400
body-md             Inter 16px / 1.5 / 400
label-caps          Inter 12px / 1 / 0.1em / 700
```

Each font name is registered as both a `fontFamily` token AND a `fontSize` token, so pages use them as a pair: `font-display-lg text-display-lg`. We must replicate that dual registration in `tailwind.config.mjs`.

### 2.2. Per-page custom CSS (inline `<style>` blocks)

Pages add small custom utilities. They appear in different combinations on different pages — we will hoist all of them into a single `src/styles/global.css` so every page has consistent access.

Observed declarations across the corpus:

```css
/* Material Symbols configuration */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* Topographic dot background */
.topo-bg {
  background-image: radial-gradient(circle at 2px 2px, rgba(3, 62, 138, 0.05) 1px, transparent 0);
  background-size: 40px 40px;
}

/* Organic blob mask */
.organic-shape {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}

/* Ambient navy-tinted shadow */
.ambient-shadow {
  box-shadow: 0 8px 32px -8px rgba(2, 62, 138, 0.08);
}

/* Glassmorphism nav */
.glass-nav {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Scrollbar hiding for horizontal scrollers */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Fine dot pattern overlay */
.pattern-overlay {
  background-image: radial-gradient(#d7dae0 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
}
```

(A few pages add per-page-only utilities that should stay scoped — see §13 verification step.)

### 2.3. Fonts

- Sora + Inter via Google Fonts (`fonts.googleapis.com`)
- Material Symbols Outlined via Google Fonts

### 2.4. Per-page nav drift (must canonicalize)

The nav block is declared "shared" by the original designer's comments but the markup drifts between pages. Examples encountered:

- `beranda` uses `text-body-md`; `agenda` uses `font-headline-sm text-headline-sm` on the link container.
- `galeri_dusun_bedalo` adds an extra `<nav class="md:hidden fixed bottom-0 ...">` mobile bottom-nav; most other pages don't.
- The "Hubungi Kami" CTA button uses `rounded-full` on some pages and `rounded-[24px]` on others.
- Dark-mode classes (`dark:bg-surface-dim/80`) are present on most pages but missing on `beranda`.
- Some nav blocks have a hamburger button (`<button class="md:hidden">`); `beranda` doesn't.

**Recommendation**: Canonicalize on a single `<TopNav active="..." />` component. The chosen canonical version will be the most feature-complete (with hamburger + dark-mode classes). The `active` prop drives the bottom-border highlight. We document the deviations and confirm with the user before merging.

### 2.5. Footer drift

- 76/78 pages have a `<footer>`. The 2 admin pages do not (correctly, per their own layout).
- Footer markup also has minor drifts (link copy varies). We canonicalize the same way and confirm copy with the user.

---

## 3. Target Astro Architecture

### 3.1. Stack decisions

| Concern | Choice | Rationale |
|---|---|---|
| Framework | **Astro 5** (latest) | Static-first, zero-JS by default, MDX support, content collections built-in |
| Styling | **Tailwind v3 via `@astrojs/tailwind`** + custom `tailwind.config.mjs` ported from inline config | Match existing utility classes 1:1; replace CDN with build-time PostCSS |
| Content | **Astro Content Collections** with `astro:content` and Zod schemas | Strong typing for berita/agenda/etc. frontmatter; getStaticPaths() friendly |
| Markdown | **MDX** (`@astrojs/mdx`) | Allows embedding components in long-form berita/case-study bodies |
| Images | **`astro:assets`** (built-in `<Image>`) | Auto-optimization, srcset, lazy loading; preserves visual fidelity |
| Icons | Material Symbols via Google Fonts CDN initially → **`@iconify-json/material-symbols`** + `astro-icon` later | Self-host for perf without changing visual output |
| Forms | Static HTML `<form>` posting to **Web3Forms / Formspree / a tiny Astro endpoint** (TBD with user) | Forms are static UI; we don't yet have backend |
| Search | Skip in v1, optionally add **Pagefind** in a follow-up | Static and zero-config |
| Deploy | **Cloudflare Pages or Vercel** (decision deferred) | Both support Astro adapters and ISR/edge if needed |
| Lang | TypeScript everywhere, `lang="id"` in HTML root (matches source) | Same as source |
| Package manager | `pnpm` | Standard for Astro projects |
| Node | LTS (current `v22`) | |

### 3.2. Project structure

```
astro-bedalo/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.svg
│   ├── images/                  # downloaded from lh3.googleusercontent.com
│   │   ├── beranda/
│   │   ├── berita/
│   │   ├── agenda/
│   │   ├── pengumuman/
│   │   ├── wisata/
│   │   ├── umkm/
│   │   ├── galeri/
│   │   ├── kkn/
│   │   └── shared/
│   └── og/
├── src/
│   ├── content/
│   │   ├── config.ts            # Zod schemas (see §4)
│   │   ├── berita/
│   │   ├── agenda/
│   │   ├── pengumuman/
│   │   ├── wisata/
│   │   ├── umkm/
│   │   ├── kuliner/
│   │   ├── galeri-album/
│   │   ├── kkn-proker/
│   │   ├── kkn-album/
│   │   ├── kkn-anggota/
│   │   ├── kkn-tulisan/
│   │   ├── kkn-kenangan/
│   │   ├── pemerintahan/
│   │   ├── fasilitas/
│   │   └── pages/               # (optional) static-page bodies as MDX
│   ├── layouts/
│   │   ├── BaseLayout.astro     # <html>, <head>, fonts, Tailwind CDN→build
│   │   ├── PublicLayout.astro   # BaseLayout + TopNav + Footer + slot
│   │   └── AdminLayout.astro    # BaseLayout + AdminSidebar + AdminTopBar + slot
│   ├── components/
│   │   ├── nav/
│   │   │   ├── TopNav.astro
│   │   │   ├── MobileBottomNav.astro
│   │   │   └── Footer.astro
│   │   ├── admin/
│   │   │   ├── AdminSidebar.astro
│   │   │   └── AdminTopBar.astro
│   │   ├── ui/
│   │   │   ├── Button.astro     # primary, ghost, on-secondary-container variants
│   │   │   ├── Chip.astro       # category/tag pills
│   │   │   ├── Icon.astro       # <span class="material-symbols-outlined">
│   │   │   ├── SectionHeading.astro  # H2 + accent underline
│   │   │   ├── Breadcrumb.astro
│   │   │   ├── Pagination.astro
│   │   │   ├── EyebrowLabel.astro    # "EXPLORE GUNUNGKIDUL" pill
│   │   │   └── DateBadge.astro
│   │   ├── decor/
│   │   │   ├── TopoBg.astro     # .topo-bg wrapper
│   │   │   ├── PatternOverlay.astro
│   │   │   └── OrganicShape.astro
│   │   ├── cards/
│   │   │   ├── BeritaCard.astro
│   │   │   ├── BeritaFeaturedCard.astro
│   │   │   ├── AgendaCard.astro
│   │   │   ├── PengumumanCard.astro
│   │   │   ├── WisataCard.astro
│   │   │   ├── UmkmCard.astro
│   │   │   ├── GaleriAlbumCard.astro
│   │   │   ├── KknProkerCard.astro
│   │   │   ├── KknAnggotaCard.astro
│   │   │   ├── PemerintahCard.astro
│   │   │   └── FasilitasCard.astro
│   │   ├── sections/
│   │   │   ├── HeroAsymmetric.astro       # homepage hero
│   │   │   ├── HeroFullbleed.astro        # detail-page hero
│   │   │   ├── StatsStrip.astro
│   │   │   ├── PotensiPreview.astro
│   │   │   ├── AgendaBeritaTeaser.astro
│   │   │   ├── KknMemoryTeaser.astro
│   │   │   ├── MasonryGallery.astro
│   │   │   ├── PhotoCollage.astro
│   │   │   ├── RelatedItems.astro
│   │   │   ├── Sidebar.astro              # search + popular + mini-pengumuman
│   │   │   ├── CategoryFilters.astro
│   │   │   └── TimelineList.astro
│   │   └── forms/
│   │       ├── ContactForm.astro
│   │       ├── KirimPesanForm.astro
│   │       ├── KirimDokumentasiForm.astro
│   │       ├── FormField.astro            # label + input/textarea
│   │       └── FormSelect.astro
│   ├── lib/
│   │   ├── nav.ts               # nav config (label, href, key)
│   │   ├── routes.ts            # constants
│   │   ├── date.ts              # ID locale formatting
│   │   └── content.ts           # collection sort/filter helpers
│   ├── pages/
│   │   └── (1:1 with §1.1 routing table)
│   └── styles/
│       └── global.css           # @tailwind directives + custom utilities (§2.2)
└── tests/
    ├── visual/                  # Playwright pixel-diff tests vs. original HTML
    └── a11y/                    # axe-core smoke checks
```

### 3.3. Layout composition

```
BaseLayout
├── <html lang="id">
├── <head>
│   ├── <meta>
│   ├── <link> Sora + Inter Google Fonts
│   ├── <link> Material Symbols Google Fonts
│   ├── global.css (Tailwind + custom utilities)
│   └── <slot name="head" /> (per-page meta/og)
└── <body class="bg-background text-on-surface font-body-md topo-bg">
    └── <slot />

PublicLayout extends BaseLayout
├── <TopNav active={activeKey} />
├── <main class="pt-24 overflow-hidden"><slot /></main>
└── <Footer />

AdminLayout extends BaseLayout
├── <AdminSidebar active={activeKey} />
└── <main class="flex-1 md:ml-[280px]">
    ├── <AdminTopBar />
    └── <slot />
```

---

## 4. Content Collections

### 4.1. Schema (`src/content/config.ts`)

```ts
import { defineCollection, z } from 'astro:content';

const image = z.string(); // path under public/ or imported asset

const berita = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string(),
    cover: imageSchema(),
    coverAlt: z.string(),
    publishedAt: z.coerce.date(),
    author: z.string().default('Pemerintah Dusun Bedalo'),
    category: z.enum(['umum', 'pembangunan', 'lingkungan', 'sosial', 'wisata']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const agenda = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    title: z.string(),
    excerpt: z.string(),
    cover: imageSchema().optional(),
    coverAlt: z.string().optional(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
    location: z.string(),
    organizer: z.string().optional(),
    audience: z.string().optional(),
    category: z.enum(['rapat', 'kegiatan', 'budaya', 'sosial', 'kkn']),
    status: z.enum(['upcoming', 'ongoing', 'past']).default('upcoming'),
  }),
});

const pengumuman = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    expiresAt: z.coerce.date().optional(),
    urgency: z.enum(['info', 'penting', 'darurat']).default('info'),
    issuer: z.string().default('Pemerintah Dusun Bedalo'),
    attachments: z.array(z.object({
      label: z.string(), href: z.string(),
    })).default([]),
  }),
});

const wisata = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    name: z.string(),
    type: z.enum(['pantai', 'gua', 'air-terjun', 'bukit', 'lainnya']),
    tagline: z.string(),
    cover: imageSchema(),
    coverAlt: z.string(),
    gallery: z.array(z.object({
      src: imageSchema(), alt: z.string(),
    })).default([]),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    facilities: z.array(z.string()).default([]),
    accessNote: z.string().optional(),
    bestTimeToVisit: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const umkm = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    name: z.string(),
    owner: z.string().optional(),
    category: z.enum(['kuliner', 'kerajinan', 'jasa', 'pertanian', 'lainnya']),
    summary: z.string(),
    cover: imageSchema(),
    coverAlt: z.string(),
    products: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      photo: imageSchema().optional(),
      price: z.string().optional(),
    })).default([]),
    gallery: z.array(z.object({ src: imageSchema(), alt: z.string() })).default([]),
    contact: z.object({
      whatsapp: z.string().optional(),
      instagram: z.string().optional(),
      address: z.string().optional(),
    }).default({}),
  }),
});

const kuliner = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    name: z.string(),
    summary: z.string(),
    cover: imageSchema(),
    coverAlt: z.string(),
    ingredients: z.array(z.string()).default([]),
    soldBy: z.array(z.string()).default([]), // umkm slugs
  }),
});

const galeriAlbum = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    cover: imageSchema(),
    coverAlt: z.string(),
    photos: z.array(z.object({
      src: imageSchema(), alt: z.string(), caption: z.string().optional(),
    })),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const kknProker = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    title: z.string(),
    kelompok: z.string(),                     // e.g. '129'
    angkatan: z.string(),                     // e.g. '117'
    period: z.string(),                       // 'Juli - Agustus 2025'
    pic: z.string().optional(),
    summary: z.string(),
    cover: imageSchema(),
    coverAlt: z.string(),
    objectives: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
    timeline: z.array(z.object({
      date: z.coerce.date(),
      title: z.string(),
      description: z.string().optional(),
    })).default([]),
    impact: z.string().optional(),
    gallery: z.array(z.object({ src: imageSchema(), alt: z.string() })).default([]),
    status: z.enum(['planning', 'ongoing', 'completed']).default('completed'),
  }),
});

const kknAlbum = defineCollection({
  type: 'content',
  schema: ({ image: imageSchema }) => z.object({
    title: z.string(),
    kelompok: z.string(),
    cover: imageSchema(),
    coverAlt: z.string(),
    photos: z.array(z.object({ src: imageSchema(), alt: z.string() })),
    publishedAt: z.coerce.date(),
    bucket: z.enum(['kegiatan', 'kenangan', 'arsip']).default('kegiatan'),
  }),
});

const kknAnggota = defineCollection({
  type: 'data',
  schema: ({ image: imageSchema }) => z.object({
    name: z.string(),
    nim: z.string().optional(),
    role: z.string(),                         // e.g. 'Koordinator', 'Sekretaris'
    fakultas: z.string().optional(),
    photo: imageSchema(),
    photoAlt: z.string(),
    bio: z.string().optional(),
    kelompok: z.string(),
  }),
});

const kknTulisan = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    excerpt: z.string(),
    kelompok: z.string(),
  }),
});

const kknKenangan = defineCollection({
  type: 'data',
  schema: ({ image: imageSchema }) => z.object({
    author: z.string(),
    photo: imageSchema().optional(),
    photoAlt: z.string().optional(),
    message: z.string(),
    publishedAt: z.coerce.date(),
  }),
});

const pemerintahan = defineCollection({
  type: 'data',
  schema: ({ image: imageSchema }) => z.object({
    name: z.string(),
    role: z.string(),
    photo: imageSchema(),
    photoAlt: z.string(),
    bio: z.string().optional(),
    order: z.number().default(0),
  }),
});

const fasilitas = defineCollection({
  type: 'data',
  schema: ({ image: imageSchema }) => z.object({
    name: z.string(),
    type: z.enum(['pendidikan', 'kesehatan', 'ibadah', 'olahraga', 'pemerintahan', 'lainnya']),
    description: z.string(),
    photo: imageSchema().optional(),
    photoAlt: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const collections = {
  berita, agenda, pengumuman,
  wisata, umkm, kuliner,
  'galeri-album': galeriAlbum,
  'kkn-proker': kknProker,
  'kkn-album': kknAlbum,
  'kkn-anggota': kknAnggota,
  'kkn-tulisan': kknTulisan,
  'kkn-kenangan': kknKenangan,
  pemerintahan, fasilitas,
};
```

### 4.2. Mapping detail templates → collections

| Source detail page | Astro page | Loads from |
|---|---|---|
| `detail_berita_dusun_bedalo/code.html` | `src/pages/berita/[slug].astro` | `getCollection('berita')` + render `<Content />` |
| `detail_agenda_dusun_bedalo/code.html` | `src/pages/agenda/[slug].astro` | `getCollection('agenda')` |
| `detail_pengumuman_dusun_bedalo/code.html` | `src/pages/pengumuman/[slug].astro` | `getCollection('pengumuman')` |
| `pantai_butuh_detail_wisata/code.html` etc. | `src/pages/potensi/wisata/[slug].astro` | `getCollection('wisata')` |
| `detail_umkm_dusun_bedalo/code.html` | `src/pages/potensi/umkm/[slug].astro` | `getCollection('umkm')` |
| `detail_album_galeri_dusun_bedalo/code.html` | `src/pages/galeri/album/[slug].astro` | `getCollection('galeri-album')` |
| `detail_album_kkn_template/code.html` | `src/pages/kkn/galeri/[slug].astro` | `getCollection('kkn-album')` |
| `detail_program_kerja_kkn_kelompok_129/code.html` + `detail_proker_*` | `src/pages/kkn/proker/[slug].astro` | `getCollection('kkn-proker')` |
| `detail_kelompok_129_kkn_uin_suka_117/code.html` | `src/pages/kkn/kelompok/[slug].astro` | static or `kkn-kelompok` collection if more batches arrive |

### 4.3. Initial seed content

We seed each collection with the example data already present in the source HTML:

- **berita**: 4–6 entries from `berita_dusun_bedalo` cards + the body of `detail_berita_dusun_bedalo`.
- **agenda**: 4–8 entries from `agenda_dusun_bedalo` and `detail_agenda_dusun_bedalo`.
- **pengumuman**: 4–6 entries from `pengumuman_dusun_bedalo` and `detail_pengumuman_dusun_bedalo`.
- **wisata**: 4 entries — Pantai Butuh, Pantai Mbirit, Pantai Ngedan, Pantai Ngluwen.
- **umkm**: 4–8 sample entries from `umkm_lokal_dusun_bedalo` cards + body of `detail_umkm_dusun_bedalo`.
- **kkn-proker**: 6–10 entries from `program_kerja_kkn_kelompok_129` + the two `detail_proker_*` pages as fully-fleshed examples.
- **kkn-anggota**: roster from `anggota_kkn_kelompok_129`.
- **galeri-album**, **kkn-album**: 2–4 sample albums each.
- **pemerintahan**, **fasilitas**: sample entries from the relevant pages.

This seed data ensures each list/index page has realistic content from day one.

---

## 5. Reusable Components

### 5.1. UI primitives

| Component | Replaces | Props |
|---|---|---|
| `Button` | every primary/ghost CTA in the site | `variant: 'primary' \| 'ghost' \| 'on-secondary'`, `size: 'md' \| 'lg'`, `as`, `href`, `icon` |
| `Chip` | "EXPLORE GUNUNGKIDUL" eyebrow, category pills | `tone: 'primary-fixed' \| 'tertiary-fixed' \| 'surface-container'`, `icon` |
| `Icon` | `<span class="material-symbols-outlined">` | `name`, `fill: 0\|1`, `weight`, `class` |
| `SectionHeading` | `<h2>` + `<div class="w-24 h-1 bg-primary mx-auto rounded-full">` | `level: 2\|3`, `align`, `eyebrow`, `accent: bool` |
| `Breadcrumb` | crumb trails on detail pages | `items: { label, href }[]` |
| `Pagination` | berita/agenda list pages | `currentPage`, `totalPages`, `baseHref` |
| `EyebrowLabel` | "EXPLORE GUNUNGKIDUL" small label | `text`, `icon`, `tone` |
| `DateBadge` | calendar pill on agenda cards | `date: Date`, `variant` |

### 5.2. Decorative

| Component | Replaces |
|---|---|
| `TopoBg` | wrappers using `.topo-bg` |
| `PatternOverlay` | wrappers using `.pattern-overlay` |
| `OrganicShape` | image masks with `border-radius: 60% 40% 30% 70% / ...` |

### 5.3. Card components (one per content collection)

Each card is a thin presentational wrapper around its corresponding collection entry, pre-styled to match the existing card markup in the source site.

| Component | Used in |
|---|---|
| `BeritaCard`, `BeritaFeaturedCard` | `/berita`, homepage agenda-berita teaser |
| `AgendaCard` | `/agenda`, homepage |
| `PengumumanCard` | `/pengumuman`, sidebar mini-feed |
| `WisataCard` | `/potensi/wisata`, homepage potensi |
| `UmkmCard` | `/potensi/umkm`, homepage |
| `GaleriAlbumCard` | `/galeri/foto`, `/galeri` |
| `KknProkerCard` | `/kkn/.../program-kerja`, `/kkn/arsip/proker` |
| `KknAnggotaCard` | `/kkn/.../anggota` |
| `PemerintahCard` | `/profil/pemerintahan` |
| `FasilitasCard` | `/profil/fasilitas-umum` |

### 5.4. Section components

| Component | Used in |
|---|---|
| `HeroAsymmetric` | homepage |
| `HeroFullbleed` | detail pages (Pantai Butuh, UMKM detail, etc.) |
| `StatsStrip` | homepage and a few profile pages |
| `PotensiPreview` | homepage |
| `AgendaBeritaTeaser` | homepage |
| `KknMemoryTeaser` | homepage |
| `MasonryGallery` | `/galeri/*`, detail album pages |
| `PhotoCollage` | homepage hero, KKN album hero |
| `RelatedItems` | end of every detail page |
| `Sidebar` | `/berita`, `/agenda` |
| `CategoryFilters` | listing pages |
| `TimelineList` | `/kkn/.../timeline`, KKN proker detail |

### 5.5. Form components

| Component | Used in |
|---|---|
| `FormField` (text/email/tel/textarea) | all 3 forms |
| `FormSelect` | kirim dokumentasi |
| `ContactForm` | `/kontak` |
| `KirimPesanForm` | `/kontak/kirim-pesan` |
| `KirimDokumentasiForm` | `/kkn/kirim-dokumentasi` (multi-step) |

### 5.6. Admin components

| Component | Used in |
|---|---|
| `AdminSidebar` | `/admin/*` |
| `AdminTopBar` | `/admin/*` |

---

## 6. Pixel-Parity Strategy

This is the **most important** section, since the user's hard requirement is "preserving the design exactly as is."

### 6.1. Strict-parity rules (apply to every component extraction)

1. Every utility class on every preserved DOM node is copied **verbatim** from the source.
2. The DOM tree is preserved 1:1 (same tag names, same nesting depth, same text content, same attribute order tolerated). The diff is computed by Playwright pixel comparison, not by HTML diff.
3. Inline `<style>` blocks from the source are merged into `global.css` *and not pruned* until pixel-parity tests pass.
4. The Tailwind config is a verbatim port of the inline config; nothing is renamed or "cleaned up." Every `text-headline-md`, `font-headline-md`, `px-margin-desktop`, `mt-section-gap` etc. resolves to the same value as before.
5. Custom radii like `rounded-[24px]`, `rounded-[48px]` continue to work via Tailwind JIT.

### 6.2. Two-pass migration for each page

For every source `code.html`:

- **Pass 1 — vertical slice**: copy the body content into a single `.astro` page (no component extraction), keep the `<head>` minimal, render with build-time Tailwind. Compare visually against the original. This proves Tailwind + fonts + custom utilities reproduce exactly.
- **Pass 2 — componentize**: replace nav, footer, hero, cards, sections with the components from §5. After each replacement, re-run the visual diff and assert no regression.

### 6.3. Visual regression harness

`tests/visual/snapshot.spec.ts` (Playwright):

```ts
const pages = [
  { src: '../site/stitch_dusun_bedalo_official_website/beranda_dusun_bedalo/code.html',
    astro: '/' },
  // ... one entry per migrated page
];

for (const { src, astro } of pages) {
  test(`${astro} matches original`, async ({ page }) => {
    await page.goto(`file://${path.resolve(src)}`);
    const original = await page.screenshot({ fullPage: true });

    await page.goto(`http://localhost:4321${astro}`);
    const ported = await page.screenshot({ fullPage: true });

    expect(pixelmatch(original, ported)).toBeLessThan(0.005); // <0.5% diff
  });
}
```

We run this at three viewports: 1440px (desktop), 768px (tablet), 375px (mobile). The same harness can also be wired into CI.

### 6.4. Tailwind-CDN risk mitigation

The source loads `https://cdn.tailwindcss.com?plugins=forms,container-queries`. We replicate that with:

- `@astrojs/tailwind` integration
- `@tailwindcss/forms` and `@tailwindcss/container-queries` plugins
- Verbatim `tailwind.config.mjs` (see §2.1)
- `darkMode: 'class'` (matches source)
- JIT mode (default)

If any rendering diff appears between CDN Tailwind and build-time Tailwind, we enumerate it and either (a) add the missing utility manually, or (b) keep the CDN script for that one page until parity is achieved (escape hatch).

### 6.5. Font-rendering risk

We keep Google Fonts CDN for Sora + Inter + Material Symbols initially (matches source exactly). After parity is achieved, an optional follow-up replaces them with `@fontsource/sora` and `@fontsource/inter` for self-hosting performance — but only after re-running the visual harness to confirm no rendering shift.

### 6.6. Image-rendering risk

`lh3.googleusercontent.com` URLs may serve different sizes/quality based on UA or query parameters. We download each unique URL once, store under `public/images/`, and reference deterministically. This eliminates any drift from CDN re-encoding.

---

## 7. Image Migration

### 7.1. Discovery

```bash
grep -hoE 'https://lh3\.googleusercontent\.com/aida-public/[A-Za-z0-9_-]+' \
  site/stitch_dusun_bedalo_official_website/*/code.html \
  | sort -u > image-urls.txt
```

Expected: 240 inline `<img>` tags; after dedupe likely ~150–200 unique URLs.

### 7.2. Download & rewrite

A one-shot Node script:

1. Reads `image-urls.txt`.
2. Downloads each into `public/images/imported/<sha1>.jpg` (we keep the SHA-1 of the URL as the filename — stable, deterministic, no clashes).
3. Probes with `sharp` to get intrinsic dimensions and content-type.
4. Builds a JSON map `{ originalUrl: { localPath, width, height } }` saved to `src/data/image-map.json`.
5. During page migration, every `src="https://lh3..."` is rewritten to the local path; `data-alt` is moved to the `alt` attribute.

### 7.3. Optimization

In Astro pages, replace `<img src="...">` with `<Image src={import('...')} alt="..." width={...} height={...} />` to get automatic responsive `srcset` + WebP. Apply this **only after** strict-parity tests pass on the static image variant — the optimization step should not visually regress.

---

## 8. Forms

3 forms exist (kontak, kirim pesan, kirim dokumentasi). Decision the user must make:

| Option | What it looks like | Pros | Cons |
|---|---|---|---|
| (a) **Web3Forms / Formspree / Getform** | Form action posts to a 3rd-party endpoint, server emails the dusun office. | No backend code, free tier covers low volume. | Vendor lock-in, terms-of-service review needed. |
| (b) **Astro endpoint + Resend / SMTP** | `src/pages/api/kirim-pesan.ts` server endpoint, sends email via API. | Self-contained, easy to replace later. | Requires SMTP/API key. |
| (c) **Astro endpoint + Supabase / Postgres** | Same as (b) but persists to DB. | Auditability + admin dashboard becomes real. | More moving parts. |

Until the user picks, we ship the forms as plain HTML with `method="POST" action="#"` and a "Submit" button — the markup is identical to source. We add a small banner saying "form submission is not wired yet" only in dev mode.

---

## 9. Admin Pages

The two admin pages are static demos — there's no real auth or data layer. We migrate them with the same strict-parity approach but route them under `/admin/...` and skip them from the public sitemap. If the user later wants a real admin, it becomes a separate workstream (auth, DB, RLS).

---

## 10. Migration Phases & Effort

Estimate assumes one engineer working full-time. Calendar days are pessimistic.

| Phase | Goal | Effort | Output |
|---|---|---|---|
| **0** Audit & decisions | Resolve §11 questions with user | 0.5 day | Sign-off on canonical nav/footer, variant triage, image strategy, form backend |
| **1** Bootstrap | `astro create`, install deps, `tailwind.config.mjs`, `global.css`, fonts | 0.5 day | Empty Astro project that renders a "Hello" page in the right typeface |
| **2** Layouts | `BaseLayout`, `PublicLayout`, `TopNav`, `Footer`, visual harness wired | 1.5 days | Homepage shell renders pixel-identical to source nav+footer |
| **3** UI primitives | Button, Chip, Icon, SectionHeading, Breadcrumb, Pagination, decor utils | 1.5 days | Storybook-like demo page using all primitives |
| **4** Content schema + seed data | `src/content/config.ts`, seed every collection with sample MD/MDX | 2 days | All collections type-check; sample data realistic |
| **5** Static pages — homepage | Strict parity for `/` (the heaviest page) | 1.5 days | `/` matches source <0.5% pixel diff at all 3 viewports |
| **6** Static pages — profil/potensi/etc. | ~24 mostly-static pages | 4 days | `/profil/*`, `/potensi/*`, `/galeri/*`, `/case-study/*`, etc. |
| **7** List/index pages | `/berita`, `/agenda`, `/pengumuman`, `/potensi/wisata`, `/potensi/umkm`, `/galeri/foto`, `/kkn/.../program-kerja` etc. with collection queries | 2 days | All list pages render from collections |
| **8** Detail templates `[slug].astro` | One per collection | 2 days | Detail pages render from collections with `getStaticPaths()` |
| **9** Forms | 3 forms wired per chosen backend (§8) | 1 day | Forms submit and (in dev) show a confirmation step |
| **10** Admin pages | 2 pages with `AdminLayout` | 1 day | Routes under `/admin/*` |
| **11** Variants | Decide which variant pages to migrate; archive the rest | 0.5 day | Final route set frozen |
| **12** Image migration | Download + rewrite + optimize | 1 day | All Google CDN URLs replaced with local assets |
| **13** Visual regression | Run harness on every page; fix regressions | 1.5 days | All pages within tolerance at 3 viewports |
| **14** Polish | Sitemap, RSS, robots, OG images, 404, lighthouse pass | 1 day | LH ≥ 95 perf/SEO/best-practices; ≥ 90 a11y |
| **15** Deploy | CI + preview + production | 0.5 day | Live URL on Cloudflare/Vercel |

**Total: ~22 working days (≈ 4.5 calendar weeks for one engineer).**

This assumes user-side decisions in §11 don't grow the scope (e.g., real CMS, auth, search). Each unknown becomes its own follow-up.

---

## 11. Open Decisions (Need User Input Before Coding)

These are the only blocking unknowns. Everything else can proceed once these are resolved.

1. **Canonical nav & footer.** I propose `beranda_dusun_bedalo`'s nav with these additions: hamburger button + dark-mode classes from `berita_dusun_bedalo`. Confirm or pick a different page as canonical.
2. **Variant triage.** For each of the 17 `variant_*` folders (§1.2), decide: keep as the canonical version, keep alongside (route as alt), or drop. Default if you don't say: drop all variants and keep only the non-variant pages.
3. **Form backend.** Pick (a)/(b)/(c) from §8. Default: (a) Web3Forms.
4. **Image hosting.** Confirm we should download all Google CDN images to `public/images/`. Default: yes.
5. **Search.** Add Pagefind in v1, or skip? Default: skip; add in v2.
6. **Multi-language.** Source is `lang="id"` only. Confirm we don't need i18n (id+en). Default: id-only.
7. **CMS layer.** Content collections live as Markdown/MDX in the repo. Is that acceptable, or do you want a headless CMS (Decap, Sanity, TinaCMS) on top? Default: Git-based MD/MDX in v1; CMS as a v2 add-on.
8. **Hosting.** Cloudflare Pages, Vercel, Netlify, or self-host? Default: Cloudflare Pages.
9. **Domain.** Production domain to point at? (Affects sitemap canonical URLs and OG tags.)
10. **Analytics.** Plausible / GA4 / none? Default: none (privacy-first).
11. **Repo location.** New repo or a new branch on an existing one? Default: new repo `astro-bedalo`.

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tailwind CDN ↔ build-time Tailwind output diverges (unknown utility, JIT edge case) | Medium | Page renders differently | Visual regression harness catches it pre-merge; fall back to CDN per-page as escape hatch |
| Google Fonts CDN serves slightly different metrics than `@fontsource` | Low | Sub-pixel layout shift | Keep Google Fonts CDN until parity confirmed; only swap with explicit re-snapshot |
| `lh3.googleusercontent.com` URLs expire mid-migration | High over time | Broken images | Mitigated by §7 (download immediately) |
| Per-page nav drift means "canonical" nav doesn't match every page | High | Some pages look slightly different | Document deviations; user signs off on canonical version (§11.1) |
| Variant pages aren't real product pages — migrating them all wastes effort | High | Scope creep | §11.2 triage upfront |
| Forms have no backend → look broken | Medium | UX regression vs. zero (since source forms also don't submit) | Pick a backend in §11.3 before launch |
| Dark-mode classes are present on most pages but not used on the homepage. We don't know if dark mode is "real" | Medium | We ship a half-dark-mode | Treat dark mode as out-of-scope for v1; remove `dark:` classes (no visual change in light mode) OR add a working dark toggle. **Default: keep `dark:` classes verbatim, no toggle, no UX impact.** |
| `data-icon` and `data-alt` are Stitch artifacts; some have very rich alt text that's actually useful | High | Lose accessibility text if dropped | Migration script copies `data-alt` → `alt`, drops `data-icon` |
| Collections schema change later forces frontmatter rewrites | Medium | Refactor cost | Schemas in §4 are designed to be additive; new fields default-null |
| Content drift: real-world editors will want a CMS, not git PRs | Low (v1) | Editor friction | Plan CMS as v2 (§11.7) |

---

## 13. Verification & Acceptance Criteria

A page is considered "migrated" when **all** of the following are true:

1. **Pixel parity**: visual regression harness reports < 0.5% diff vs. the source `code.html` at 1440px, 768px, 375px viewports.
2. **DOM parity** (best-effort): the rendered DOM has the same hierarchy of major landmarks (nav, main, sections, footer) as the source. Spot-checked manually for 10 representative pages.
3. **Tailwind class identity**: the production build's CSS contains every utility class used in the source (verified by intersecting the source's class list with `dist/_astro/*.css`).
4. **Lighthouse**: Performance ≥ 95, Best Practices ≥ 95, SEO ≥ 95, Accessibility ≥ 90 on 3 representative pages (homepage, berita list, berita detail).
5. **Type-check** (`astro check`) passes.
6. **Build** (`astro build`) succeeds and emits the expected number of routes.
7. **Internal links** resolve (we replace all `href="#"` placeholders with real routes during migration).
8. **Forms** render and at least submit-and-show-confirmation in dev (production wiring per §11.3).

---

## 14. Out of Scope (V1)

To keep v1 shippable in the §10 timeline, the following are **explicitly deferred**:

- Real authenticated admin panel (only static demo pages).
- Real CMS (Decap/Sanity/Tina) — content collections are file-based in v1.
- Multi-language (`/en/...`).
- Server-rendered features that need a runtime (full-text search, comments, like/share counters).
- Performance budget enforcement in CI.
- E2E tests beyond the visual harness.
- A11y audit beyond axe-core smoke + Lighthouse.
- Re-design of any page (this migration is design-preserving by mandate).

Each is a candidate for a v2 roadmap once v1 ships.

---

## 15. Appendices

### 15.1. Decisions cheat-sheet (default values used unless user overrides)

| Decision | Default |
|---|---|
| Astro version | 5.x |
| Tailwind version | 3.x |
| Package manager | pnpm |
| Hosting | Cloudflare Pages |
| Image strategy | Download all Stitch CDN images to `public/images/` |
| Form backend | Web3Forms |
| Search | Skip in v1 |
| i18n | Indonesian only |
| CMS | None in v1 (file-based MDX) |
| Variants | Drop all 17 |
| Canonical nav | `beranda` nav + hamburger from `berita` + dark-mode classes from `berita` |

### 15.2. Tooling list

```
astro                       ^5
@astrojs/tailwind           ^5
@astrojs/mdx                ^4
@astrojs/sitemap            ^3
@astrojs/check              ^0.9
@tailwindcss/forms          ^0.5
@tailwindcss/container-queries ^0.1
tailwindcss                 ^3
typescript                  ^5

# (dev)
@playwright/test            ^1
pixelmatch                  ^7
sharp                       ^0.33
prettier                    ^3
prettier-plugin-astro       ^0.14
prettier-plugin-tailwindcss ^0.6
eslint                      ^9
eslint-plugin-astro         ^1
```

### 15.3. Commands

```bash
pnpm create astro@latest astro-bedalo -- --template minimal --typescript strict
cd astro-bedalo
pnpm add -D @astrojs/tailwind @astrojs/mdx @astrojs/sitemap @astrojs/check tailwindcss \
  @tailwindcss/forms @tailwindcss/container-queries
pnpm astro add tailwind mdx sitemap
# ... port tailwind.config.mjs, global.css, layouts, components ...
pnpm dev
pnpm build
pnpm test:visual
```

### 15.4. Why Astro is the right framework here (vs. alternatives)

- **Next.js**: overkill — we have zero JS interactivity. Next would ship runtime overhead we don't need.
- **Eleventy**: viable, but its content layer is less ergonomic than Astro Content Collections (no built-in Zod schemas, no typed `getCollection()`).
- **Hugo**: fast and great for content, but the templating is Go-template-only — far worse DX for a component-heavy port like this.
- **Plain Vite + custom build**: more flexible but we'd reinvent half of Astro's content collection + routing layer.

Astro hits the sweet spot: zero-JS-by-default static output, MDX, typed content collections, file-based routing, first-class Tailwind, and trivial deploy targets. It's a 1:1 fit for the problem.
