import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

type Props = {
  pageUrl: string;
  apiURL: string;
  likeLabel: string;
  likedLabel: string;
  likesLabel: string;
};

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    let path = parsed.pathname + parsed.search + parsed.hash;
    if (path === "/") path = "";
    return parsed.hostname.replace(/^www\./, "") + path;
  } catch {
    return url;
  }
}

function storageKey(url: string) {
  return `blog-like-${url}`;
}

export default function PostLikeButton({
  pageUrl,
  apiURL,
  likeLabel,
  likedLabel,
  likesLabel,
}: Props) {
  const [targetUrl, setTargetUrl] = useState(() => normalizeUrl(pageUrl));
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTargetUrl(normalizeUrl(window.location.href));
    }
  }, []);

  const loadState = useCallback(async () => {
    const response = await fetch(
      `${apiURL}?url=${encodeURIComponent(targetUrl)}`
    );
    if (!response.ok) {
      throw new Error("Failed to load likes");
    }
    const data = await response.json();
    setCount(data.count ?? 0);
    setLiked(localStorage.getItem(storageKey(targetUrl)) === "1");
  }, [apiURL, targetUrl]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadState()
      .catch(() => {
        if (active) {
          setCount(0);
          setLiked(false);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadState]);

  const handleToggle = async () => {
    if (submitting || loading) return;

    setSubmitting(true);
    const action = liked ? "unlike" : "like";
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const data = await response.json();
      const nextLiked = action === "like";
      setCount(data.count ?? 0);
      setLiked(nextLiked);
      if (nextLiked) {
        localStorage.setItem(storageKey(targetUrl), "1");
      } else {
        localStorage.removeItem(storageKey(targetUrl));
      }
    } catch {
      await loadState();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      className={`post-like-button${liked ? " is-liked" : ""}`}
      aria-pressed={liked}
      aria-label={liked ? likedLabel : likeLabel}
      disabled={loading || submitting}
      onClick={handleToggle}
    >
      <FontAwesomeIcon icon={faHeart} />
      <span className="post-like-text">{liked ? likedLabel : likeLabel}</span>
      <span className="post-like-count">
        {count} {likesLabel}
      </span>
    </button>
  );
}
