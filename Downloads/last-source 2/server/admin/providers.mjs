import { ApiError } from './security.mjs';
const references={ga4:'ND_ADMIN_GA4_TOKEN',search_console:'ND_ADMIN_GSC_TOKEN',google_ads:'ND_ADMIN_GOOGLE_ADS_TOKEN',meta_ads:'ND_ADMIN_META_ADS_TOKEN',gohighlevel:'ND_ADMIN_GHL_TOKEN',n8n:'ND_ADMIN_N8N_TOKEN',email:'ND_ADMIN_EMAIL_TOKEN',whatsapp:'ND_ADMIN_WHATSAPP_TOKEN'};
export const supportedSync=new Set(['ga4','search_console','google_ads','meta_ads']);
export const providerEnvironment=()=>process.env.NODE_ENV==='production'?'production':'staging';
export function providerConfigured(record){const provider=record?.body?.provider;const name=references[provider];return !!name&&record?.body?.environment===providerEnvironment()&&record?.status!=='disconnected'&&record.body.secret_ref===name&&!!process.env[name];}
const fail=message=>{throw new ApiError(503,message,'provider_configuration_required');};
const numeric=value=>{if(value===undefined||value===null||value===''||!Number.isFinite(Number(value)))throw new ApiError(502,'Provider returned an unsupported metric value.','provider_format');return Number(value);};
export function dateRange(from,to){const format=/^\d{4}-\d{2}-\d{2}$/;if(!format.test(from||'')||!format.test(to||'')||!Number.isFinite(Date.parse(from))||!Number.isFinite(Date.parse(to))||new Date(from).toISOString().slice(0,10)!==from||new Date(to).toISOString().slice(0,10)!==to||from>to||(Date.parse(to)-Date.parse(from))/86400000>366)throw new ApiError(400,'Choose a valid date range of at most 366 days.');return{from,to};}
export async function runProvider(record,{mode='test',from,to}={},fetcher=fetch){
 const provider=record.body.provider;const ref=references[provider];
 if(record.body.environment!==providerEnvironment())fail(`This server accepts ${providerEnvironment()} connection records only.`);
 if(!ref||record.body.secret_ref!==ref||!process.env[ref]||record.status==='disconnected')fail(`Configure the approved server secret reference ${ref||'for this provider'} before making a read-only request.`);
 const account=String(record.body.account_ref||'');const token=process.env[ref];const observed_at=new Date().toISOString();let currency=null,timezone=null,records=[];
 const query=async(url,{method='GET',body,headers={}}={})=>{
  let response;try{response=await fetcher(url,{method,headers:{Authorization:`Bearer ${token}`,Accept:'application/json',...(body?{'Content-Type':'application/json'}:{}),...headers},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000),redirect:'error'});}catch{throw new ApiError(503,'The provider could not be reached. No connection success was recorded.','provider_unavailable');}
  if(response.status===401)throw new ApiError(502,'The configured provider credential is expired or invalid.','provider_token_expired');
  if(!response.ok)throw new ApiError(502,`The provider denied or failed the read-only request (HTTP ${response.status}). Review the authorised account, scopes, and quota.`, 'provider_request_failed');
  let data;try{data=await response.json();}catch{throw new ApiError(502,'The provider returned an invalid response.','provider_format');}return data;
 };
 const range=mode==='sync'?dateRange(from,to):null;
 if(provider==='ga4'){
  if(!/^(properties\/)?\d+$/.test(account))fail('Use the authorised numeric GA4 property ID as the account reference.');
  const property=account.startsWith('properties/')?account:'properties/'+account;
  const data=await query(`https://analyticsdata.googleapis.com/v1beta/${property}:runReport`,{method:'POST',body:mode==='test'?{dateRanges:[{startDate:'yesterday',endDate:'yesterday'}],metrics:[{name:'sessions'}],limit:1}:{dateRanges:[{startDate:range.from,endDate:range.to}],dimensions:[{name:'date'}],metrics:[{name:'sessions'},{name:'totalUsers'},{name:'keyEvents'}],limit:367,returnPropertyQuota:true}});
  currency=data.metadata?.currencyCode||null;timezone=data.metadata?.timeZone||null;
  if(mode==='sync')records=(data.rows||[]).map(row=>{const value=row.dimensionValues?.[0]?.value;if(!/^\d{8}$/.test(value||''))throw new ApiError(502,'Unexpected GA4 date format.');return{date:`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`,metrics:{sessions:numeric(row.metricValues?.[0]?.value),users:numeric(row.metricValues?.[1]?.value),key_events:numeric(row.metricValues?.[2]?.value)}};});
 }else if(provider==='search_console'){
  if(!/^(https?:\/\/|sc-domain:)/.test(account))fail('Enter the authorised Search Console site URL or sc-domain reference.');
  const base=`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(account)}`;
  if(mode==='test')await query(base);
  else {const data=await query(base+'/searchAnalytics/query',{method:'POST',body:{startDate:range.from,endDate:range.to,dimensions:['date'],rowLimit:1000,dataState:'final'}});records=(data.rows||[]).map(row=>({date:String(row.keys?.[0]||''),metrics:{clicks:numeric(row.clicks),impressions:numeric(row.impressions),ctr:numeric(row.ctr),position:numeric(row.position)}}));}
  timezone='America/Los_Angeles';
 }else if(provider==='google_ads'){
  const customer=account.replaceAll('-','');const version=process.env.ND_ADMIN_GOOGLE_ADS_VERSION;
  if(!/^\d+$/.test(customer)||!/^v\d+$/.test(version||'')||!process.env.ND_ADMIN_GOOGLE_ADS_DEVELOPER_TOKEN)fail('Configure the authorised Google Ads customer ID, API version, and developer token. No new Google project or scope is enabled.');
  const headers={'developer-token':process.env.ND_ADMIN_GOOGLE_ADS_DEVELOPER_TOKEN,...(process.env.ND_ADMIN_GOOGLE_ADS_LOGIN_CUSTOMER_ID?{'login-customer-id':process.env.ND_ADMIN_GOOGLE_ADS_LOGIN_CUSTOMER_ID}:{})};
  const root=`https://googleads.googleapis.com/${version}/customers/${customer}/googleAds:search`;
  const info=await query(root,{method:'POST',headers,body:{query:'SELECT customer.id, customer.currency_code, customer.time_zone FROM customer LIMIT 1'}});currency=info.results?.[0]?.customer?.currencyCode||null;timezone=info.results?.[0]?.customer?.timeZone||null;
  if(mode==='sync'){const data=await query(root,{method:'POST',headers,body:{query:`SELECT segments.date, campaign.id, campaign.name, metrics.cost_micros, metrics.clicks, metrics.conversions FROM campaign WHERE segments.date BETWEEN '${range.from}' AND '${range.to}' ORDER BY segments.date`}});if(data.nextPageToken)throw new ApiError(409,'This report exceeds one provider page; narrow the date range before syncing.','provider_pagination_required');records=(data.results||[]).map(row=>({date:row.segments.date,campaign_id:row.campaign.id,campaign:row.campaign.name,metrics:{spend:numeric(row.metrics.costMicros)/1000000,clicks:numeric(row.metrics.clicks),conversions:numeric(row.metrics.conversions)}}));}
 }else if(provider==='meta_ads'||provider==='whatsapp'){
  const version=process.env.ND_ADMIN_META_GRAPH_VERSION;if(!/^v\d+\.\d+$/.test(version||''))fail('Configure the approved Meta Graph API version before testing this connection.');
  if(!/^(act_)?\d+$/.test(account))fail('Enter the authorised ad account or WhatsApp phone-number ID.');
  const id=provider==='meta_ads'?(account.startsWith('act_')?account:'act_'+account):account;
  const root=`https://graph.facebook.com/${version}/${id}`;
  const info=await query(root+'?fields='+encodeURIComponent(provider==='meta_ads'?'id,currency,timezone_name':'id,display_phone_number'));currency=info.currency||null;timezone=info.timezone_name||null;
  if(mode==='sync'&&provider==='meta_ads'){const params=new URLSearchParams({fields:'date_start,campaign_id,campaign_name,spend,clicks',time_range:JSON.stringify({since:range.from,until:range.to}),time_increment:'1',level:'campaign',limit:'1000'});const data=await query(root+'/insights?'+params);if(data.paging?.next)throw new ApiError(409,'Narrow the date range; this report requires another provider page.','provider_pagination_required');records=(data.data||[]).map(row=>({date:row.date_start,campaign_id:row.campaign_id,campaign:row.campaign_name,metrics:{spend:numeric(row.spend),clicks:numeric(row.clicks)}}));}
 }else if(provider==='gohighlevel'){
  if(!/^[a-zA-Z0-9]{5,100}$/.test(account))fail('Enter the authorised GoHighLevel sub-account ID.');
  const version=process.env.ND_ADMIN_GHL_VERSION;if(!version)fail('Configure the approved GoHighLevel API version.');
  await query(`https://services.leadconnectorhq.com/locations/${account}`,{headers:{Version:version}});
 }else if(provider==='n8n'){
  const raw=process.env.ND_ADMIN_N8N_BASE_URL;if(!raw)fail('Configure the approved n8n server URL.');
  const url=new URL(raw);if(url.protocol!=='https:'||url.username||url.password)fail('The approved n8n URL must use HTTPS without embedded credentials.');
  await query(url.toString().replace(/\/$/,'')+'/api/v1/workflows?limit=1',{headers:{'X-N8N-API-KEY':token,Authorization:''}});
 }else if(provider==='email')await query('https://api.resend.com/domains');
 else fail('No reviewed read-only adapter is available.');
 if(mode==='sync'&&!supportedSync.has(provider))throw new ApiError(400,'This adapter supports a read-only connection test only.');
 return{provider,status:'connected',observed_at,currency,timezone,records,source:'Authorised provider API',attribution:'Provider-reported aggregate metrics. Platform definitions and attribution windows may differ.',range};
}
export function secretReference(provider){return references[provider]||null;}
