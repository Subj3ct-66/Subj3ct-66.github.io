import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import {
  fetchLikeCount,
  likeStorageKey,
  resolveLikeTargetUrl,
} from "../../utils/postLike";

type Props = {
  pageUrl: string;
  apiURL: string;
  likeLabel: string;
  likedLabel: string;
  likesLabel: string;
};

export default function PostLikeButton({
  pageUrl,
  apiURL,
  likeLabel,
  likedLabel,
  likesLabel,
}: Props) {
  const [targetUrl, setTargetUrl] = useState(() => resolveLikeTargetUrl(pageUrl));
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const syncUrl = () => {
      setTargetUrl(
        resolveLikeTargetUrl(
          typeof window !== "undefined" ? window.location.pathname : pageUrl
        )
      );
    };

    syncUrl();
    document.addEventListener("astro:page-load", syncUrl);
    return () => document.removeEventListener("astro:page-load", syncUrl);
  }, [pageUrl]);

  const loadState = useCallback(async () => {
    const response = await fetch(
      `${apiURL}?url=${encodeURIComponent(targetUrl)}`
    );
    if (!response.ok) {
      throw new Error("Failed to load likes");
    }
    const data = await response.json();
    setCount(data.count ?? 0);
    setLiked(localStorage.getItem(likeStorageKey(targetUrl)) === "1");
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
        localStorage.setItem(likeStorageKey(targetUrl), "1");
      } else {
        localStorage.removeItem(likeStorageKey(targetUrl));
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
      <span className="post-like-icon">
        <FontAwesomeIcon icon={faHeart} />
      </span>
      <span className="post-like-text">{liked ? likedLabel : likeLabel}</span>
      <span className="post-like-count">
        {count} {likesLabel}
      </span>
    </button>
  );
}
