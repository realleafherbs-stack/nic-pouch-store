const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);

export type VideoEmbed = { kind: "youtube" | "video"; url: string };

// CRM-authored field, but still untrusted input from the storefront's
// perspective — validate host against an allowlist rather than substring
// matching the raw string, which a crafted URL could slip past.
export function resolveVideoEmbed(url: string | undefined): VideoEmbed | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  return YOUTUBE_HOSTS.has(parsed.hostname)
    ? { kind: "youtube", url: parsed.toString() }
    : { kind: "video", url: parsed.toString() };
}
