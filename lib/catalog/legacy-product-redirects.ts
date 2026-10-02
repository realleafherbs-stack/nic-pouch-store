import redirects from "@/redirects.json";

type ProductRedirect = {
  source: string;
  destination: string;
  statusCode: number;
};

const redirectBySource = new Map(
  (redirects as ProductRedirect[]).map(({ source, destination }) => [source, destination]),
);

/**
 * Resolves a historic product URL to its current semantic product URL.
 * The redirect file stores Unicode paths percent-encoded, whereas Next may
 * provide the incoming pathname decoded, so normalize both representations.
 */
export function legacyProductRedirectDestination(pathname: string): string | null {
  return redirectBySource.get(pathname)
    ?? redirectBySource.get(encodeURI(pathname))
    ?? null;
}
