import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/useLang";

/**
 * Background music: Chopin, Nocturne Op. 9 No. 2 (Musopen, CC0 public domain).
 *
 * Two formats are offered because there is no audio encoder on this machine to
 * shrink the file: the Ogg is roughly half the size of the MP3, so Chrome,
 * Firefox and Android pick that up, while Safari falls back to the MP3. Guests
 * on mobile data get the smaller file wherever the browser allows it.
 *
 * The button hides itself when no audio is served, so swapping in a different
 * track (or removing it) never leaves a dead control behind.
 */
export default function MusicToggle() {
  const [, t] = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // HEAD first: avoids downloading the track just to find out it is missing
    fetch("/music.mp3", { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!available) return;

    const onOpen = () => {
      audioRef.current
        ?.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // autoplay can still be refused; the button stays available
        });
    };
    document.addEventListener("invitation:open", onOpen);
    return () => document.removeEventListener("invitation:open", onOpen);
  }, [available]);

  if (!available) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <audio ref={audioRef} loop preload="none">
        <source src="/music.ogg" type="audio/ogg" />
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("music.off") : t("music.on")}
        aria-pressed={playing}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500 text-cream-50 shadow-lg transition hover:bg-terracotta-700"
      >
        {playing ? "♪" : "♪̸"}
      </button>
    </div>
  );
}
