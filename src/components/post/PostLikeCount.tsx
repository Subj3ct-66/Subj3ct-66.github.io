import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import {
  fetchLikeCount,
  resolveLikeTargetUrl,
} from "../../utils/postLike";

type Props = {
  pageUrl: string;
  apiURL: string;
  likesLabel: string;
  compact?: boolean;
};

export default function PostLikeCount({
  pageUrl,
  apiURL,
  likesLabel,
  compact = false,
}: Props) {
  const [targetUrl, setTargetUrl] = useState(() => resolveLikeTargetUrl(pageUrl));
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTargetUrl(resolveLikeTargetUrl(pageUrl));
  }, [pageUrl]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLikeCount(apiURL, targetUrl)
      .then((value) => {
        if (active) setCount(value);
      })
      .catch(() => {
        if (active) setCount(0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [apiURL, targetUrl]);

  return (
    <span
      className={`post-like-count-display${compact ? " is-compact" : ""}`}
      aria-label={`${count} ${likesLabel}`}
    >
      <FontAwesomeIcon icon={faHeart} />
      <span>{loading ? "…" : count}</span>
      {!loading && !compact && (
        <span className="post-like-count-label">{likesLabel}</span>
      )}
    </span>
  );
}
