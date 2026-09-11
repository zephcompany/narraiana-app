import {projectSchema} from './project-validation';
import type {Project} from './mapping-data';

type SavedProject = Project & {updatedAt: string};
type SavedPhoto = {id: string; blob: Blob};
let database: Promise<IDBDatabase> | undefined;
const urls = new Map<string, string>();

function storageError(error?: DOMException | null) {
  return new Error(error?.name === 'QuotaExceededError'
    ? 'O armazenamento deste navegador está cheio. Libere espaço e tente salvar novamente.'
    : 'Não foi possível acessar seus atendimentos neste navegador. Verifique se o armazenamento está permitido.');
}

function openDatabase() {
  if (!database) {
    database = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') { reject(storageError()); return; }
      const request = indexedDB.open('narraiana-mapping-atelier', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('photos', {keyPath: 'id'});
        request.result.createObjectStore('projects', {keyPath: 'id'});
      };
      request.onerror = () => reject(storageError(request.error));
      request.onblocked = () => reject(new Error('Feche outras abas do atelier e tente novamente.'));
      request.onsuccess = () => {
        request.result.onversionchange = () => { request.result.close(); database = undefined; };
        resolve(request.result);
      };
    }).catch(error => { database = undefined; throw error; });
  }
  return database;
}

async function transact<T>(store: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(store, mode);
    const request = action(transaction.objectStore(store));
    let result: T;
    request.onsuccess = () => { result = request.result; };
    transaction.oncomplete = () => resolve(result);
    transaction.onabort = () => reject(storageError(transaction.error || request.error));
    transaction.onerror = () => reject(storageError(transaction.error || request.error));
  });
}

export async function localPhotoUrl(id: string): Promise<string> {
  if (urls.has(id)) return urls.get(id)!;
  const photo = await transact<SavedPhoto | undefined>('photos', 'readonly', store => store.get(id));
  if (!photo) throw new Error('Foto não encontrada neste navegador. Envie a foto novamente.');
  if (!urls.has(id)) urls.set(id, URL.createObjectURL(photo.blob));
  return urls.get(id)!;
}

export async function localApi(url: string, init?: RequestInit): Promise<any> {
  const method = init?.method || 'GET';
  if (url === '/api/photos' && method === 'POST') {
    const blob = init?.body;
    if (!(blob instanceof Blob) || !['image/jpeg', 'image/png', 'image/webp'].includes(blob.type) || !blob.size || blob.size > 10 * 1024 * 1024) {
      throw new Error('Escolha uma imagem JPG, PNG ou WEBP de até 10 MB.');
    }
    const id = crypto.randomUUID();
    await transact('photos', 'readwrite', store => store.add({id, blob}));
    return {id};
  }
  if (url === '/api/projects' && method === 'POST') {
    const raw = init?.body;
    if (typeof raw !== 'string' || raw.length > 1500000) throw new Error('O projeto atingiu o limite de marcações.');
    const parsed = projectSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Revise os dados da ficha.');
    const photo = await transact<SavedPhoto | undefined>('photos', 'readonly', store => store.get(parsed.data.photoId));
    if (!photo) throw new Error('Envie novamente a foto da cliente.');
    const updatedAt = new Date().toISOString();
    await transact('projects', 'readwrite', store => store.put({...parsed.data, updatedAt}));
    return {id: parsed.data.id, updatedAt};
  }
  if (url === '/api/projects' && method === 'GET') {
    const projects = await transact<SavedProject[]>('projects', 'readonly', store => store.getAll());
    return {projects: projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(({id, client, photoId, stage, updatedAt}) => ({id, client, photoId, stage, updatedAt}))};
  }
  if (/^\/api\/projects\/[a-f0-9-]+$/.test(url) && method === 'GET') {
    const project = await transact<SavedProject | undefined>('projects', 'readonly', store => store.get(url.split('/').pop()!));
    if (!project) throw new Error('Atendimento não encontrado neste navegador.');
    return {project};
  }
  throw new Error('Esta operação não está disponível.');
}
