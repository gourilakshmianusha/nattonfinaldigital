export function auditCsv(result){
 const rows=[['section','url','name','status','value','evidence','version','observed_at']];
 const add=(section,url,name,status,value,evidence)=>rows.push([section,url,name,status,value==null?'Unable to calculate':typeof value==='object'?JSON.stringify(value):value,typeof evidence==='string'?evidence:JSON.stringify(evidence??''),result.auditVersion,result.observedAt]);
 for(const [key,score]of Object.entries(result.scores||{}))add('score',result.requestedUrl,key,score.status,score.value,score);
 add('coverage',result.requestedUrl,'coverage',result.coverage?.complete?'complete':'partial',result.coverage?.inspected,result.coverage);
 for(const record of [...(result.coverage?.urlRecords||[]),...(result.coverage?.resources||[])])add('url',record.url,record.kind||'page',record.status,record.httpStatus,record);
 for(const page of result.pages||[]){add('page',page.url,'HTTP/HTML evidence','measured',page.httpStatus,page);for(const [family,score]of Object.entries(page.scores||{}))for(const check of score.checks)add(family,page.url,check.label,check.status,check.observed,check);for(const item of page.structuredData?.items||[])add('schema',page.url,item.types.join(', '),item.validity,item.properties,item);}
 for(const [key,value]of Object.entries(result.visibility||{}))add('visibility',result.requestedUrl,key,value.status,value.metrics||null,value);
 return rows.map(row=>row.map(value=>{let text=String(value??'');if(/^\s*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}).join(',')).join('\r\n');
}
