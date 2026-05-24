import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

import covers from "../covers";

/** Assign cover by list position (cycles through covers.ts). */
export function coverForIndex(index: number): string | null {
  if (!covers.length) return null;
  return covers[((index % covers.length) + covers.length) % covers.length];
}

/** Assign cover by stable string key (e.g. category name). */
export function coverForKey(key: string): string | null {
  if (!covers.length) return null;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return covers[hash % covers.length];
}

let sortedPosts: CollectionEntry<"blog">[] | null = null;

export async function getSortedBlogPosts() {
  if (!sortedPosts) {
    const posts = await getCollection("blog");
    sortedPosts = posts.sort(
      (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );
  }
  return sortedPosts;
}

export function postListIndex(
  posts: CollectionEntry<"blog">[],
  id: string
): number {
  const index = posts.findIndex((p) => p.id === id);
  return index >= 0 ? index : 0;
}

export async function postCoverForEntry(
  post: CollectionEntry<"blog">
): Promise<string | null> {
  if (post.data.cover) return post.data.cover;
  const posts = await getSortedBlogPosts();
  return coverForIndex(postListIndex(posts, post.id));
}
