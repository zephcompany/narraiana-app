declare const __GITHUB_PAGES__: boolean;
declare const __APP_BASE__: string;

export const localOnly = typeof __GITHUB_PAGES__ !== 'undefined' && __GITHUB_PAGES__;

export function assetPath(path?: string) {
  if (!path || !localOnly || !path.startsWith('/assets/')) return path;
  return __APP_BASE__.replace(/\/$/, '') + path;
}
