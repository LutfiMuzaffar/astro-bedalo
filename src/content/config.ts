import { defineCollection, z } from 'astro:content';

const berita = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    cover: z.string(),
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
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    cover: z.string().optional(),
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
    attachments: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

const wisata = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    type: z.enum(['pantai', 'gua', 'air-terjun', 'bukit', 'lainnya']),
    tagline: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    facilities: z.array(z.string()).default([]),
    accessNote: z.string().optional(),
    bestTimeToVisit: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const umkm = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    owner: z.string().optional(),
    category: z.enum(['kuliner', 'kerajinan', 'jasa', 'pertanian', 'lainnya']),
    summary: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    products: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          photo: z.string().optional(),
          price: z.string().optional(),
        })
      )
      .default([]),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    contact: z
      .object({
        whatsapp: z.string().optional(),
        instagram: z.string().optional(),
        address: z.string().optional(),
      })
      .default({}),
  }),
});

const kuliner = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    ingredients: z.array(z.string()).default([]),
    soldBy: z.array(z.string()).default([]),
  }),
});

const galeriAlbum = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    cover: z.string(),
    coverAlt: z.string(),
    photos: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    ),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const kknProker = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kelompok: z.string(),
    angkatan: z.string(),
    period: z.string(),
    pic: z.string().optional(),
    summary: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    objectives: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
    timeline: z
      .array(
        z.object({
          date: z.coerce.date(),
          title: z.string(),
          description: z.string().optional(),
        })
      )
      .default([]),
    impact: z.string().optional(),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    status: z.enum(['planning', 'ongoing', 'completed']).default('completed'),
  }),
});

const kknAlbum = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kelompok: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    photos: z.array(z.object({ src: z.string(), alt: z.string() })),
    publishedAt: z.coerce.date(),
    bucket: z.enum(['kegiatan', 'kenangan', 'arsip']).default('kegiatan'),
  }),
});

const kknAnggota = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    nim: z.string().optional(),
    role: z.string(),
    fakultas: z.string().optional(),
    photo: z.string(),
    photoAlt: z.string(),
    bio: z.string().optional(),
    kelompok: z.string(),
    order: z.number().default(0),
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
  schema: z.object({
    author: z.string(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    message: z.string(),
    publishedAt: z.coerce.date(),
  }),
});

const pemerintahan = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string(),
    photoAlt: z.string(),
    bio: z.string().optional(),
    order: z.number().default(0),
  }),
});

const fasilitas = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    type: z.enum([
      'pendidikan',
      'kesehatan',
      'ibadah',
      'olahraga',
      'pemerintahan',
      'lainnya',
    ]),
    description: z.string(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const collections = {
  berita,
  agenda,
  pengumuman,
  wisata,
  umkm,
  kuliner,
  'galeri-album': galeriAlbum,
  'kkn-proker': kknProker,
  'kkn-album': kknAlbum,
  'kkn-anggota': kknAnggota,
  'kkn-tulisan': kknTulisan,
  'kkn-kenangan': kknKenangan,
  pemerintahan,
  fasilitas,
};
