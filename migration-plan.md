# Migration Plan: 100% Mockup Parity

**Updated:** 2026-05-10
**Goal:** Bring `LutfiMuzaffar/astro-bedalo` to **100% structural and visual parity** with the 61 canonical pages of the Stitch mockup at `/home/ubuntu/site/stitch_dusun_bedalo_official_website/`.
**Companion doc:** `gap-analysis.md` (the per-page audit this plan resolves).
**Source of truth:** the source HTML/screenshots in `/home/ubuntu/site/...`. Every layout, section, component, and copy decision must match the source unless explicitly noted.
**Out of scope (separate phases):** real image migration from `lh3.googleusercontent.com`, Web3Forms backend wiring, Cloudflare Pages CI, Playwright visual regression harness — these are tracked as Phase H.

---

## 0. Working principles

These guardrails apply to every PR below. They exist because the gap analysis showed Phase 2 broke them.

1. **Source HTML is law.** For every page, before writing Astro: open the source `code.html`, list every section in order, list every component, then port. Do not freelance information architecture.
2. **No invented chrome.** Source rarely uses an eyebrow chip + breadcrumb + huge hero. Most pages just have a title + subtitle. Use `PageHero` only where the source actually shows one.
3. **Pixel parity per page, not per component.** A "reasonable" component used in the wrong layout still fails the bar. Compare the rendered Astro page side-by-side with `screen.png` at 1280px before declaring a page done.
4. **Slug names match source.** If source folder is `letak_geografis_dusun_bedalo` → route is `/profil/letak-geografis/`, not `/profil/geografi/`.
5. **Each PR is small enough to review.** Target: ≤25 files changed per PR, except the KKN structural rebuild (PR D) which is bigger by necessity.
6. **Per-page acceptance.** Each page must be confirmed against its `screen.png` before its row in the mapping table moves from ⚠/❌ to ✅. We track this in `gap-analysis.md` and update its status column with each PR.

---

## 1. Phase overview

The work splits into **8 phases (8 PRs)**, ordered so each builds on the previous and so the live preview improves visibly after every merge.

| Phase | PR title | Scope | LOC est. | Source pages it resolves |
|---|---|---|---:|---|
| **A** | `fix(content): repair cover image references and stats data` | Cross-cutting bug fixes (broken images, missing stats, wrong copy). | ~150 | Affects: `/`, `/berita/`, all card-using pages |
| **B** | `feat(components): port missing source-design components` | Add the 11 reusable components missing from Phase 2 (PhotoCollageHero, BentoGrid, MapIllustration, FilterChipBar variant, StatTrioCard, NakedHero, KelompokHeaderCard, AdminOpsTable, AdminBarChart, AdminDonutChart, SocialPlatformCard). No page rewrites yet. | ~800 | Foundation for B/C/D/E |
| **C** | `feat(profil): rebuild profil hub + add 4 missing sub-pages` | Rebuild `/profil/`, rename routes, add `/profil/tentang/`, `/profil/letak-geografis/`, `/profil/lokasi-peta/`, `/profil/sosial-budaya/`, `/profil/fasilitas/`. | ~600 | Source 2,3,4,5,6,7,8,9 |
| **D** | `feat(potensi): rebuild potensi hub + add 3 missing pillars` | Rebuild `/potensi/` with bento + chips + "Dari Ladang ke Laut", add `/potensi/peternakan/`, `/potensi/seni-budaya/`, `/potensi/pemuda/`, polish wisata/umkm/kuliner/pertanian/kerajinan layouts and detail templates. | ~900 | Source 10,11,17,20,21,22 (and polish 12-19) |
| **E** | `feat(kkn): introduce per-kelompok structure and add 8 missing pages` | New `kkn-kelompok` collection. New routes: `/kkn/arsip/`, `/kkn/kelompok/[slug]/{index,program-kerja,anggota,timeline,galeri,refleksi}`, `/kkn/galeri-kenangan/`, `/kkn/peta-kegiatan/`, `/kkn/tulisan/`, `/kkn/dokumentasi/`. Re-target `/kkn/` landing. Polish proker detail template. | ~1500 | Source 34-51, 54 (KKN cluster) |
| **F** | `feat(galeri,kontak,media): rebuild remaining hubs and add new sections` | Rebuild `/galeri/` (photo wall + chips), add `/galeri/foto/` & `/galeri/video/`, rebuild `/kontak/` (form-LEFT + map-RIGHT + Panduan Rute + WA + social bar), add `/media-sosial/`, add `/case-study/digitalisasi/`. | ~700 | Source 30, 32, 33, 53, 56, 60 |
| **G** | `feat(admin): build operational kontak dashboard and align other admin pages` | Replace `/admin/kontak/` placeholder with full operational view (stat cards, bar/donut charts, message table with badges, slide-in detail panel, quick reply templates, KPI footer). Decide fate of `/admin/{agenda-berita,potensi,galeri,kkn,pengaturan}` (keep, simplify, or remove since no source). | ~700 | Source 60, 61 |
| **H** | `chore: image migration, form backend, hosting, visual regression` | Bulk-migrate 240 `lh3.googleusercontent.com` images to `public/images/`. Wire Web3Forms env var. Add Cloudflare Pages config + GH Actions deploy. Add Playwright + pixelmatch visual regression at 1280/768/375. | ~400 | Cross-cutting; not in mockup but required for production |

Total estimated LOC: ~5750 across ~8 PRs over ~3.5 weeks of focused work.

---

## 2. Phase A — Cross-cutting fixes (`fix(content): repair cover images and stats`)

### Problems
1. **Broken card cover images** on `/` and `/berita/` (alt-text rendering on top of empty image area).
2. ~~**Missing 4th stat** on homepage StatsStrip (source has `1240+ Penduduk / 85 Ha / 4 Titik / 6 RT`; build has 3).~~ Retracted: source has **3** stats; current build is correct (re-verified `beranda_dusun_bedalo/code.html:192-224`).
3. **Wrong copy** on homepage hero (source eyebrow "EXPLORE GUNUNGKIDUL" vs build "EXPLORE GUNUNGKIDUL" — verify), several Indonesian copy strings to retest verbatim.
4. **`PageHero` overuse**: the eyebrow + breadcrumb pattern is added on pages where source just has a title.

### Tasks
- A1. Audit `src/lib/images.ts`. Print the export list. For every `cover:` value in `src/content/**/*.{md,mdx}`, confirm the import name resolves. List dangling references.
- A2. Repair the dangling references. Either fix the import name in frontmatter, or add the missing constant in `images.ts`.
- A3. Visit homepage in deployed preview. Capture each card cover. Confirm 0 broken-image fallbacks across `/`, `/berita/`, `/agenda/`, `/pengumuman/`, `/galeri/`, `/potensi/wisata/`, `/potensi/umkm/`, `/potensi/kuliner/`.
- A4. ~~Open `src/pages/index.astro` and add the missing 4th stat: `{ value: '6 RT', label: 'RUKUN TETANGGA', icon: 'cottage' }`.~~ **Skipped** — source has 3 stats; current build is correct.
- A5. Diff source homepage copy line-by-line against my homepage. Patch any diverging Indonesian strings (eyebrow, headlines, body, CTAs).
- A6. Introduce two `PublicLayout` hero patterns:
  - `<NakedHero title subtitle />` — for source pages with just title + subtitle (default).
  - `<PageHero eyebrow title description breadcrumbs />` — only where source actually shows it (rare; mostly profil/* and potensi/wisata/* sub-pages).
  Migrate every page to the pattern source uses. Most public pages will lose breadcrumbs and eyebrows.
- A7. Run `pnpm astro check` + `pnpm astro build`. Re-deploy preview. Manually verify `/`, `/berita/`, `/agenda-berita/` card visuals and stats row.

### Files touched
- `src/lib/images.ts`
- `src/content/{berita,agenda,pengumuman,wisata,umkm,kuliner,galeri-album,kkn-proker,kkn-album,kkn-anggota,kkn-tulisan,kkn-kenangan,pemerintahan,fasilitas}/*.{md,mdx}` (frontmatter `cover:` only)
- `src/pages/index.astro`
- `src/components/sections/PageHero.astro`
- New: `src/components/sections/NakedHero.astro`
- All `src/pages/**/*.astro` (replace eyebrow/breadcrumb usage with `NakedHero` where appropriate — ~25 files, mechanical edit)

### Acceptance
- `pnpm build` 0 errors.
- 0 broken `<img>` alt-text fallbacks in network tab on homepage and `/berita/`.
- Homepage stats row shows 4 items.
- `/profil/`, `/berita/`, `/agenda/`, `/pengumuman/`, `/galeri/`, `/kontak/`, `/kkn/` no longer show breadcrumb chip (per source).
- gap-analysis.md status column updated for resolved cross-cutting items.

---

## 3. Phase B — Component additions (`feat(components): port missing source-design components`)

The gap analysis flagged 11 source-design components that don't exist as Astro components. Building them in isolation first (with sample usage in a `src/pages/_design-check/` route excluded from sitemap) means PRs C–G can just compose them.

### New components

| # | Component | Source pages that use it | Brief |
|---:|---|---|---|
| 1 | `sections/PhotoCollageHero.astro` | `beranda_dusun_bedalo`, `profil_dusun_bedalo`, `potensi_dusun_dusun_bedalo` | 2-col hero with text+CTAs left and an asymmetric multi-photo collage right (rotated frames + floating overlay badge cards). Props: `eyebrow`, `title`, `titleHighlight`, `body`, `ctas[]`, `photos[]`, `overlayBadges[]`. |
| 2 | `sections/NakedHero.astro` | most public pages | Plain `<h1>` + paragraph subtitle, no chip, no breadcrumb. Already mentioned in Phase A. |
| 3 | `sections/StatTrioCard.astro` (or `.../StatGroupCard.astro`) | `kkn_di_dusun_bedalo_arsip_kenangan`, `case_study_digitalisasi_dusun_bedalo` | 3-card stat group with large number + label + optional icon. `case_study` variant uses gradient backgrounds with watermark icons. Props: `items[]`, `variant: 'plain'|'gradient'`. |
| 4 | `sections/BentoPotensiGrid.astro` | `potensi_dusun_dusun_bedalo` | 12-col bento: 1 large featured tile (col-span-8 row-span-2) + 1 medium (col-span-4 row-span-2) + 4 small icon tiles (col-span-3 each). Each tile: bg-image + gradient overlay + chip badge + title + body. Props: `featured`, `medium`, `small[]`. |
| 5 | `sections/FilterChipBar.astro` (replace existing `CategoryFilter`) | `berita_*`, `potensi_*`, `galeri_*`, `daftar_arsip_kkn`, etc. | Rounded-pill chip row with active state and optional count. Used in many places in source. Props: `items: { key, label, count?, href? }[]`, `active`, `variant: 'pill'|'underline'`. |
| 6 | `sections/MapIllustrationCard.astro` | `kontak_kami_dusun_bedalo`, `lokasi_peta_dusun_bedalo` | Stylized map image with location pin + caption overlay at bottom. Props: `mapImage`, `pinLabel`, `aspect`. |
| 7 | `sections/PanduanRuteCard.astro` | `kontak_kami_dusun_bedalo`, `lokasi_peta_dusun_bedalo` | "PANDUAN RUTE LOKASI" 4-button card. Props: `routes: { icon, label, href? }[]`. |
| 8 | `cards/KelompokCoverCard.astro` | `daftar_arsip_kkn_dusun_bedalo`, `detail_kelompok_*` | KKN kelompok cover card: photo + KLP-NN badge + universitas name + period + member/proker counts + Lihat Detail link. |
| 9 | `cards/KelompokHeaderCard.astro` | `detail_kelompok_*` | Big hero header with photo + 4-column meta strip (Lokasi, Periode, Anggota, Total Program). |
| 10 | `cards/SocialPlatformCard.astro` | `media_sosial_dusun_bedalo` | Square card with platform icon + handle + Follow button (filled or outline). |
| 11 | `admin/AdminStatCard.astro` | `admin_dashboard_kontak_aspirasi*` | Stat card with big number + label + delta indicator + icon bubble. |
| 12 | `admin/AdminBarChart.astro` | `admin_dashboard_kontak_aspirasi_operational_view` | Inline SVG bar chart with day labels. Static (no JS chart lib). |
| 13 | `admin/AdminDonutChart.astro` | same | Inline SVG donut with center % label and legend. |
| 14 | `admin/AdminMessageTable.astro` | both admin variants | Table with checkbox col, Tanggal, Nama, Kategori chip, Subjek, Prioritas chip, Status chip, Aksi (eye icon). Pagination footer. |
| 15 | `admin/AdminDetailPanel.astro` | operational view | Slide-in detail panel: avatar + name + email + chips + body + Catatan Internal + Log Aktivitas + Quick Response Templates + reply textarea. |
| 16 | `admin/AdminKpiFooterCards.astro` | operational view | Footer KPI row: Avg Response Time, Kategori Populer, Isu Mendesak. |

### Tasks
- B1. For each component, port the source HTML structure verbatim from `code.html`, parameterize content via props.
- B2. Build a `src/pages/_design-check/index.astro` route (set `noIndex` and exclude from sitemap) that renders one example of each component, so we can visually QA components in isolation before composing them into pages.
- B3. Delete `_design-check` route at end of PR (or convert to `astro:dev` only).

### Files touched
- 16 new component files under `src/components/{sections,cards,admin}/`
- 1 throwaway `src/pages/_design-check/index.astro`
- 1 update to `src/components/sections/CategoryFilter.astro` → renamed/replaced by `FilterChipBar.astro`

### Acceptance
- All 16 components render at `/_design-check/` matching source visuals.
- `pnpm astro check` + build 0 errors.

---

## 4. Phase C — Profil section rebuild (`feat(profil): rebuild profil hub + add 4 missing sub-pages`)

### Source IA (target)

| Source folder | Target route | Layout summary |
|---|---|---|
| `profil_dusun_bedalo` | `/profil/` | `PhotoCollageHero` (text + 1 hero photo + "Sejak 1900-an" floating badge) → centered "Eksplorasi Profil" h2 + subtitle → 6-card hub grid (3 cols on lg, 2 on md, 1 on sm). Each card: small icon disc + title + body. |
| `tentang_dusun_dusun_bedalo` | `/profil/tentang/` | Naked hero → editorial 2-col: long-form sejarah/visi-misi (left, MDX content) + photo column (right). Could include a `Sekilas` stat strip. |
| `letak_geografis_dusun_bedalo` | `/profil/letak-geografis/` | Naked hero → 2-col with map illustration + facts/coords + topografi description + neighbor list. |
| `demografi_dusun_bedalo_dusun_bedalo` | `/profil/demografi/` | Naked hero → "Komposisi Penduduk" stats grid (gender, usia, mata pencaharian) + chart cards (static SVG). |
| `pemerintahan_dusun_dusun_bedalo` | `/profil/pemerintahan/` | Naked hero → "Struktur Aparat Dusun" PersonCard grid + "Kontak Pemerintahan" card. |
| `fasilitas_umum_dusun_bedalo` | `/profil/fasilitas/` | Naked hero → FilterChipBar (Pendidikan, Kesehatan, Ibadah, Olahraga, Pemerintahan, Lainnya) → FasilitasCard grid. |
| `sosial_agama_dan_budaya_dusun_bedalo` | `/profil/sosial-budaya/` | Naked hero → editorial sections (Agama, Tradisi, Kesenian, Bahasa) with photo + body each. |
| `lokasi_peta_dusun_bedalo` | `/profil/lokasi-peta/` | Naked hero → big `MapIllustrationCard` → "Rute Destinasi" 3-card row (Dusun Bedalo / Pantai Ngedan / Pantai Butuh) → "Info Kondisi Jalan" warning callout → "Tips Perjalanan" left + "Titik Layanan Terdekat" right (SPBU, Puskesmas, Minimarket, ATM). |

### Tasks
- C1. Delete `src/pages/profil/sejarah.astro` and `src/pages/profil/geografi.astro` (rename to source-correct slugs).
- C2. Create `src/pages/profil/tentang.astro`, `letak-geografis.astro`, `lokasi-peta.astro`, `sosial-budaya.astro`, `fasilitas.astro`.
- C3. Rewrite `src/pages/profil/index.astro` as the 6-card hub. Remove the StatsStrip and the inlined PersonCard/FasilitasCard grids.
- C4. Update `pemerintahan.astro` and `demografi.astro` to source layouts (drop `PageHero`, use `NakedHero`, match section ordering).
- C5. Add `src/lib/images.ts` constants for any new map/illustration images (placeholders for now; real assets land in Phase H).
- C6. Side-by-side QA each page against source `screen.png`.
- C7. Update `TopNav` profil dropdown if applicable to expose all 6 sub-pages.

### Acceptance
- All 8 profil pages built and visually match source.
- 6-card hub on `/profil/` links to all 6 sub-pages.
- gap-analysis.md statuses for source rows 2–9 → ✅.

---

## 5. Phase D — Potensi section rebuild (`feat(potensi): rebuild potensi hub + add 3 missing pillars + polish details`)

### Source IA (target)

| Source folder | Target route | Layout summary |
|---|---|---|
| `potensi_dusun_dusun_bedalo` | `/potensi/` | `PhotoCollageHero` (3-photo collage) → `FilterChipBar` (Semua / Wisata Alam / UMKM / Pertanian / Peternakan / Kuliner / Seni Budaya / Pemuda) → `BentoPotensiGrid` (1 large Wisata + 1 medium UMKM + 4 small icon tiles) → "Dari Ladang ke Laut" 2-col conceptual block (Hulu Agraris + Hilir Bahari). |
| `wisata_alam_dusun_bedalo` | `/potensi/wisata/` | Naked hero → FilterChipBar (Pantai / Karst / Geowisata) → WisataCard grid. |
| `pantai_*` (4 pages) | `/potensi/wisata/[slug]/` | Hero photo full-bleed + title overlay → 2-col body: left long-form description + facilities checklist; right "Info Kunjungan" sidebar with operasional / parkir / fasilitas + "Rute" mini-map → "Galeri Pantai" 4-photo row → "Wisata Lainnya" 3-card row. |
| `umkm_lokal_dusun_bedalo` | `/potensi/umkm/` | Naked hero → FilterChipBar (Kerajinan / Kuliner / Fashion / Jasa) → UmkmCard grid + "Daftar UMKM Anda" CTA card. |
| `detail_umkm_dusun_bedalo` | `/potensi/umkm/[slug]/` | 2-col: left hero photo + product photo grid + description + cerita-pemilik; right sidebar with profile card (avatar, kategori, daerah, jam) + "Hubungi Penjual" buttons (WA, Tokopedia, Shopee, Marketplace) + harga range. Below: "Produk Unggulan" 3-card + "Produk Lainnya". |
| `kuliner_lokal_bedalo` | `/potensi/kuliner/` | Naked hero → FilterChipBar (Makanan Pokok, Camilan, Minuman, Khas Pesisir) → KulinerCard grid (square aspect, recipe-card style). |
| `pertanian_dan_perkebunan_dusun_bedalo` | `/potensi/pertanian/` | Naked hero → "Komoditas Unggulan" 4-tile grid → "Kalender Tanam" timeline → photo strip → "Profil Petani" PersonCard row. |
| `peternakan_dusun_bedalo` | `/potensi/peternakan/` (NEW) | Naked hero → "Sentra Ternak" 3-tile grid (kambing, sapi, ayam, ikan) → "Kelompok Ternak" PersonCard row → photo strip. |
| `seni_dan_budaya_dusun_bedalo` | `/potensi/seni-budaya/` (NEW) | Naked hero → editorial blocks (Karawitan, Reog/Jathilan, Wayang, Seni Pesisir) with photo + body + "Tonton Video" CTA per block → kalender event mini. |
| `karang_taruna_dan_pemuda_dusun_bedalo` | `/potensi/pemuda/` (NEW) | Naked hero → "Visi Pemuda" stat trio → "Program Unggulan" 3-tile grid → PersonCard row of pengurus → "Bergabung" CTA card. |

### Tasks
- D1. Add 3 new content collections (or extend existing): `peternakan` items, `seni-budaya` items, `karang-taruna` items. Define minimal Zod schemas. Seed 3 sample entries each.
- D2. Rewrite `src/pages/potensi/index.astro` to use `PhotoCollageHero` + `FilterChipBar` + `BentoPotensiGrid` + `LadangKeLaut.astro` (new section component).
- D3. Rewrite each potensi sub-list (`wisata/index.astro`, `umkm/index.astro`, `kuliner/index.astro`, `pertanian.astro`, `kerajinan.astro`) using `NakedHero` + `FilterChipBar` per source.
- D4. Rewrite each potensi detail template (`wisata/[slug].astro`, `umkm/[slug].astro`, `kuliner/[slug].astro`) per source layouts.
- D5. Add 3 new pages: `peternakan.astro`, `seni-budaya.astro`, `pemuda.astro`.
- D6. Side-by-side QA per page.

### Acceptance
- 14 potensi-related pages built (1 hub + 5 sub-categories + 4 wisata details + UMKM/kuliner detail templates + 3 new pillars), all visually faithful.
- gap-analysis.md statuses for source rows 10–22 → ✅.

---

## 6. Phase E — KKN structural rebuild (`feat(kkn): per-kelompok structure + 8 missing pages`)

This is the **biggest PR**. The current build models KKN as a flat global list (`/kkn/program-kerja/`, `/kkn/anggota/`, `/kkn/refleksi/`). The source models it as a per-kelompok archive: each KKN group (e.g. Kelompok 129 from UIN Sunan Kalijaga, Angkatan 117) has its own profile, proker list, anggota, timeline, gallery, and reflections.

### Schema changes (new + modified collections)

```ts
// src/content/config.ts (additions)

const kknKelompok = defineCollection({
  type: 'content', // MDX for narrative profile
  schema: z.object({
    kode: z.string(),                   // "KLP 129"
    namaProgram: z.string(),            // "KKN Reguler Angkatan 117 UIN Sunan Kalijaga"
    universitas: z.string(),            // "UIN Sunan Kalijaga Yogyakarta"
    angkatan: z.string().optional(),    // "Angkatan 117"
    semester: z.string(),               // "Semester Gasal 2023/2024"
    periode: z.object({ start: z.date(), end: z.date() }),
    lokasi: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    anggotaCount: z.number(),
    prokerCount: z.number(),
    tema: z.array(z.string()).default([]),
  }),
});

// Existing kknProker, kknAnggota, kknTulisan, kknKenangan get a new required field:
kelompok: z.string(), // references slug of a kkn-kelompok entry, e.g. "kelompok-129"

// New collections:
const kknTimeline = defineCollection({
  type: 'data', // JSON: array of milestones per kelompok
  schema: z.object({
    kelompok: z.string(),
    items: z.array(z.object({
      date: z.date(),
      title: z.string(),
      body: z.string(),
      icon: z.string().optional(),
    })),
  }),
});
const kknDokumentasi = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    kelompok: z.string().optional(),
    type: z.enum(['laporan','foto','video','presentasi','spreadsheet']),
    fileUrl: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

### Routes (target)

| Source folder | Target route | Layout |
|---|---|---|
| `kkn_di_dusun_bedalo_arsip_kenangan` | `/kkn/` | Naked hero (overlay text on full-bleed photo, eyebrow "ARSIP KHUSUS") → `StatTrioCard` (24 Total Kelompok / 10+ Tahun / 150+ Proker) → big "Punya Kenangan?" CTA panel with "Kirim Dokumentasi KKN" button. |
| `daftar_arsip_kkn_dusun_bedalo` | `/kkn/arsip/` | Naked hero → 4-column filter row (Tahun / Universitas / Tema / Kategori Program) + Terapkan button → "Tahun YYYY" headers + KelompokCoverCard grid grouped by year. |
| `detail_kelompok_129_kkn_uin_suka_117` | `/kkn/kelompok/[slug]/` | `KelompokHeaderCard` (full-bleed cover + title + 4-meta strip) → 4-card sub-nav (Program Kerja / Anggota / Timeline / Refleksi / Galeri / Dokumentasi) → "Program Kerja Unggulan" 3 cards → "Anggota Tim" PersonCard row → CTA. |
| `program_kerja_kkn_kelompok_129` | `/kkn/kelompok/[slug]/program-kerja/` | Per-kelompok header + FilterChipBar by kategori + KknProkerCard grid. |
| `detail_proker_*` (3 sample pages) | `/kkn/kelompok/[slug]/program-kerja/[proker]/` | Hero photo + breadcrumb (Home > KKN > Kelompok 129 > Program Kerja > Pelatihan...) + category chip + title → 2-col: left "Tujuan" + "Latar Belakang"; right "Ringkasan Program" sidebar (Tanggal / Sasaran / PJ / Anggaran + "Unduh Laporan Lengkap" button) → "Cerita Pelaksanaan" body → "Galeri Kegiatan" 3-photo row → "Hasil & Dampak" checkmark list → "Tantangan & Rekomendasi" → "Program Kerja Lainnya" 3-card carousel. |
| `anggota_kkn_kelompok_129` | `/kkn/kelompok/[slug]/anggota/` | Per-kelompok header + grid of PersonCards with kampus + jurusan badges per anggota. |
| `timeline_kkn_kelompok_129` | `/kkn/kelompok/[slug]/timeline/` | Per-kelompok header + vertical timeline component with date + title + body per milestone. |
| `galeri_kegiatan_kkn_kelompok_129` | `/kkn/kelompok/[slug]/galeri/` | Per-kelompok header + GaleriAlbumCard grid scoped to kelompok. |
| `detail_album_kkn_template` | `/kkn/kelompok/[slug]/galeri/[album]/` | Album header + masonry photo wall + lightbox-on-click (no JS — anchor links to `<dialog>` with checkbox toggle, or just larger photo). |
| `refleksi_kkn_kelompok_129` | `/kkn/kelompok/[slug]/refleksi/` | Per-kelompok header + reflection cards with author. |
| `arsip_tulisan_kkn_dusun_bedalo` | `/kkn/tulisan/` | Naked hero + FilterChipBar by tema + tulisan card grid. |
| `dinding_kenangan_kkn` | `/kkn/dinding-kenangan/` | (✅ already faithful — verify only) |
| `galeri_kenangan_kkn_dusun_bedalo` | `/kkn/galeri-kenangan/` | Naked hero + masonry photo wall (KKN-tagged photos across all kelompok). |
| `peta_kegiatan_kkn_bedalo` | `/kkn/peta-kegiatan/` | 2-col: left filter card (Tahun + Kelompok + Kategori checkboxes + Legenda Lokasi); right Google Maps embed (`<iframe src="https://www.google.com/maps/embed?...">`) showing markers. **Static iframe** with pre-encoded markers; no JS. |
| `arsip_dokumentasi_kegiatan` | `/kkn/dokumentasi/` | Naked hero + FilterChipBar by type + 2-col list of document cards (icon by type + title + meta + Unduh button). |
| `case_study_digitalisasi_dusun_bedalo` | `/kkn/case-study/digitalisasi/` (or `/case-study/digitalisasi/`) | Editorial long-form: SPECIAL INITIATIVE chip + title with primary highlight + body + "EXECUTED BY KKN Kelompok 129" attribution → `StatTrioCard` (variant=gradient, "15+ UMKM Registered / 4 Beaches Documented / 1 Official Website Launch") → "The Challenge Before Digitalization" 2-col (text + photo) with checkmark anti-list → continue with "The Solution" / "The Outcome" / "What's Next" sections. |

### Tasks
- E1. Add `kkn-kelompok` collection, seed 2 sample entries (`kelompok-129-uin-suka.mdx`, `kelompok-102-ugm.mdx`).
- E2. Add `kelompok` foreign-key field to existing `kkn-proker`, `kkn-anggota`, `kkn-tulisan`, `kkn-kenangan` schemas. Migrate existing seed entries to include this field (assign to kelompok-129 by default).
- E3. Add `kkn-timeline` data collection.
- E4. Add `kkn-dokumentasi` data collection.
- E5. Re-target `src/pages/kkn/index.astro` to source's "Arsip Kenangan" landing.
- E6. Build new routes:
  - `src/pages/kkn/arsip/index.astro`
  - `src/pages/kkn/kelompok/[slug]/index.astro`
  - `src/pages/kkn/kelompok/[slug]/program-kerja/index.astro`
  - `src/pages/kkn/kelompok/[slug]/program-kerja/[proker].astro`
  - `src/pages/kkn/kelompok/[slug]/anggota.astro`
  - `src/pages/kkn/kelompok/[slug]/timeline.astro`
  - `src/pages/kkn/kelompok/[slug]/refleksi/index.astro`
  - `src/pages/kkn/kelompok/[slug]/galeri/index.astro`
  - `src/pages/kkn/kelompok/[slug]/galeri/[album].astro`
  - `src/pages/kkn/galeri-kenangan.astro`
  - `src/pages/kkn/peta-kegiatan.astro`
  - `src/pages/kkn/tulisan/index.astro` (+ optional `[slug].astro`)
  - `src/pages/kkn/dokumentasi.astro`
  - `src/pages/kkn/case-study/digitalisasi.astro`
- E7. Delete (or redirect to per-kelompok) the existing flat global routes `src/pages/kkn/{anggota,refleksi,program-kerja}/*`. Set up redirects in `astro.config.mjs` (`redirects: { '/kkn/program-kerja': '/kkn/arsip' }` etc.) to preserve any external links.
- E8. Polish proker detail template per source (Hasil & Dampak, Tantangan & Rekomendasi, Program Kerja Lainnya).
- E9. Side-by-side QA each page against source.

### Acceptance
- 17+ KKN routes generated.
- Per-kelompok navigation works end-to-end (`/kkn/arsip/` → kelompok detail → its sub-pages).
- gap-analysis.md statuses for source rows 34–55 → ✅.

---

## 7. Phase F — Galeri, Kontak, Media Sosial (`feat(galeri,kontak,media): rebuild remaining hubs`)

### Routes

| Source | Target | Layout |
|---|---|---|
| `galeri_dusun_bedalo` | `/galeri/` | Naked hero → `FilterChipBar` (Semua / Wisata Alam / Kegiatan Warga / Seni Budaya / Pembangunan) → masonry photo wall (mixed aspects). |
| (new) | `/galeri/foto/` | Album list (current `/galeri/` content moves here). |
| `galeri_video_dusun_bedalo` | `/galeri/video/` | Naked hero → FilterChipBar by playlist → grid of 16:9 video cards (poster + play icon overlay + title + duration). Click → `/galeri/video/[slug]/` with embedded YouTube iframe. |
| `detail_album_galeri_dusun_bedalo` | `/galeri/[slug]/` | (✅ already exists; verify) |
| `kontak_kami_dusun_bedalo` | `/kontak/` | Naked hero ("Hubungi Kami" + subtitle) → 2-col: **left** form card (`Web3FormsBase` + Nama / WA-or-Email / Subjek-select / Pesan-textarea / Kirim button); **right** stacked: `MapIllustrationCard` (Balai Dusun Bedalo pin) + `PanduanRuteCard` (Dusun Bedalo / Pantai Ngedan / Balai Padukuhan / Sentra UMKM) + green "WhatsApp Kami" CTA + small mail icon button + "MEDIA SOSIAL RESMI" 3-icon row. |
| `kirim_pesan_dusun_bedalo` | `/kirim-pesan/` | Polish to match source: bigger form, info panel sidebar, FAQ accordion. |
| `kirim_dokumentasi_kkn` | `/kirim-dokumentasi/` | Polish to match source: file upload field, kelompok select, narrative textarea. |
| `media_sosial_dusun_bedalo` | `/media-sosial/` (NEW) | Naked hero → `SocialPlatformCard` 6-grid (Instagram/YouTube/TikTok/Facebook/WhatsApp/Email — each with icon, handle, primary CTA) → "Postingan Terbaru" horizontal scroll with platform-tagged thumbnails (Instagram/YouTube/Facebook/TikTok) → "Panduan Komunitas" rounded info card. |
| `case_study_digitalisasi_dusun_bedalo` | (already covered in Phase E) | — |

### Tasks
- F1. Move current album-list `/galeri/` to `/galeri/foto/`. Rebuild `/galeri/` as masonry photo wall sourced from across all `galeri-album` photo arrays.
- F2. Add `galeri-video` collection (or extend existing schema with a `kind: 'foto'|'video'` enum + `videoUrl`). Seed 3 sample entries.
- F3. Build `/galeri/video/index.astro` and `/galeri/video/[slug].astro`.
- F4. Rewrite `src/pages/kontak.astro` with form-LEFT + map-RIGHT layout.
- F5. Polish `src/pages/kirim-pesan.astro` and `src/pages/kirim-dokumentasi.astro`.
- F6. Build `/media-sosial/` page with `SocialPlatformCard` grid.
- F7. Update `Footer.astro` and `TopNav` "Hubungi Kami" CTA / `MobileBottomNav` to point to the right routes.
- F8. Side-by-side QA.

### Acceptance
- 7 routes (re)built or added: `/galeri/`, `/galeri/foto/`, `/galeri/video/`, `/galeri/video/[slug]/`, `/kontak/`, `/kirim-pesan/`, `/kirim-dokumentasi/`, `/media-sosial/`.
- gap-analysis.md statuses for source rows 30, 32, 33, 53–56 → ✅.

---

## 8. Phase G — Admin operational view (`feat(admin): operational kontak dashboard`)

### Source IA

The two source admin pages (`admin_dashboard_kontak_aspirasi` and `admin_dashboard_kontak_aspirasi_operational_view`) are clearly the **simple variant + operational variant** of the same page. The operational variant adds: bar chart, donut chart, filter row, message detail panel, KPI footer cards. We should target the **operational variant** as the primary `/admin/kontak/` page, with the simpler variant as a fallback for narrow viewports if needed.

### Tasks
- G1. Replace `src/pages/admin/kontak.astro` placeholder with full operational view:
  - Top bar: search + bell + Export
  - Title + subtitle "Kontak & Aspirasi"
  - 3 `AdminStatCard` row (Total Pesan 1284, Belum Dibaca 42, Dalam Proses 15)
  - 2-col: `AdminBarChart` (Tren Aspirasi 7 Hari) + `AdminDonutChart` (Kategori Aspirasi)
  - "Daftar Pesan & Aspirasi" `AdminMessageTable` with filters + pagination
  - Right `AdminDetailPanel` slide-in (CSS-only via `:target` or always-shown on lg+)
  - 3 `AdminKpiFooterCards` (Avg Response Time / Kategori Populer / Isu Mendesak)
- G2. Build mock pesan data file `src/lib/mockAdminPesan.ts` with 50 rows so the table looks realistic.
- G3. Decide fate of `src/pages/admin/{agenda-berita,potensi,galeri,kkn,pengaturan,index}.astro`:
  - Option A: keep as scaffolds — use the same admin shell and place a "Coming Soon" card with a list of features. Low effort.
  - Option B: remove them since no source mockup exists; redirect `/admin/*` to `/admin/kontak/`. Lowest LOC.
  - Option C: design and build them ourselves to match the admin shell. High effort, no source reference.
  - **Recommended: B** unless user objects.
- G4. Side-by-side QA against operational view screenshot.

### Acceptance
- `/admin/kontak/` matches `admin_dashboard_kontak_aspirasi_operational_view/screen.png`.
- Table renders 1248 mock rows (paginated, page-1 visible by default).
- gap-analysis.md statuses for source rows 60–61 → ✅.

---

## 9. Phase H — Production readiness (`chore: image migration, form backend, hosting, visual regression`)

These items don't affect mockup parity but are required for production. Each can be its own sub-PR.

### H1. Image migration (the biggest visual upgrade after layout)
- Walk every source `code.html` file with a grep for `lh3.googleusercontent.com`. Collect ~240 unique URLs.
- Download all of them with their original aspect (some are landscape, some portrait, some square). Store as `public/images/source/<sha>.{webp,jpg}`.
- Build a mapping table `src/lib/sourceImages.ts` that maps a slug or path key → source image URL.
- For every content frontmatter `cover:` / inline image reference, swap from Unsplash placeholder to the matching source image.
- Use Astro's `<Image>` (after switching `images.ts` from string URLs to `import` statements + `Image` component) for built-in optimization where viable. (Tradeoff: keeping `<img>` keeps Tailwind CDN parity; mixing Image may need `fetchpriority` polishing. Decide per-page during this phase.)

### H2. Form backend (Web3Forms)
- Decide: continue with Web3Forms or switch to Formspree, Resend, or a self-hosted endpoint.
- Add `PUBLIC_WEB3FORMS_KEY` env var. User to provide. Validate locally.
- Wire `Web3FormsBase.astro` to use `import.meta.env.PUBLIC_WEB3FORMS_KEY`.
- Test form submission end-to-end on `/kontak/`, `/kirim-pesan/`, `/kirim-dokumentasi/`, `/profil/pemerintahan/` (if it has a contact form).

### H3. Hosting (Cloudflare Pages)
- Add `wrangler.toml` for Cloudflare Pages.
- Add `.github/workflows/deploy.yml` to build + push to Cloudflare on every push to `main` and to deploy a preview on every PR.
- Configure custom domain (if user has one) or Pages subdomain.
- Verify trailing-slash behavior matches Astro's output (`build.format: 'directory'`).

### H4. Visual regression harness
- Install Playwright + pixelmatch.
- Add `tests/visual/` with one spec per source page that:
  1. Navigates to the local Astro preview.
  2. Takes a full-page screenshot at viewports 1280/768/375.
  3. Compares to the source `screen.png` resized to the same width.
  4. Fails if pixel diff > 0.5%.
- Add `pnpm test:visual` script.
- Add the test step to GH Actions so PRs that drift from source are flagged in CI.

### H5. Sitemap, SEO, and a11y
- Generate sitemap with `@astrojs/sitemap` (already present — verify).
- Add `robots.txt`.
- Add per-page `<title>`, `<meta name="description">`, OpenGraph tags (verify `BaseLayout` wires these through).
- Run Lighthouse on key pages, aim 90+ on Performance / Accessibility / SEO.

### Acceptance
- 0 Unsplash placeholder URLs in deployed build.
- Form submissions deliver to user's email.
- Cloudflare Pages preview deploys per PR.
- `pnpm test:visual` CI step gates merges.
- Lighthouse scores ≥90 on `/`, `/profil/`, `/potensi/`, `/berita/`, `/kkn/`, `/kontak/`.

---

## 10. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:-:|:-:|---|
| Source images expire from `lh3.googleusercontent.com` before Phase H | Medium | High | Bulk-download all 240 URLs as the **first** action of Phase A (parallel to other A work), checked into `public/images/source/` immediately. |
| KKN per-kelompok rebuild (Phase E) breaks existing seed content | Medium | Medium | Migrate seed data in same PR. Add a Vitest content-loading test that asserts every `kkn-proker` entry has a valid `kelompok` foreign key before merge. |
| Slug renames (Phase C) break external bookmarks | Low | Low | Add `redirects: { '/profil/sejarah': '/profil/tentang' }` in `astro.config.mjs` to keep any bookmarks alive. |
| Admin operational view is heavy without a chart lib | Low | Medium | Use static inline SVG for bar/donut charts (no chart.js needed). Source mockup is static anyway. |
| Web3Forms 250-submission monthly free-tier limit | Low | Low | Have a fallback to mailto: link if form fails. Document the limit. |
| User wants a different IA than source on some page | Low | Medium | Plan defers IA decisions to user explicit approval before each page. Default = source. |

---

## 11. Acceptance criteria (whole project)

The migration is "done" when all of these are true:

- [ ] gap-analysis.md mapping table shows ✅ on all 58 non-variant source rows.
- [ ] Every page renders without console errors at 1280/768/375.
- [ ] Every public page loads in < 1.5s on 4G (Lighthouse mobile).
- [ ] `pnpm build` reports 0 type errors and 0 broken links.
- [ ] `pnpm test:visual` passes against every source `screen.png` with ≤0.5% pixel diff.
- [ ] Form submissions deliver end-to-end.
- [ ] Sitemap covers every public route.
- [ ] No `lh3.googleusercontent.com` URL remains in deployed output (all images self-hosted).
- [ ] `gap-analysis.md` final status footer reads "100% migrated, 0 outstanding ⚠ or ❌".

---

## 12. Sequencing & parallelism

- **Strict dependency:** A → B → C/D/E (in any order, parallel-able) → F → G → H.
- **Parallelism opportunity:** Within Phase E (KKN), the per-kelompok routes can be split across two devs (or two child sessions) by route family.
- **User-blocking checkpoints:**
  1. Before Phase B: confirm component design choices (e.g. PhotoCollageHero proportions, BentoPotensiGrid spans).
  2. Before Phase E: confirm the per-kelompok IA (this is the biggest IA change).
  3. Before Phase G option A vs B: decide whether to build the other 5 admin pages from scratch.
  4. Before Phase H: provide `PUBLIC_WEB3FORMS_KEY` (or pick alternate form backend), and provide hosting credentials if not Cloudflare Pages free tier.

---

## 13. Where this plan deviates from the original `plan.md` (Phase 1 research)

- The original plan assumed that pixel-parity could be achieved by porting Tailwind CDN config + replicating section markup verbatim. **This was correct in principle, wrong in execution.** The build skipped per-page side-by-side QA, which is the only way to enforce parity.
- The original plan listed components but did not call out the asymmetric photo collage, bento grid, or admin charts. **These are the components that, once added, will fix the majority of "looks nothing like the mockup" complaints.**
- The original plan's content-collection design assumed flat KKN data. Source actually models per-kelompok hierarchy. **Phase E corrects this with a schema migration.**

---

## 14. What I need from the user before starting

1. **Confirm the 8-phase order** (A → B → C/D/E → F → G → H), or specify a different order. Easy default: "go in order; one PR at a time."
2. **Confirm slug renames** are OK (`/profil/sejarah` → `/profil/tentang`, etc.). I'll add redirects for the old slugs.
3. **Confirm KKN per-kelompok IA** before Phase E starts.
4. **Phase G option A/B/C** decision (admin pages with no source: keep / remove / build).
5. **Phase H prerequisites:**
   - `PUBLIC_WEB3FORMS_KEY` (or alternative form backend choice + creds).
   - Hosting target (Cloudflare Pages assumed).
   - Custom domain (if any).
6. **Image rights:** confirm we're OK to host the 240 `lh3.googleusercontent.com` source images as `public/images/...` long-term, or whether the user has a different image set to migrate to.

I will not start any code changes until you give the go-ahead on at least item 1.
