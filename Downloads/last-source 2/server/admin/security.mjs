import { createHmac, timingSafeEqual } from 'node:crypto';
import { can, moduleById } from '../../src/admin/modules.mjs';
export class ApiError extends Error { constructor(status,message,code='request_failed'){super(message);this.status=status;this.code=code;} }
export function requirePermission(role,module,action='read') { if(!can(role,module,action))throw new ApiError(403,'Your role does not permit this action.','forbidden'); }
export function protectMutation(req) {
 if(['GET','HEAD','OPTIONS'].includes(req.method))return;
 const origin=req.headers.origin;
 const expected=process.env.ADMIN_ORIGIN || `${req.protocol}://${req.get('host')}`;
 if((origin && origin!==expected)||req.headers['x-nd-request']!=='admin')throw new ApiError(403,'Request origin could not be verified.','invalid_origin');
}
const limits=new Map();
export function rateLimit(key,maximum=30,windowMs=60000) {
 const now=Date.now();let entry=limits.get(key);
 if(!entry||entry.expires<now){entry={count:0,expires:now+windowMs};limits.set(key,entry);}
 if(++entry.count>maximum)throw new ApiError(429,'Too many requests. Please wait before trying again.','rate_limited');
 if(limits.size>10000)for(const [key,value]of limits)if(value.expires<now)limits.delete(key);
}
export const isUUID=value=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));
export function validateRecord(module,input) {
 const spec=moduleById[module];if(!spec?.table)throw new ApiError(404,'Module not found.');
 if(!input||typeof input!=='object'||Array.isArray(input))throw new ApiError(400,'A record is required.');
 const title=String(input.title||'').trim();if(!title||title.length>240)throw new ApiError(400,'Name must contain 1–240 characters.');
 const status=String(input.status||spec.statuses?.[0]||'draft');if(!spec.statuses?.includes(status))throw new ApiError(400,'Choose a valid status.');
 const body={};
 for(const field of spec.fields){let value=input.body?.[field.key];
  if(field.required&&!(module==='appointments'&&['requested','cancelled','no_show'].includes(status)&&['owner_id','starts_at','ends_at'].includes(field.key))&&(value===undefined||value===null||String(value).trim()===''))throw new ApiError(400,`${field.label} is required.`);
  if(value===undefined||value===null||value==='')continue;
  if(field.type==='checkbox')value=!!value;
  else if(field.type==='number'){value=Number(value);if(!Number.isFinite(value)||value<0)throw new ApiError(400,`${field.label} must be a non-negative number.`);}
  else if(field.type==='json'){if(typeof value==='string'){try{value=JSON.parse(value);}catch{throw new ApiError(400,`${field.label} must be valid JSON.`);}}if(typeof value!=='object'||value===null)throw new ApiError(400,`${field.label} must contain a JSON object or array.`);}
  else {value=String(value).trim();if(value.length>(field.type==='textarea'?100000:2000))throw new ApiError(400,`${field.label} is too long.`);
   if(field.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw new ApiError(400,'Enter a valid email address.');
   if(field.type==='url'){let parsed;try{parsed=new URL(value);}catch{throw new ApiError(400,`${field.label} must be an HTTP or HTTPS URL.`);}if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new ApiError(400,`${field.label} must be an HTTP(S) URL without embedded credentials.`);}
   if(field.type==='time'&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))throw new ApiError(400,`${field.label} must be a valid local time.`);
   if(field.type==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value))throw new ApiError(400,`${field.label} must be a valid calendar date.`);
   if(field.type==='datetime-local'){if(!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)||!Number.isFinite(Date.parse(value)))throw new ApiError(400,`${field.label} must be a valid time.`);value=new Date(value).toISOString();}
   if(field.options&&!field.options.includes(value))throw new ApiError(400,`Invalid ${field.label.toLowerCase()}.`);
  }
  body[field.key]=value;
 }
 // Secrets cannot be submitted through a general configuration form.
 if(/"(?:password|access_token|refresh_token|api_key|service_role_key|client_secret)"\s*:/i.test(JSON.stringify(body)))throw new ApiError(400,'Store secrets in server configuration; enter only a reference here.');
 if(body.cta_url&&!/^(\/[^/]|https?:\/\/)/.test(body.cta_url))throw new ApiError(400,'Use a site path or HTTP(S) URL for the button.');
 const slug=body.slug||input.slug||null;
 if(slug&&(!/^[a-z0-9][a-z0-9/-]{0,199}$/.test(slug)||/^(admin|api|assets)(\/|$)/.test(slug)||slug.includes('//')))throw new ApiError(400,'Use a unique lowercase public slug outside reserved paths.');
 if(spec.content&&status==='scheduled'&&(!body.scheduled_at||Date.parse(body.scheduled_at)<=Date.now()))throw new ApiError(400,'Choose a future publication time.');
 if(body.brand_color&&!/^#[0-9a-f]{6}$/i.test(body.brand_color))throw new ApiError(400,'Use a six-digit hexadecimal brand colour.');
 if(body.timezone){try{new Intl.DateTimeFormat('en',{timeZone:body.timezone}).format();}catch{throw new ApiError(400,'Use a valid IANA timezone.');}}
 if(module==='appointments'&&Date.parse(body.ends_at)<=Date.parse(body.starts_at))throw new ApiError(400,'The end time must follow the start time.');
 if(module==='availability'&&body.ends_local<=body.starts_local)throw new ApiError(400,'Availability must end after it starts on the same local day.');
 if(module==='appointments'&&Number(body.buffer_minutes||0)>240)throw new ApiError(400,'Buffer cannot exceed 240 minutes.');
 const owner=body.owner_id||null;if(owner&&!isUUID(owner))throw new ApiError(400,'Owner must be an existing user UUID.');
 return {title,status,slug,body,owner_id:owner};
}
export function safeCsv(rows,fields) {
 const cell=value=>{let s=typeof value==='object'?JSON.stringify(value):String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
 return [fields.map(cell).join(','),...rows.map(row=>fields.map(key=>cell(row[key]??row.body?.[key])).join(','))].join('\r\n');
}
export function verifySignature(body,signature,key) {
 if(!signature||!key)return false;
 const expected=createHmac('sha256',key).update(body).digest('hex');
 const a=Buffer.from(signature),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b);
}
