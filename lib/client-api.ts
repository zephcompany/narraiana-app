import {localOnly} from './platform';

export async function api(url: string, init?: RequestInit) {
  if (localOnly) return (await import('./local-store')).localApi(url, init);
  const response = await fetch(url, init);
  const data: any = await response.json().catch(() => ({error: 'Não foi possível conectar. Tente novamente.'}));
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir.');
  return data;
}

export async function photoUrl(id: string): Promise<string> {
  if (localOnly) return (await import('./local-store')).localPhotoUrl(id);
  return `/api/photos/${id}`;
}
