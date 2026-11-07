export async function growthRequest(path:string,options:RequestInit={}) {
 let response:Response;
 try{response=await fetch(path,{...options,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-ND-Request':'admin',...options.headers}});}catch{throw new Error('The tools server could not be reached. Your inputs have been kept.');}
 if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('This host is not serving the tools API. Run or deploy the Node server with the website.');
 const data=await response.json();if(!response.ok){const error:any=new Error(data.error||'The request could not be completed.');error.code=data.code;error.status=response.status;throw error;}return data;
}
