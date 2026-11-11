async function requestJson(path:string,options:RequestInit={}) {
 let response:Response;
 try{response=await fetch(path,{...options,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-ND-Request':'admin',...options.headers}});}catch{throw new Error('The tools server could not be reached. Your inputs have been kept.');}
 if(!response.headers.get('content-type')?.includes('application/json')) {
  const gatewayFailure = response.status >= 500;
  const error:any = new Error(gatewayFailure
   ? 'The website audit server timed out or is temporarily unavailable. Your inputs have been kept. Please retry shortly.'
   : 'The tools request returned a website page instead of API data. The website and API must be deployed together.');
  error.code = gatewayFailure ? 'api_gateway_error' : 'api_routing_error';
  // A gateway may have interrupted a saved run. Preserve its request ID on retry.
  if (!gatewayFailure) error.status = response.status;
  throw error;
 }
 const data=await response.json();if(!response.ok){const error:any=new Error(data.error||'The request could not be completed.');error.code=data.code;error.status=response.status;throw error;}return data;
}


export async function growthRequest(path:string,options:RequestInit={}) {
 const data=await requestJson(path,options);
 if(data.status!=='processing'||!data.submissionId)return data;
 const submissionId=data.submissionId;
 const deadline=Date.now()+5*60*1000;
 while(Date.now()<deadline) {
  await new Promise(resolve=>setTimeout(resolve,2000));
  let saved;
  try {saved=await requestJson('/api/tools/results/'+encodeURIComponent(submissionId),{signal:options.signal});}
  catch(error:any) {
   if(error.code==='api_gateway_error')continue;
   throw error;
  }
  if(saved.status==='completed'&&saved.result)return {...saved,submissionId};
  if(saved.status==='failed') {
   const error:any=new Error('The website audit could not complete. Please try again.');
   error.code='previous_request_failed';error.status=409;throw error;
  }
 }
 const error:any=new Error('Your audit is still running. Keep your inputs and click Run again to check its progress.');
 error.code='audit_pending';throw error;
}
