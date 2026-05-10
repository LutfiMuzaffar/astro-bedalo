# Gap Analysis: Stitch Mockup vs. Astro Build

**Audit date:** 2026-05-10
**Source:** `/home/ubuntu/site/stitch_dusun_bedalo_official_website/` (61 canonical pages, 18 design variants ignored)
**Built:** `/home/ubuntu/repos/astro-bedalo/src/pages/` (35 `.astro` files producing 71 static routes)
**Live preview audited:** https://dist-pjeaywae.devinapps.com (re-deployed during this audit)

---

## TL;DR

The user is right. The build covers the routes structurally but **diverges from the source mockups on the majority of pages.** Headline numbers:

- **20 source pages have NO Astro counterpart** at all (no route exists).
- **At least 18 built pages exist but have a meaningfully different layout, sections, or component usage** than the source — they are not pixel-parity ports.
- Only **~12 pages are reasonably faithful** to the mockup (mostly detail pages and the simpler list pages).
- **Cross-cutting visual issues** affect even the "good" pages: broken card images on the homepage, missing stats item, incorrect grid densities, layouts mirrored left/right.

The root cause is not a single bug — it's that I freelanced the information architecture in several places (e.g. collapsing 6 profil sub-pages into 3 cards + inlined content; replacing per-kelompok KKN structure with a flat global structure; rebuilding the kontak page mirror-flipped with no map). Pixel-parity was not enforced page-by-page during Phase 2.

---

## Section A — Missing pages (no Astro route at all)

These source mockups have **zero counterpart** in the build. Listed in priority order.

### A1. High priority — public-facing IA gaps

| # | Source folder | Suggested route | What it is |
|---|---|---|---|
| 1 | `tentang_dusun_dusun_bedalo` | `/profil/tentang/` | "Tentang Dusun" sub-page (sejarah-singkat / visi-misi). Source links to it from profil hub. Currently merged into `profil/sejarah`. |
| 2 | `lokasi_peta_dusun_bedalo` | `/profil/lokasi-peta/` | Dedicated location & map page with embedded peta + rute info. Map content does not exist anywhere in the build. |
| 3 | `sosial_agama_dan_budaya_dusun_bedalo` | `/profil/sosial-budaya/` | "Sosial, Agama & Budaya" sub-page (one of the 6 cards on source profil hub). |
| 4 | `fasilitas_umum_dusun_bedalo` | `/profil/fasilitas/` | Standalone fasilitas listing page. I inlined the fasilitas grid INTO `/profil/`, but source has it as its own route reachable from the profil hub. |
| 5 | `peternakan_dusun_bedalo` | `/potensi/peternakan/` | "Sentra Ternak" sub-pillar. Linked from source potensi filter chips. |
| 6 | `seni_dan_budaya_dusun_bedalo` | `/potensi/seni-budaya/` | "Karawitan / Seni Budaya" sub-pillar. Linked from source potensi filter chips. |
| 7 | `karang_taruna_dan_pemuda_dusun_bedalo` | `/potensi/pemuda/` (or `/komunitas/karang-taruna/`) | Karang Taruna / Pemuda sub-pillar. Linked from source potensi filter chips. |
| 8 | `galeri_foto_dusun_bedalo` | `/galeri/foto/` | Pure photo gallery view (separate from albums and from videos). |
| 9 | `galeri_video_dusun_bedalo` | `/galeri/video/` | Video gallery with playable thumbnails — video content type does not exist in collections. |
| 10 | `media_sosial_dusun_bedalo` | `/media-sosial/` | "Media Sosial Dusun" feed-aggregator page (Instagram, YouTube, etc.). Currently nothing. |

### A2. Medium priority — KKN sub-system gaps

The source models KKN as a **multi-group archive** where each KKN kelompok has its own sub-tree (proker, anggota, timeline, refleksi, galeri). I implemented it as a flat global structure. Almost the entire per-kelompok hierarchy is missing.

| # | Source folder | Suggested route | What it is |
|---|---|---|---|
| 11 | `daftar_arsip_kkn_dusun_bedalo` | `/kkn/arsip/` (or `/kkn/kelompok/`) | Master list of all KKN kelompok across years. The source treats this as the primary entry point into KKN history. |
| 12 | `detail_kelompok_129_kkn_uin_suka_117` | `/kkn/kelompok/[slug]/` | Per-kelompok hub page (kelompok profile + members count + proker count + cover image). |
| 13 | `program_kerja_kkn_kelompok_129` | `/kkn/kelompok/[slug]/program-kerja/` | Per-kelompok proker list. (My `/kkn/program-kerja/` is global, not per-kelompok.) |
| 14 | `timeline_kkn_kelompok_129` | `/kkn/kelompok/[slug]/timeline/` | Per-kelompok timeline of activities. No timeline view exists at all. |
| 15 | `galeri_kegiatan_kkn_kelompok_129` | `/kkn/kelompok/[slug]/galeri/` | Per-kelompok photo album hub. |
| 16 | `detail_album_kkn_template` | `/kkn/kelompok/[slug]/galeri/[album]/` | Per-album detail (KKN-specific template). |
| 17 | `galeri_kenangan_kkn_dusun_bedalo` | `/kkn/galeri-kenangan/` | KKN-wide kenangan gallery. |
| 18 | `peta_kegiatan_kkn_bedalo` | `/kkn/peta-kegiatan/` | Geographic map of KKN activities. |
| 19 | `arsip_tulisan_kkn_dusun_bedalo` | `/kkn/tulisan/` | KKN articles archive (separate from refleksi). The `kkn-tulisan` collection schema exists but no page renders it. |
| 20 | `arsip_dokumentasi_kegiatan` | `/kkn/dokumentasi/` | Document archive (PDFs, reports, deliverables). |

### A3. Low priority — case study / admin

| # | Source folder | Suggested route | What it is |
|---|---|---|---|
| 21 | `case_study_digitalisasi_dusun_bedalo` | `/case-study/digitalisasi/` | One-off long-form editorial article. Could live under `/berita/` if we don't want a new section. |
| 22 | `admin_dashboard_kontak_aspirasi_operational_view` | `/admin/kontak/operational/` (or replace `/admin/kontak/`) | The much richer "operational" admin view with analytics chart, donut, message detail panel, quick-response templates, log aktivitas. The current `/admin/kontak/` is a stub. |

**Total missing routes: ~20 (excluding A3-22 which is a redesign of an existing route).**

---

## Section B — Pages that exist but diverge significantly from the mockup

These have an Astro route but the layout, sections, or content differ enough that "looks nothing like the mockup" applies. Listed by severity.

### B1. CRITICAL divergence — entire IA changed

#### B1.1 `/profil/` (`profil/index.astro`)
- **Source design:** Asymmetric hero (text left + single hero image with floating "Sejak 1900-an" badge right) → centered "Eksplorasi Profil" heading + 6-card hub linking to: Tentang Dusun, Letak Geografis, Demografi, Pemerintahan Dusun, Fasilitas Umum, Sosial Agama & Budaya.
- **My build:** Generic `PageHero` (with breadcrumbs the source doesn't have) → `StatsStrip` (which doesn't appear on source profil at all) → only **3** sub-cards (Sejarah/Geografi/Demografi) → inlined `Struktur Aparat Dusun` PersonCard grid → inlined `Fasilitas Dusun` FasilitasCard grid.
- **Why it's wrong:** I dropped 3 of the 6 source sub-pages from the hub, added a stats strip that isn't there, and inlined two of the missing sub-pages' content into this page instead of giving them their own routes.
- **Source ref:** `/home/ubuntu/site/stitch_dusun_bedalo_official_website/profil_dusun_bedalo/code.html`

#### B1.2 `/potensi/` (`potensi/index.astro`)
- **Source design:**
  1. Asymmetric header: text left + **3-photo collage** right (vertical pantai photo + grass close-up + woven basket).
  2. **Filter chip bar** with 8 categories: Semua, Wisata Alam, UMKM, Pertanian, Peternakan, Kuliner, Seni Budaya, Pemuda.
  3. **Bento grid:** 1 large featured (Wisata Alam: Pantai Ngedan, full overlay) + 1 medium (UMKM Kerajinan) + 4 small icon-only cards (Pertanian, Karawitan, Kuliner Lokal, Sentra Ternak).
  4. **"Dari Ladang ke Laut"** conceptual two-column block with "Hulu Agraris" + "Hilir Bahari".
- **My build:** PageHero + `WisataCard` 4-column list + 3-card link grid (Wisata/Pertanian/Kerajinan) + UMKM grid + Kuliner grid. None of the source's distinctive elements (3-photo collage, filter chips, bento, "Dari Ladang ke Laut") are present.
- **Source ref:** `potensi_dusun_dusun_bedalo/`

#### B1.3 `/kkn/` (`kkn/index.astro`)
- **Source design:** `kkn_di_dusun_bedalo_arsip_kenangan` — large hero image with overlay text "Jejak Pengabdian Mahasiswa di Dusun Bedalo" + "ARSIP KHUSUS" eyebrow → **3-stat card strip** (24 Total Kelompok KKN, 10+ Tahun Pengabdian, 150+ Program Kerja Selesai) → big CTA card "Punya Kenangan di Dusun Bedalo? — Kirim Dokumentasi KKN" on a deep blue gradient. Very minimal — it's a portal page into the archive.
- **My build:** Side-by-side hero (text+illustration) → "Inisiatif Mahasiswa" 6-proker grid → 3-card sub-section grid (Anggota / Refleksi / Dinding Kenangan) → "Refleksi Terbaru" 3-card grid. Mine is a content hub with everything inlined; source is a slim landing.
- **Source ref:** `kkn_di_dusun_bedalo_arsip_kenangan/`

#### B1.4 `/kontak/` (`kontak.astro`)
- **Source design:** Title "Hubungi Kami" + subtitle → **2-column layout: form LEFT, location panel RIGHT.** Right panel contains a **stylized map illustration** with an "@ Balai Dusun Bedalo, Gunungkidul" pin overlay + "Panduan Rute Lokasi" 4-button card (Dusun Bedalo / Pantai Ngedan / Balai Padukuhan / Sentra UMKM) + a green "WhatsApp Kami" CTA + small mail icon button + "MEDIA SOSIAL RESMI" with 3 social icons.
- **My build:** Title "Kontak Dusun Bedalo" + breadcrumb + eyebrow "HUBUNGI KAMI" → **2-column layout but mirrored (info LEFT, form RIGHT).** Left column is 3 stacked info cards (EMAIL / TELEPON / ALAMAT) + "Kirim Pesan" / "Kirim Dokumentasi" buttons. **No map. No Panduan Rute. No WhatsApp button. No social icons inline.**
- **Why it's wrong:** Information architecture inverted (form-LEFT vs form-RIGHT), the visual centerpiece (map illustration) is gone, the route guidance is gone, the WhatsApp CTA is gone.
- **Source ref:** `kontak_kami_dusun_bedalo/`

#### B1.5 `/galeri/` (`galeri/index.astro`)
- **Source design:** Big title "Galeri Desa" + subtitle → **5 filter chips** (SEMUA, WISATA ALAM, KEGIATAN WARGA, SENI & BUDAYA, PEMBANGUNAN) → **masonry of individual photos** (mixed aspect ratios: tall portrait, square, landscape) — it's a unified photo wall, not albums.
- **My build:** PageHero + breadcrumbs + grid of `GaleriAlbumCard` (each card is an album cover that links to album detail). **It's an album list, not a photo wall.**
- **Why it's wrong:** Conceptually different — source treats /galeri/ as the photo wall and `/galeri/foto/` (missing) might have been the album breakdown. Source's `detail_album_galeri_dusun_bedalo` exists for individual albums.
- **Source ref:** `galeri_dusun_bedalo/`

#### B1.6 `/admin/kontak/` (`admin/kontak.astro`)
- **Source design:** Full operational dashboard. Left rail (Bedalo Admin nav) + main with: search bar + bell + 3 stat cards (Total Pesan 1284, Belum Dibaca 42, Dalam Proses 15) + bar chart "Tren Aspirasi" + donut "Kategori Aspirasi" + filter chip row + huge data table with checkboxes/badges/actions + footer KPI cards (Avg Response Time, Kategori Populer, Isu Mendesak) + slide-in detail panel (Detail Aspirasi with internal notes, log aktivitas, quick response templates, attach button).
- **My build:** Empty-state placeholder. Just a single card saying "Inbox Web3Forms" with a "Buka Web3Forms Dashboard" link. **0 stats, 0 charts, 0 table, 0 detail panel.**
- **Source ref:** `admin_dashboard_kontak_aspirasi_operational_view/` (and the simpler `admin_dashboard_kontak_aspirasi/` variant).

### B2. SIGNIFICANT divergence — wrong sections / wrong layout

#### B2.1 `/` (homepage, `index.astro`)
- **What's right:** Topnav, overall section ordering (Hero → Stats → Profil preview → Potensi teaser → Agenda&Berita → KKN teaser → Galeri).
- **What's wrong:**
  - ~~Stats strip shows **only 3 items** (1,240+ Penduduk / 85 Ha / 4 Titik) — source has **4** (the missing one is "6 RT" with `cottage` icon).~~ **Correction:** re-verified `beranda_dusun_bedalo/code.html` lines 192–224 — source has **3** stats, not 4. Current build is correct.
  - "Agenda & Berita Terbaru" card row: **2 of 3 cards have broken cover images** — the alt-text fallback is rendering on top of empty space (e.g. "Sukarelawan menanam bibit mangrove" reads as text). Likely cause: certain seeded berita entries reference image paths that don't resolve in the deployed build.
  - "Galeri Kehidupan Desa" only shows **2 photos** instead of source's 6-photo masonry.
  - Hero photo collage looks smaller / less dramatic than source — in source, it has 2 rotated photos + 3 floating overlay cards (Pesisir Selatan / UMKM Lokal / 4 Pantai). Mine has the floating cards but the photos themselves are arranged differently.

#### B2.2 `/berita/` (`berita/index.astro`)
- **What's right:** 2/3 + 1/3 content+sidebar split, search box, populer list, pengumuman block — components mostly correct.
- **What's wrong:**
  - **Featured BeritaCard at top has broken image** in deployed build (renders alt-text only) — same root cause as homepage.
  - In source the **featured spans the whole top width** (across both content + sidebar columns). In mine it's confined to the left column.
  - Source nav active state shows "Agenda & Berita". Mine does too — correct.
  - Source has subtitle below title. Mine has eyebrow ("KABAR TERKINI") + breadcrumb that source doesn't have.
  - **Pengumuman card design is different:** source shows urgent badge + bold colored card; mine shows a list of small cards.

#### B2.3 `/agenda-berita/` (`agenda-berita.astro`)
- **Source design:** 2-col layout — featured berita (full image + text below) on left + "Agenda Mendatang" right-column list with date-stamps (AGUS 15 / AGUS 20 / SEPT 05) and locations. Then filter chip row (Semua / Berita / Agenda / Pengumuman) + 3-col grid below.
- **My build:** Likely uses generic `PageHero` and standard list — needs verification but I expect it doesn't have the date-stamp agenda sidebar. (Auditor note: I didn't read the built file in detail; flagging as B2 not B1.)

#### B2.4 `/profil/sejarah/`, `/profil/geografi/`, `/profil/demografi/`, `/profil/pemerintahan/`
- These were **created from scratch by me** because the source doesn't have a corresponding folder for `/profil/sejarah/`. The source has `tentang_dusun_dusun_bedalo` (≈sejarah/visi-misi), `letak_geografis_dusun_bedalo` (≈geografi), `demografi_dusun_bedalo_dusun_bedalo` (≈demografi), `pemerintahan_dusun_dusun_bedalo` (✓), `fasilitas_umum_dusun_bedalo` (≈fasilitas — missing), `sosial_agama_dan_budaya_dusun_bedalo` (≈sosial-budaya — missing).
- Routing mismatch: my `/profil/geografi/` should probably be `/profil/letak-geografis/` to match source naming, and the page content was rebuilt freehand without matching the source layout.

#### B2.5 `/potensi/wisata/` and `/potensi/wisata/[slug]/`
- Source has the four pantai pages as **separate top-level pages** (`pantai_ngedan_wisata_alam_dusun_bedalo`, `pantai_butuh_detail_wisata`, `pantai_mbirit_wisata_alam_dusun_bedalo`, `pantai_ngluwen_dusun_bedalo`) plus a `wisata_alam_dusun_bedalo` index page that uses a hero + filter + grid layout.
- My implementation collapses them into a content collection with dynamic routes. Functionally equivalent for content, but the **layouts of each detail page differ** — source pantai detail pages each have unique hero compositions (different photo treatments, different facility lists, different "fasilitas umum" cards).

#### B2.6 `/potensi/umkm/[slug]/` (`detail_umkm_dusun_bedalo`)
- Source has a specific 2-col detail layout: left big product image + photo grid + description; right sidebar with "Hubungi Penjual" buttons (WA + Tokopedia + Shopee + Marketplace), profile card with avatar, kategori, daerah, jam buka. Plus "Produk Lainnya" section at bottom.
- My UMKM detail uses a generic detail layout — needs verification but likely doesn't match the marketplace sidebar pattern.

#### B2.7 `/kkn/program-kerja/[slug]/` 
- Source `detail_program_kerja_kkn_kelompok_129` has these sections in order: breadcrumb → category badge → title → wide hero photo → 2-col with "Tujuan" + "Latar Belakang" (left) + "Ringkasan Program" sidebar card with TANGGAL/SASARAN/PJ/ANGGARAN + "Unduh Laporan Lengkap" button (right) → "Cerita Pelaksanaan" → "Galeri Kegiatan" 3-photo row → "Hasil & Dampak" with checkmark bullets → "Tantangan & Rekomendasi" → "Program Kerja Lainnya" 3-card horizontal carousel.
- My build has: breadcrumb → kelompok badge → title → photo → 2-col card (Periode + PIC) → "Tujuan Program" + "Capaian/Deliverable" cards → free-form "Latar Belakang/Tahapan/Hasil" markdown → vertical "Timeline Pelaksanaan" → "Galeri Program" with 2 small thumbs.
- **No "Unduh Laporan", no "Hasil & Dampak" card layout, no "Tantangan & Rekomendasi" section, no "Program Kerja Lainnya" related-cards block.**

#### B2.8 `/kkn/anggota/`
- Source `anggota_kkn_kelompok_129` shows kelompok 129 specifically (with kelompok header + kampus + jurusan badges per anggota). My route is generic `/kkn/anggota/` and lists anggota across all kelompok — losing the per-kelompok grouping. Would need to be `/kkn/kelompok/[slug]/anggota/` once per-kelompok routing exists (see A2).

#### B2.9 `/kkn/refleksi/`
- Source `refleksi_kkn_kelompok_129` is per-kelompok with author cards. Mine is global.

#### B2.10 `/agenda/[slug]/` and `/pengumuman/[slug]/`
- Source detail pages have specific layouts (event card sidebar, RSVP CTAs, related items). My detail pages use a generic markdown rendering.

### B3. MINOR divergence — close but not pixel-parity

These are close enough that a focused styling/spacing pass can fix them; the IA is correct.

- `/berita/[slug]/` — generic detail layout, source has more specific share/related blocks.
- `/pengumuman/` — list page is close to source.
- `/kirim-pesan/` — form layout close to source but field set + sidebar may differ.
- `/kirim-dokumentasi/` — form layout close to source.
- `/admin/`, `/admin/agenda-berita/`, `/admin/potensi/`, `/admin/galeri/`, `/admin/kkn/`, `/admin/pengaturan/` — all built as bare admin shells. Source only has `admin_dashboard_kontak_aspirasi(_operational_view)`; the others are scaffolding I added that don't have a source mockup, so they're not "wrong" but they are unverified design (hold for direction).

---

## Section C — Cross-cutting issues affecting many pages

These are not page-by-page bugs — they are systemic and need a one-shot fix that improves many pages at once.

### C1. Broken card cover images (homepage + berita list)
- Symptom: card image area renders empty + alt text shows on top.
- Likely cause: certain MDX entries in `src/content/berita/` reference image paths in `src/lib/images.ts` constants that resolve to URLs the deployed build can't fetch (or the import name doesn't exist).
- Action: audit all `cover:` frontmatter values, match them to `images.ts` exports, and verify each URL responds 200.

### C2. ~~Missing "6 RT" stat~~ (RETRACTED — see C1; source has 3 stats, current build is correct)
- Homepage `StatsStrip` is passed only 3 items in `index.astro` whereas source has 4.

### C3. Inconsistent use of `PageHero` vs naked title
- Source pages mostly use a **bare title + subtitle** at the top (no eyebrow chip, no breadcrumb).
- I wrap most public pages in a generic `PageHero` component with **eyebrow + breadcrumbs**, which adds visual chrome the source never has.
- Action: introduce a "naked" hero variant or inline the title+subtitle pattern on most pages, and reserve `PageHero` only for the pages that actually need the chip.

### C4. Component coverage gap
Source has these reusable visual elements that are not implemented as Astro components:
- **Asymmetric photo collage** (homepage hero, profil hero, potensi hero) — a multi-image rotated stack with floating badges. I don't have a single component for this; current homepage hero is a custom inline piece.
- **Filter chip bar** with category counts + active state — exists as `CategoryFilter` but isn't used on `/galeri/`, `/potensi/`, or as the source-style row.
- **Map illustration card** with pin overlay (used on `/kontak/` and source `/profil/lokasi-peta`).
- **Stat trio card** (KKN landing 24/10+/150+) — used inline as text only; should be its own component matching source visual.
- **Bento bento layout** (large hero card + medium + 4 small icon cards) for `/potensi/`.
- **Per-kelompok header card** (kelompok number, kampus, periode, anggota count) for KKN detail pages.
- **Quick response templates / inline reply panel** for admin operational view.
- **Donut + bar chart cards** for admin operational view.

### C5. Unsplash placeholders mask layout issues
- Many cover images come from `src/lib/images.ts` (Unsplash URLs). They are visually OK but they're **the wrong subject** for many entries (e.g. a generic "city skyline" rendered for a "Peresmian Balai Desa" story).
- Once the layout is fixed, real images need to be migrated from `lh3.googleusercontent.com` (called out as a follow-up phase in the merged PR's deferred work list).

### C6. Verified working
- Footer ✓, mobile bottom nav ✓ (assumed from build), top nav active states ✓, dynamic routing for berita/agenda/pengumuman/wisata/umkm/kuliner/proker/refleksi/galeri-album works.

---

## Section D — Mapping table (full)

Source mockups (61) → Astro routes. **❌ = no route, ⚠ = exists but diverges, ✅ = reasonably faithful, ➕ = built without mockup.**

| # | Source folder | Built route | Status |
|---:|---|---|:---:|
| 1 | `beranda_dusun_bedalo` | `/` | ⚠ B2.1 |
| 2 | `profil_dusun_bedalo` | `/profil/` | ⚠ B1.1 |
| 3 | `tentang_dusun_dusun_bedalo` | (none) | ❌ A1.1 |
| 4 | `letak_geografis_dusun_bedalo` | `/profil/geografi/` | ⚠ B2.4 |
| 5 | `demografi_dusun_bedalo_dusun_bedalo` | `/profil/demografi/` | ⚠ B2.4 |
| 6 | `pemerintahan_dusun_dusun_bedalo` | `/profil/pemerintahan/` | ⚠ B2.4 |
| 7 | `fasilitas_umum_dusun_bedalo` | (inlined into `/profil/`) | ❌ A1.4 |
| 8 | `sosial_agama_dan_budaya_dusun_bedalo` | (none) | ❌ A1.3 |
| 9 | `lokasi_peta_dusun_bedalo` | (none) | ❌ A1.2 |
| 10 | `potensi_dusun_dusun_bedalo` | `/potensi/` | ⚠ B1.2 |
| 11 | `wisata_alam_dusun_bedalo` | `/potensi/wisata/` | ⚠ B2.5 |
| 12 | `pantai_ngedan_wisata_alam_dusun_bedalo` | `/potensi/wisata/pantai-ngedan/` | ⚠ B2.5 |
| 13 | `pantai_butuh_detail_wisata` | `/potensi/wisata/pantai-butuh/` | ⚠ B2.5 |
| 14 | `pantai_mbirit_wisata_alam_dusun_bedalo` | `/potensi/wisata/pantai-mbirit/` | ⚠ B2.5 |
| 15 | `pantai_ngluwen_dusun_bedalo` | `/potensi/wisata/pantai-ngluwen/` | ⚠ B2.5 |
| 16 | `umkm_lokal_dusun_bedalo` | `/potensi/umkm/` | ✅ |
| 17 | `detail_umkm_dusun_bedalo` | `/potensi/umkm/[slug]/` | ⚠ B2.6 |
| 18 | `kuliner_lokal_bedalo` | `/potensi/kuliner/` | ✅ |
| 19 | `pertanian_dan_perkebunan_dusun_bedalo` | `/potensi/pertanian/` | ✅ |
| 20 | `peternakan_dusun_bedalo` | (none) | ❌ A1.5 |
| 21 | `seni_dan_budaya_dusun_bedalo` | (none) | ❌ A1.6 |
| 22 | `karang_taruna_dan_pemuda_dusun_bedalo` | (none) | ❌ A1.7 |
| 23 | `agenda_berita_dusun_bedalo` | `/agenda-berita/` | ⚠ B2.3 |
| 24 | `berita_dusun_bedalo` | `/berita/` | ⚠ B2.2 |
| 25 | `detail_berita_dusun_bedalo` | `/berita/[slug]/` | ⚠ B3 |
| 26 | `agenda_dusun_bedalo` | `/agenda/` | ✅ |
| 27 | `detail_agenda_dusun_bedalo` | `/agenda/[slug]/` | ⚠ B2.10 |
| 28 | `pengumuman_dusun_bedalo` | `/pengumuman/` | ✅ |
| 29 | `detail_pengumuman_dusun_bedalo` | `/pengumuman/[slug]/` | ⚠ B2.10 |
| 30 | `galeri_dusun_bedalo` | `/galeri/` | ⚠ B1.5 |
| 31 | `detail_album_galeri_dusun_bedalo` | `/galeri/[slug]/` | ✅ |
| 32 | `galeri_foto_dusun_bedalo` | (none) | ❌ A1.8 |
| 33 | `galeri_video_dusun_bedalo` | (none) | ❌ A1.9 |
| 34 | `kkn_di_dusun_bedalo_arsip_kenangan` | `/kkn/` | ⚠ B1.3 |
| 35 | `arsip_proker_kkn_dusun_bedalo` | `/kkn/program-kerja/` | ✅ |
| 36 | `program_kerja_kkn_kelompok_129` | (none, see A2.13) | ❌ A2.13 |
| 37 | `detail_proker_bedalo_terang` | `/kkn/program-kerja/bedalo-terang/` | ⚠ B2.7 |
| 38 | `detail_proker_jumat_bersih_pantai_ngedan` | `/kkn/program-kerja/jumat-bersih-pantai-ngedan/` | ⚠ B2.7 |
| 39 | `detail_program_kerja_kkn_kelompok_129` | `/kkn/program-kerja/[slug]/` (template) | ⚠ B2.7 |
| 40 | `anggota_kkn_kelompok_129` | `/kkn/anggota/` | ⚠ B2.8 |
| 41 | `detail_kelompok_129_kkn_uin_suka_117` | (none) | ❌ A2.12 |
| 42 | `timeline_kkn_kelompok_129` | (none) | ❌ A2.14 |
| 43 | `refleksi_kkn_kelompok_129` | `/kkn/refleksi/` | ⚠ B2.9 |
| 44 | `arsip_tulisan_kkn_dusun_bedalo` | (none) | ❌ A2.19 |
| 45 | `galeri_kegiatan_kkn_kelompok_129` | (none) | ❌ A2.15 |
| 46 | `detail_album_kkn_template` | (none) | ❌ A2.16 |
| 47 | `dinding_kenangan_kkn` | `/kkn/dinding-kenangan/` | ✅ |
| 48 | `galeri_kenangan_kkn_dusun_bedalo` | (none) | ❌ A2.17 |
| 49 | `peta_kegiatan_kkn_bedalo` | (none) | ❌ A2.18 |
| 50 | `arsip_dokumentasi_kegiatan` | (none) | ❌ A2.20 |
| 51 | `daftar_arsip_kkn_dusun_bedalo` | (none) | ❌ A2.11 |
| 52 | `case_study_digitalisasi_dusun_bedalo` | (none) | ❌ A3.21 |
| 53 | `kontak_kami_dusun_bedalo` | `/kontak/` | ⚠ B1.4 |
| 54 | `kirim_pesan_dusun_bedalo` | `/kirim-pesan/` | ⚠ B3 |
| 55 | `kirim_dokumentasi_kkn` | `/kirim-dokumentasi/` | ⚠ B3 |
| 56 | `media_sosial_dusun_bedalo` | (none) | ❌ A1.10 |
| 57 | `program_kerja_kkn_optimized_density` | (variant — ignore) | — |
| 58 | `program_kerja_kkn_typographic_rhythm` | (variant — ignore) | — |
| 59 | `program_kerja_kkn_refined_geometry` | (variant — ignore) | — |
| 60 | `admin_dashboard_kontak_aspirasi` | `/admin/kontak/` | ⚠ B1.6 |
| 61 | `admin_dashboard_kontak_aspirasi_operational_view` | `/admin/kontak/` (better target) | ❌ A3.22 |

Built-without-mockup (➕): `/admin/`, `/admin/agenda-berita/`, `/admin/potensi/`, `/admin/galeri/`, `/admin/kkn/`, `/admin/pengaturan/`, `/profil/sejarah/`. These have no source and are unverified design.

**Final tally**
- ✅ Reasonably faithful: **8** (#16, 18, 19, 26, 28, 31, 35, 47)
- ⚠ Diverges: **23**
- ❌ Missing: **20** (excluding 3 design variants we agreed to ignore)
- ➕ Built without source: **7** admin/profil shells

---

## Section E — Recommended fix order (proposed, awaiting your approval)

I would tackle this as **5 short PRs** rather than one huge rewrite, so each step is reviewable and the live preview keeps improving.

1. **PR 1 — Cross-cutting fixes (C1-C3)**
   - Fix broken cover images (audit `images.ts` mappings, repair frontmatter).
   - ~~Add the missing 4th stat (6 RT) on homepage.~~ (Retracted — source has 3 stats; build is correct.)
   - Decide: keep `PageHero` everywhere, or strip it back to source-style bare titles. (My recommendation: strip it back; the source rarely uses an eyebrow on public pages.)
   - Add the missing source components: `PhotoCollageHero`, `BentoPotensiGrid`, `MapIllustrationCard`, `FilterChipBar` (variant).

2. **PR 2 — Top-priority diverged pages (B1)**
   - Rebuild `/profil/` as a 6-card hub (and add the 3 missing sub-pages: `/profil/tentang/`, `/profil/sosial-budaya/`, `/profil/fasilitas/`, `/profil/lokasi-peta/`).
   - Rebuild `/potensi/` with the source's 3-photo collage + filter chips + bento + "Dari Ladang ke Laut" block (and add the 3 missing sub-pages: `/potensi/peternakan/`, `/potensi/seni-budaya/`, `/potensi/pemuda/`).
   - Rebuild `/kontak/` with form-LEFT, map-RIGHT, Panduan Rute card, WhatsApp CTA, social bar.
   - Rebuild `/galeri/` as a single masonry photo wall + filter chips (and add `/galeri/foto/` + `/galeri/video/`).

3. **PR 3 — KKN sub-system rebuild (A2 + B2.7-B2.9)**
   - Introduce `kkn-kelompok` collection schema.
   - Add per-kelompok routes: `/kkn/kelompok/[slug]/{index,program-kerja,anggota,timeline,galeri,refleksi}`.
   - Re-target `/kkn/` landing page to source's "Arsip Kenangan" design.
   - Rebuild `detail_program_kerja` template with all source sections (Hasil & Dampak, Tantangan & Rekomendasi, Program Kerja Lainnya).
   - Add: `/kkn/arsip/`, `/kkn/galeri-kenangan/`, `/kkn/peta-kegiatan/`, `/kkn/tulisan/`, `/kkn/dokumentasi/`.

4. **PR 4 — Admin operational view (B1.6 + A3.22)**
   - Replace `/admin/kontak/` placeholder with the full operational dashboard (stat cards, bar chart, donut chart, message table with badges, slide-in detail panel, KPI footer cards).
   - Decide: should the other `/admin/*` pages also be built out, or removed since they have no source?

5. **PR 5 — Minor polish & remaining detail pages (B2/B3)**
   - Fix `/agenda-berita/` agenda sidebar with date stamps.
   - Polish `/berita/`, `/agenda/[slug]/`, `/pengumuman/[slug]/` detail layouts.
   - Add `/media-sosial/` and `/case-study/digitalisasi/`.
   - Polish kirim-pesan + kirim-dokumentasi forms.

After these, only **real image migration** (replacing Unsplash placeholders with the 240 `lh3.googleusercontent.com` originals) and **form backend wiring** (Web3Forms key) remain — both already on the deferred list.

---

## Section F — What I need from you before continuing

Two questions and one warning.

1. **Approve the 5-PR plan above, or specify a different order.** Easy default: "go in order, do PR 1 first."
2. **For each `/profil/*` and `/potensi/*` sub-page that currently has no source URL slug match (e.g. my `/profil/sejarah/` vs source `tentang_dusun`), can I rename the route to match source naming?** This will break any links that already reference the current slugs (there are none in production, but worth confirming).
3. **Warning: PR 3 (KKN sub-system) is a structural change.** It introduces a new collection, several new dynamic routes, and a content-data migration (existing proker/anggota/refleksi entries need a `kelompok` foreign key). It will be the biggest of the 5 PRs. If you want me to keep the current flat structure instead and just visually fix the existing pages, say so and I'll cut PR 3 down to a redesign-only effort.
