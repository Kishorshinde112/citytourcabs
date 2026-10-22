export type CmsRedirect = {
  source?: string | null;
  destination?: string | null;
  permanent?: boolean | null;
};

export function normalizeRedirectPath(value: string | null | undefined): string {
  let path = String(value || '').trim();
  if (!path) return '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path;
}

/** Find an exact-match CMS redirect; skip self-redirects to avoid loops. */
export function findCmsRedirect(pathname: string, redirects: CmsRedirect[] = []): CmsRedirect | null {
  const path = normalizeRedirectPath(pathname);

  for (const redirect of redirects) {
    if (!redirect?.source || !redirect?.destination) continue;
    if (normalizeRedirectPath(redirect.source) !== path) continue;
    if (normalizeRedirectPath(redirect.destination) === path) continue;
    return redirect;
  }

  return null;
}
