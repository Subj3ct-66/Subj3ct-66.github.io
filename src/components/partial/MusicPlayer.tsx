import { useEffect, useRef } from "react";

const APLAYER_JS =
  "https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js";
const APLAYER_CSS =
  "https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css";
const METING_JS = "https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js";

const PLAYER_OVERRIDE_CSS = `
.aplayer.aplayer-fixed {
  max-width: var(--aplayer-max-width, calc(var(--aplayer-pic-size, 100px) * 4)) !important;
  z-index: 150 !important;
}
.aplayer.aplayer-fixed .aplayer-body {
  max-width: var(--aplayer-max-width, calc(var(--aplayer-pic-size, 100px) * 4)) !important;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
  width: var(--aplayer-pic-size, 100px) !important;
}
.aplayer.aplayer-narrow .aplayer-body,
.aplayer.aplayer-narrow .aplayer-pic {
  width: var(--aplayer-pic-size, 100px) !important;
  height: var(--aplayer-pic-size, 100px) !important;
}
.aplayer .aplayer-pic {
  width: var(--aplayer-pic-size, 100px) !important;
  height: var(--aplayer-pic-size, 100px) !important;
}
.aplayer:not(.aplayer-fixed) .aplayer-info {
  height: var(--aplayer-pic-size, 100px) !important;
  margin-left: var(--aplayer-pic-size, 100px) !important;
  padding-top: 16px !important;
}
.aplayer.aplayer-fixed .aplayer-info {
  height: var(--aplayer-pic-size, 100px) !important;
}
.aplayer .aplayer-title {
  font-size: 16px !important;
}
.aplayer .aplayer-author {
  font-size: 13px !important;
}
.aplayer.aplayer-fixed .aplayer-icon-back,
.aplayer.aplayer-fixed .aplayer-icon-forward,
.aplayer.aplayer-fixed .aplayer-icon-play {
  bottom: var(--aplayer-icon-bottom, calc(var(--aplayer-pic-size, 100px) * 0.4)) !important;
}
`;

type AudioItem = {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc?: string;
};

type AplayerOptions = {
  fixed?: boolean;
  autoplay?: boolean;
  loop?: "all" | "one" | "none";
  order?: "list" | "random";
  preload?: "auto" | "metadata" | "none";
  volume?: number;
  mutex?: boolean;
  listFolded?: boolean;
  lrcType?: number;
  theme?: string;
  audio?: AudioItem[];
};

type MetingOptions = {
  server?: string;
  type?: string;
  id?: string;
  auto?: string | boolean;
};

type Props = {
  variant?: "fixed" | "sidebar";
  useMeting: boolean;
  metingOptions: MetingOptions;
  metingApi?: string;
  aplayerOptions: AplayerOptions;
};

let assetsPromise: Promise<void> | null = null;
let playerReady = false;

function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadPlayerOverrides() {
  let style = document.getElementById("aplayer-custom-overrides");
  if (!style) {
    style = document.createElement("style");
    style.id = "aplayer-custom-overrides";
    document.head.appendChild(style);
  }
  style.textContent = PLAYER_OVERRIDE_CSS;
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function loadAssets(useMeting: boolean) {
  if (assetsPromise) return assetsPromise;
  assetsPromise = (async () => {
    loadStylesheet(APLAYER_CSS);
    loadPlayerOverrides();
    await loadScript(APLAYER_JS);
    if (useMeting) {
      await loadScript(METING_JS);
    }
  })();
  return assetsPromise;
}

function toKebab(key: string) {
  return key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function applyAplayerAttributes(
  element: HTMLElement,
  options: AplayerOptions,
  variant: "fixed" | "sidebar"
) {
  const merged = {
    ...options,
    fixed: variant === "fixed" ? true : options.fixed ?? false,
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (key === "audio" || value === undefined) return;
    element.setAttribute(toKebab(key), String(value));
  });
}

export default function MusicPlayer({
  variant = "fixed",
  useMeting,
  metingOptions,
  metingApi,
  aplayerOptions,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || playerReady) return;

    let cancelled = false;

    const init = async () => {
      await loadAssets(useMeting);
      if (cancelled || !containerRef.current) return;

      if (useMeting) {
        const metingApiTarget = (window as typeof window & {
          MetingJSElement?: { api?: string };
        }).MetingJSElement;

        if (metingApi && metingApiTarget) {
          metingApiTarget.api = metingApi;
        }

        const meting = document.createElement("meting-js");
        Object.entries(metingOptions).forEach(([key, value]) => {
          if (value === undefined) return;
          meting.setAttribute(key, String(value));
        });
        applyAplayerAttributes(meting, aplayerOptions, variant);
        container.appendChild(meting);
      } else {
        const APlayer = (window as typeof window & { APlayer?: new (options: Record<string, unknown>) => unknown }).APlayer;
        if (!APlayer) return;

        new APlayer({
          container,
          ...aplayerOptions,
          fixed: variant === "fixed" ? true : aplayerOptions.fixed ?? false,
        });
      }

      playerReady = true;
    };

    init().catch(() => {
      playerReady = false;
    });

    return () => {
      cancelled = true;
    };
  }, [aplayerOptions, metingApi, metingOptions, useMeting, variant]);

  return (
    <div
      ref={containerRef}
      className={`music-player music-player-${variant}`}
    />
  );
}
