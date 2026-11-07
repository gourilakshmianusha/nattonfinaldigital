import { createClient } from '@supabase/supabase-js';
import { adminWorkspaceUrl, adminWorkspacePublicKey } from './workspace.mjs';
import { ApiError } from './security.mjs';
export const prefix='nd_admin_v1_';
export function connection() {
 const url=(process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL||adminWorkspaceUrl).trim().replace(/\/$/,'');
 let parsed;try{parsed=new URL(url);}catch{throw new ApiError(503,'SUPABASE_URL is invalid. Check the server environment settings.','database_configuration');}
 const configuredKey=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||process.env.VITE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_ANON_KEY;
 const key=configuredKey?.trim()||(url===adminWorkspaceUrl?adminWorkspacePublicKey:null);
 if(!key)throw new ApiError(503,'The configured Supabase URL needs its matching publishable key in the server environment.','database_configuration');
 if(key.startsWith('sb_secret_'))throw new ApiError(503,'Configure a public Supabase key for user-scoped authentication, not a secret key.','database_configuration');
 // Legacy JWTs carry their project and role; reject mixed credentials before a request.
 if(key.startsWith('eyJ')){let claims;try{claims=JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString());}catch{throw new ApiError(503,'The configured Supabase public key is invalid.','database_configuration');}
  if(claims.role!=='anon'||(parsed.hostname.endsWith('.supabase.co')&&claims.ref!==parsed.hostname.split('.')[0]))throw new ApiError(503,'Supabase URL and public key do not match. Check the server environment settings.','database_configuration');
 }
 return {url,key};
}
export const client = (token,service=false) => {const {url,key}=connection();const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;if(service&&!serviceKey)throw new ApiError(503,'Secure lead ingestion is not configured.','ingestion_not_configured');return createClient(url,service?serviceKey:key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:token?{headers:{Authorization:`Bearer ${token}`}}:{}});};
export function dbError(error) {
 if(!error)return;
 if(['PGRST301','PGRST302','PGRST303'].includes(error.code)||/invalid api key|invalid jwt|jwt expired/i.test(error.message||''))throw new ApiError(503,'Supabase rejected the connection credentials. Check the URL and matching public key in the host’s server environment, then redeploy.','database_configuration');
 if(error.code==='42P01'||error.code==='PGRST205'||error.code==='42883'||error.code==='PGRST202')throw new ApiError(503,'The new admin database objects are not installed. Complete the reviewed additive setup first.','setup_required');
 if(error.code==='42501')throw new ApiError(403,'Database permissions denied this operation.','forbidden');
 if(error.code==='23505')throw new ApiError(409,'A record already uses that slug, email, or unique identifier.','conflict');
 if(error.code==='P0001')throw new ApiError(409,error.message,'workflow_conflict');
 if(error.code==='23503')throw new ApiError(409,'A referenced record is missing or is still in use.','reference_conflict');
 throw new ApiError(503,'The database request could not be completed. Check the existing project connection.','database_unavailable');
}
export function cookies(req){return Object.fromEntries(String(req.headers.cookie||'').split(';').map(s=>s.trim().split(/=(.*)/s)).filter(parts=>parts.length>1).map(([key,value])=>[key,decodeURIComponent(value)]));}
const cookieOptions=()=>({httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/api/admin'});
export function setSession(res,session){res.cookie('nd_admin_access',session.access_token,{...cookieOptions(),maxAge:session.expires_in*1000});res.cookie('nd_admin_refresh',session.refresh_token,{...cookieOptions(),maxAge:7*86400000});}
export function clearSession(res){for(const name of ['nd_admin_access','nd_admin_refresh'])res.clearCookie(name,cookieOptions());}
export async function session(req,res,{membership=true}={}) {
 const jar=cookies(req);let token=jar.nd_admin_access;
 let auth=client();let user;let assurance;
 if(token){const result=await auth.auth.getUser(token);user=result.data?.user;}
 if(!user&&jar.nd_admin_refresh){const result=await auth.auth.refreshSession({refresh_token:jar.nd_admin_refresh});if(result.data?.session){setSession(res,result.data.session);token=result.data.session.access_token;user=result.data.user;}}
 if(!user)throw new ApiError(401,'Please sign in to continue.','unauthenticated');
 const payload=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());assurance=payload.aal;
 const verified=user.factors?.filter(f=>f.status==='verified')||[];
 if(verified.length&&assurance!=='aal2')throw new ApiError(401,'Complete your configured multi-factor authentication.','mfa_required');
 const db=client(token);if(!membership)return{db,user,token};
 const {data,error}=await db.from(prefix+'memberships').select('role_id,active').eq('user_id',user.id).maybeSingle();dbError(error);
 if(!data?.active)throw new ApiError(403,'This account has no active membership in the new admin workspace.','membership_required');
 return {db,user,token,role:data.role_id};
}
