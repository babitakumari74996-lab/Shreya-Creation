import { useEffect, useRef } from "react";

let heroPlayed = false;
let heroEnded = false;
let heroTime = 0;

/** Background video for the home hero — always silent, plays back once.
 *
 *  Plays Home video.mp4 (1280x720, H.264) once. The first page load in a
 *  tab always plays it; navigating away and back never replays it. If the
 *  video had finished, home shows the last visible frame; if the user left
 *  mid-playback, it freezes on that same frame. The video is permanently
 *  muted — no sound controls, no audio at any time.
 *
 *  The video fills the full hero on mobile. On desktop it is a full-height
 *  frame pinned to the top-right corner of the hero — the height fills the
 *  viewport while the width stays at the video's 16:9 size, so the model
 *  stays fully visible on the right side of the screen. */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.volume = 1.0;

    if (heroPlayed) {
      // Don't replay — show the frame where it was left off. Seeking to the
      // exact end makes Chrome show a blank/zero frame, so land just before
      // the end when the video had finished.
      const show = () => {
        if (!video || video.readyState < 1) return;
        const target = heroEnded
          ? Math.max(video.duration - 0.05, 0)
          : Math.min(heroTime, Math.max(video.duration - 0.05, 0));
        if (!Number.isNaN(target)) {
          video.currentTime = target;
          video.pause();
        }
      };
      if (video.readyState >= 1) show();
      else video.addEventListener("loadedmetadata", show, { once: true });
      return;
    }
    heroPlayed = true;

    const play = async () => {
      if (!video || video.ended) return false;
      try {
        await video.play();
        return true;
      } catch {
        return false;
      }
    };

    const onCanPlay = () => {
      video.removeEventListener("canplay", onCanPlay);
      void play();
    };

    if (video.readyState >= 3) {
      void play();
    } else {
      video.addEventListener("canplay", onCanPlay);
    }

    const fallback = setTimeout(() => void play(), 2500);

    return () => {
      clearTimeout(fallback);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  // Remember where the video was when it unmounts — but only while it was
  // actively playing, so the "ended" position stored by handleEnded is never
  // clobbered by a stale/reset currentTime on the unmounting element.
  useEffect(() => {
    const video = ref.current;
    return () => {
      if (!video) return;
      if (!video.paused && !video.ended) heroTime = video.currentTime;
    };
  }, []);

  const handleEnded = () => {
    const video = ref.current;
    if (!video) return;
    heroEnded = true;
    heroTime = video.currentTime;
    video.pause();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center md:items-start md:justify-end overflow-hidden pr-0 md:pr-50 md:bg-cover md:bg-center md:bg-[url('/hero-background.png')]">
      <video
        ref={ref}
        className="h-full w-full object-cover md:h-[100vh] md:w-auto md:max-w-[178vh] md:object-contain md:hero-blend"
        src="/home2-video.mp4"
        playsInline
        preload="auto"
        onEnded={handleEnded}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}