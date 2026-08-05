# Wedding Invitation: Bayu Indra Kusuma & Natasya

Reference: viding.com-style digital invitation (wennyfarrel.viding.com, site unreachable saat cek, plan disusun dari pola umum platform viding/undangan digital Indonesia).

## Stack

- **Astro** (bukan Next.js): situs 90% konten statis (cover, cerita, galeri, detail acara), cuma sedikit bagian interaktif (RSVP, countdown, musik, live embed). Astro default ship 0 JS, komponen interaktif jadi "island" (React) yang di-hydrate cuma yang perlu. Hasil: load jauh lebih cepat di HP tamu dengan sinyal pas-pasan dibanding full Next.js SPA.
- **React islands** untuk bagian interaktif: RSVP form, guestbook list, countdown, music toggle, gallery lightbox.
- **Tailwind CSS**: styling cepat, gampang kontrol palet warna terpusat (theme token).
- **TypeScript** di seluruh project.
- **Deploy**: Vercel (Astro adapter `@astrojs/vercel`, mode `hybrid`, halaman utama prerender statis, endpoint `/api/rsvp` & `/api/wishes` jalan sebagai serverless function). Free tier cukup buat traffic spike hari-H.

## Database, phasing

Mini PC udah punya Postgres 16 jalan di Docker (`~/docker/odoo-postgres/`, shared instance buat semua Odoo, lihat [[Mini PC Setup/tools/postgresql|postgresql]]). Pakai instance yang sama, bikin DB baru di dalamnya, gak perlu container terpisah.

1. **Dev (sekarang)**: schema didesain pakai **Drizzle ORM** (portable), connect ke DB baru `wedding_dev` di instance Postgres mini PC yang udah ada. Kalau dev di laptop terpisah dari mini PC, connect via IP LAN (`postgresql://user:pass@<ip-mini-pc>:5432/wedding_dev`) atau Tailscale kalau udah ada, cek port 5432 ke-expose ke jaringan lokal di compose file-nya (default docker-compose Odoo biasanya cuma bind ke localhost mini PC, mungkin perlu ubah `ports:` jadi `0.0.0.0:5432:5432` atau tambah Tailscale).
2. **Production (diputuskan)**: tetap self-host di mini PC, lewat tunnel Cloudflare yang udah ada (`odoo19-ce`, awalnya cuma buat `internal.bayuik.com` ke Odoo). Vercel gak bisa connect raw Postgres protocol ke tunnel (Cloudflare Tunnel gratis cuma buat HTTP, raw TCP publik butuh Spectrum berbayar), jadi ditaruh **PostgREST** di depan Postgres:
   - Role Postgres terbatas `wedding_api`: cuma `INSERT` ke `rsvp` & `wishes`, `SELECT` ke view `wishes_public` (filter `approved = true`). Gak bisa baca tabel mentah.
   - Container `wedding-api` (image `postgrest/postgrest`) nambah di `~/docker/odoo-postgres/docker-compose.yml`, port `8021` di host.
   - Ingress baru di tunnel: `wedding-api.bayuik.com` → `http://localhost:8021`, jalan bareng ingress Odoo yang lama, satu tunnel aja. (Sempat coba `api.natasya.bayuik.com`, gagal karena itu subdomain 3 level dan gak ke-cover wildcard SSL `*.bayuik.com` punya Cloudflare, cuma cover 1 level.)
   - Kode `/api/rsvp` & `/api/wishes` di-refactor lewat `src/lib/repo.ts`: kalau env `POSTGREST_URL` ke-set (production di Vercel), fetch ke PostgREST; kalau enggak (dev di mini PC), tetap Drizzle langsung ke `localhost:5432` kayak biasa. Gak ada perubahan behavior pas dev.
   - Risiko yang disadari: RSVP tamu bergantung mini PC + internet rumah nyala terus pas hari-H. Diterima, gak pindah ke Neon.

### Schema kasar

```
guests      (id, slug, name, group, invited_to[akad|resepsi|both])
rsvp        (id, guest_id nullable, name, attendance[hadir|tidak|maybe], pax, created_at)
wishes      (id, name, message, created_at, approved bool default true)
gift_log    (id, name nullable, channel[bank|qris|ewallet], note, created_at)  -- optional, manual tracking siapa kirim angpao
```

## Fitur (sesuai pilihan)

- **Cover / intro**: nama couple, tanggal, tombol "Buka Undangan" (trigger autoplay musik, browser policy butuh interaksi user dulu).
- **Nama tamu personal**: link `?to=Nama` atau `?to=slug` (lookup ke tabel `guests`). Tampil "Kepada Yth. Bapak/Ibu {name}" di intro & bisa prefill nama di form RSVP.
- **Couple info**: bio singkat Bayu & Natasya, foto profil.
- **Our story + galeri foto**: timeline cerita, grid galeri pakai `astro:assets` (auto-optimize/lazy load), lightbox on click.
- **Detail acara**: akad & resepsi terpisah (tanggal, jam, lokasi), embed Google Maps, tombol "Tambah ke Kalender" (.ics).
- **Live streaming**: YouTube bisa embed langsung (iframe live). **IG Live & TikTok Live gak bisa di-embed inline** (limitasi platform, gak ada iframe resmi), solusinya tombol "Tonton di Instagram" / "Tonton di TikTok" yang buka link native app/web pas hari-H. Perlu disiapin link-nya H-1.
- **RSVP + buku ucapan (wishes)**: form kirim konfirmasi hadir + pesan, list ucapan tampil di bawah (server-rendered, refresh tiap submit / revalidate on demand, gak perlu realtime websocket buat use-case ini).
- **Amplop digital**: nomor rekening + tombol copy, QRIS image (download/scan), daftar e-wallet (GoPay/OVO/Dana). Optional catat log siapa transfer (manual, gak ada verifikasi otomatis tanpa integrasi payment gateway berbayar).
- **Countdown timer**: ke tanggal akad, island kecil client-side.

## Palet warna

Diminta "biru + kombinasi menarik", 3 opsi:

| Opsi | Warna | Kesan |
|---|---|---|
| **A: Dusty Blue + Terracotta (rekomendasi)** | `#7B9EB3` dusty blue, `#C1683C` terracotta, `#F7F0E4` cream | Modern, kontras hangat-dingin, jarang dipakai bareng biru, jadi beda dari kebanyakan undangan, tetap elegan |
| B: Navy + Champagne Gold | `#1B2A4A` navy, `#C9A66B` gold, `#FAF6EE` ivory | Formal, mewah, safe choice |
| C: Cornflower Blue + Blush Pink | `#5B7FA6` blue, `#E8C4C4` blush, `#EDE4D3` sand | Romantis, lembut |

Rekomendasi **A**, sesuai request "biru + menarik", kombinasi dusty blue-terracotta lagi tren undangan modern 2025-2026, dan cukup beda dari pola navy+gold yang sudah umum.

## Struktur folder rencana

```
wedding-bayu-natasya/
  src/
    pages/
      index.astro          -- single page invitation (section-based)
      api/
        rsvp.ts
        wishes.ts
    components/
      Cover.astro
      CoupleInfo.astro
      OurStory.astro
      Gallery.astro
      EventDetail.astro
      LiveStream.astro
      RsvpForm.tsx          -- island
      Guestbook.tsx         -- island
      Countdown.tsx         -- island
      MusicToggle.tsx       -- island
      GiftSection.astro
      Closing.astro
    lib/
      db.ts                 -- drizzle client
      schema.ts
    assets/
      photos/
  astro.config.mjs
  drizzle/                  -- migrations
```

## Domain & hosting

- Domain custom disaranin (misal `bayudannatasya.com` / subdomain gratis dari penyedia undangan biasa dipakai kalau mau hemat).
- Frontend tetap di Vercel (bukan mini PC), biar diakses tamu stabil dari luar tanpa tergantung uptime/koneksi rumah. DB dev jalan di mini PC, keputusan DB production lihat bagian Database di atas.

## Next step kalau plan ini oke

1. `npm create astro@latest` + Tailwind + React integration.
2. Setup Drizzle + Neon, migrate schema di atas.
3. Build section by section, mulai dari Cover, EventDetail, RSVP (paling kritikal), baru Gallery/OurStory/Live/Gift.
4. Isi data guest list (nama + slug) buat fitur link personal.

## Status implementasi

Scaffold udah jalan, dev server tested di localhost:4321. Copy/konten section (Bismillah, Quran verse, love story, dress code, closing) diambil dari repo lama [bayuik/wedding-invitation](https://github.com/bayuik/wedding-invitation). Sisa isi manual: foto galeri/profil, link live streaming, no rekening asli, tanggal & lokasi final.
