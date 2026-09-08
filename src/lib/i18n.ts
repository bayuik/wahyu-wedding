export type Lang = "id" | "en";

/** Indonesian is what guests see first; English is opt-in via the toggle. */
export const DEFAULT_LANG: Lang = "id";
export const LANGS: Lang[] = ["id", "en"];

/**
 * Flat key -> string map, one per language. Keys are dotted only for grouping,
 * there is no nesting so the client-side swap stays a single lookup.
 *
 * Anything the guest can read belongs here. Names, dates and the Arabic lines
 * are deliberately identical in both languages.
 */
export const dict: Record<Lang, Record<string, string>> = {
  id: {
    "meta.title": "Wahyu & Calon Wanita: Undangan Pernikahan",
    "meta.description":
      "Dengan memohon rahmat Allah, kami mengundang Anda untuk hadir di pernikahan Wahyu dan Calon Wanita, 09 April 2025.",

    "cover.invite": "Kami mengundang Anda ke pernikahan",
    "cover.to": "Kepada Yth. Bapak/Ibu/Saudara/i",
    "cover.open": "Buka Undangan",

    "couple.bismillah": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    "couple.salam": "Assalamualaikum Warahmatullahi Wabarakatuh",
    "couple.intro":
      "Cinta mempertemukan kami, takdir menyatukan langkah. Kini saatnya kami mengikat janji suci, dan kehadiran Anda akan sempurnakan bahagia ini:",
    "couple.verse1":
      "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).",
    "couple.verse1.ref": "QS. Adh-Dhariyat: 49",
    "couple.verse2":
      "dan sesungguhnya Dialah yang menciptakan pasangan laki-laki dan perempuan,",
    "couple.verse2.ref": "QS. An-Najm: 45",
    "couple.groom.parents": "Putra dari Bapak dan Ibu",
    "couple.bride.parents": "Putri dari Bapak dan Ibu",

    "story.title": "Cerita di Balik Janji",
    "story.1.title": "💼 Awal Pertemuan",
    "story.1.text":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "story.2.title": "💞 Perjalanan Bersama",
    "story.2.text":
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "story.3.title": "💍 Menuju Hari Bahagia",
    "story.3.text":
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",

    "gallery.title": "Galeri",

    "countdown.label": "Menuju Hari Bahagia",
    "countdown.days": "Hari",
    "countdown.hours": "Jam",
    "countdown.minutes": "Menit",
    "countdown.seconds": "Detik",

    "event.title": "Moment Bahagia",
    "event.intro":
      "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:",
    "event.akad": "Akad Nikah",
    "event.resepsi": "Resepsi",
    "event.date": "Rabu, 09 April 2025",
    "event.akad.time": "08.00 - 10.00 WIB",
    "event.resepsi.time": "11.00 - 14.00 WIB",
    "event.akad.place": "Kediaman Mempelai Wanita",
    "event.resepsi.place": "Gedung Resepsi",
    "event.map": "Lihat Lokasi",
    "event.dresscode.intro":
      "Agar momen ini terasa hangat dan selaras, kenakanlah busana terbaikmu dalam balutan:",
    "event.dresscode.name": "Batik",
    "event.dresscode.note": "Dominasi berwarna hitam.",

    "live.title": "Live Streaming",
    "live.intro":
      "Buat yang belum bisa hadir langsung, ikuti acara lewat live streaming di bawah ini.",
    "live.empty":
      "Link siaran langsung akan tersedia menjelang hari H.",
    "live.note":
      "Instagram Live dan TikTok Live tidak bisa di-embed langsung di halaman ini (limitasi platform), tonton via tombol berikut saat acara berlangsung:",
    "live.ig": "Tonton di Instagram",
    "live.tiktok": "Tonton di TikTok",

    "rsvp.title": "Ucapan & Doa",
    "rsvp.intro":
      "Mohon konfirmasi kehadiran sekaligus titipkan ucapan & doa untuk kami.",
    "rsvp.name": "Nama",
    "rsvp.attendance": "Presensi",
    "rsvp.attend.yes": "✅ Datang",
    "rsvp.attend.no": "❌ Berhalangan",
    "rsvp.attend.maybe": "🤔 Masih Ragu",
    "rsvp.pax": "Jumlah Tamu",
    "rsvp.message": "Ucapan & Doa (opsional)",
    "rsvp.message.placeholder": "Tulis Ucapan dan Doa",
    "rsvp.submit": "Kirim",
    "rsvp.sending": "Mengirim...",
    "rsvp.error": "Gagal mengirim, coba lagi.",
    "rsvp.unavailable":
      "Maaf, konfirmasi belum bisa dikirim sekarang. Mohon coba lagi beberapa saat lagi.",
    "rsvp.thanks": "Terima kasih! Konfirmasi kehadiran kamu sudah kami terima.",
    "rsvp.empty": "Jadi yang pertama kirim ucapan.",

    "gift.title": "Love Gift",
    "gift.intro":
      "Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:",
    "gift.copy": "Salin Nomor",
    "gift.copied": "Tersalin!",
    "gift.ewallet": "E-wallet",

    "music.on": "Nyalakan musik",
    "music.off": "Matikan musik",

    "closing.thanks": "Terima Kasih",
    "closing.appreciate": "Terima kasih atas doa dan restu yang kalian berikan.",
    "closing.seeyou": "Sampai jumpa di hari bahagia kami!",
    "closing.salam": "Wassalamualaikum Warahmatullahi Wabarakatuh",
    "closing.hamdalah": "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
  },

  en: {
    "meta.title": "Wahyu & Calon Wanita: Wedding Invitation",
    "meta.description":
      "By the grace of Allah, we invite you to the wedding of Wahyu and Calon Wanita on 09 April 2025.",

    "cover.invite": "We Invite You To the Wedding of",
    "cover.to": "Dear Mr/Mrs/Ms",
    "cover.open": "Open the Invitation",

    "couple.bismillah": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    "couple.salam": "Assalamualaikum Warahmatullahi Wabarakatuh",
    "couple.intro":
      "Love brought us together, destiny united our steps. Now the time has come for us to make a sacred promise, and your presence would complete this happiness:",
    "couple.verse1":
      "And of all things We created two mates, that perhaps you may remember (the greatness of Allah).",
    "couple.verse1.ref": "QS. Adh-Dhariyat: 49",
    "couple.verse2": "and that He creates the two mates, the male and female,",
    "couple.verse2.ref": "QS. An-Najm: 45",
    "couple.groom.parents": "Son of Mr and Mrs",
    "couple.bride.parents": "Daughter of Mr and Mrs",

    "story.title": "Our Love Story",
    "story.1.title": "💼 The First Meeting",
    "story.1.text":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "story.2.title": "💞 The Journey Together",
    "story.2.text":
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "story.3.title": "💍 Toward the Happy Day",
    "story.3.text":
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",

    "gallery.title": "Gallery",

    "countdown.label": "Counting Down To Our Big Day",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",

    "event.title": "Our Happy Moment",
    "event.intro":
      "By the grace and blessing of Allah Subhanahu Wa Ta'ala, we will hold the following celebration:",
    "event.akad": "Wedding Ceremony",
    "event.resepsi": "Reception",
    "event.date": "Wednesday, 09 April 2025",
    "event.akad.time": "08.00 - 10.00 (GMT+7)",
    "event.resepsi.time": "11.00 - 14.00 (GMT+7)",
    "event.akad.place": "The Bride's Residence",
    "event.resepsi.place": "Reception Hall",
    "event.map": "View Location",
    "event.dresscode.intro":
      "To keep the moment warm and in harmony, please wear your best in:",
    "event.dresscode.name": "Batik",
    "event.dresscode.note": "Predominantly black.",

    "live.title": "Live Streaming",
    "live.intro":
      "For those who cannot join us in person, please follow the celebration through the live stream below.",
    "live.empty":
      "The live stream link will be available closer to the day.",
    "live.note":
      "Instagram Live and TikTok Live cannot be embedded on this page (a platform limitation), so please watch through these buttons during the event:",
    "live.ig": "Watch on Instagram",
    "live.tiktok": "Watch on TikTok",

    "rsvp.title": "Wishes & Prayers",
    "rsvp.intro":
      "Please confirm your attendance and leave your wishes and prayers for us.",
    "rsvp.name": "Name",
    "rsvp.attendance": "Attendance",
    "rsvp.attend.yes": "✅ Attending",
    "rsvp.attend.no": "❌ Unable to attend",
    "rsvp.attend.maybe": "🤔 Not sure yet",
    "rsvp.pax": "Number of Guests",
    "rsvp.message": "Wishes & Prayers (optional)",
    "rsvp.message.placeholder": "Write your wishes and prayers",
    "rsvp.submit": "Send",
    "rsvp.sending": "Sending...",
    "rsvp.error": "Failed to send, please try again.",
    "rsvp.unavailable":
      "Sorry, we cannot receive your confirmation right now. Please try again a little later.",
    "rsvp.thanks": "Thank you! Your confirmation has been received.",
    "rsvp.empty": "Be the first to leave a wish.",

    "gift.title": "Love Gift",
    "gift.intro":
      "With respect, for those who wish to send us a token of love, it can be done through:",
    "gift.copy": "Copy Number",
    "gift.copied": "Copied!",
    "gift.ewallet": "E-wallet",

    "music.on": "Play music",
    "music.off": "Mute music",

    "closing.thanks": "Thank You",
    "closing.appreciate": "We appreciate your love and support.",
    "closing.seeyou": "See You On Our Wedding Day!",
    "closing.salam": "Wassalamualaikum Warahmatullahi Wabarakatuh",
    "closing.hamdalah": "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
  },
};

/** Server-render helper. Falls back to Indonesian, then to the key itself. */
export function t(key: string, lang: Lang = DEFAULT_LANG): string {
  return dict[lang]?.[key] ?? dict[DEFAULT_LANG][key] ?? key;
}
