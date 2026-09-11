import { env } from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function owner(){const user=await getChatGPTUser();if(!user)throw new ApiError('Entre na sua conta para salvar e abrir os atendimentos.',401);return user.userId;}
export function db(){if(!env.DB)throw new ApiError('Os atendimentos estão indisponíveis no momento. Tente novamente.',503);return env.DB}
export function bucket(){if(!env.BUCKET)throw new ApiError('O envio de fotos está indisponível. Tente novamente.',503);return env.BUCKET}
export class ApiError extends Error{constructor(message:string,public status=400){super(message)}}
export function failure(e:unknown){if(e instanceof ApiError)return Response.json({error:e.message},{status:e.status});console.error('Mapping storage error',e);return Response.json({error:'Não foi possível concluir. Seu trabalho permanece na tela; tente novamente.'},{status:500})}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new ApiError('Origem não autorizada.',403)}
