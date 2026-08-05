import { useEffect, useRef, useState } from "react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    };
    document.addEventListener("invitation:open", onOpen);
    return () => document.removeEventListener("invitation:open", onOpen);
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src="/music.mp3" loop />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500 text-cream-50 shadow-lg hover:bg-terracotta-700"
      >
        {playing ? "♪" : "♪̸"}
      </button>
    </div>
  );
}
