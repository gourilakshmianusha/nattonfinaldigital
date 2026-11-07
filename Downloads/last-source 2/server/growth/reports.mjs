import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
const printableValue=value=>String(value??'Not available').replace(/\u2212/g,'-').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
export async function generateReport(result,brand='Natton Digital'){
 const printable=value=>{const text=printableValue(value);return result.toolId==='seo_aeo_audit'?text.replace(/[\u2013\u2014]/g,'-').replace(/\u2265/g,'>=').replace(/\u2264/g,'<=').replace(/\u00d7/g,'x'):text;};
 return new Promise((resolve,reject)=>{
  const doc=new PDFDocument({size:'A4',margin:48,bufferPages:true,info:{Title:`${brand} — ${result.toolTitle||result.toolId}`,Author:brand}}),chunks=[];let bytes=0;
  doc.on('data',chunk=>{bytes+=chunk.length;if(bytes>2000000){doc.destroy();reject(new Error('Report exceeded its size limit'));}else chunks.push(chunk);});doc.on('error',reject);doc.on('end',()=>resolve(Buffer.concat(chunks)));
  try{
   const font=path.resolve('assets/fonts/NotoSansDevanagari.ttf');if(fs.existsSync(font))doc.font(font);
   const logo=path.resolve('public/logo-light.png');if(fs.existsSync(logo))doc.image(logo,48,40,{width:160});doc.moveDown(3);
   doc.fillColor('#152648').fontSize(22).text(printable(result.toolTitle||result.toolId));doc.moveDown(.5);doc.fontSize(10).fillColor('#59677c').text(printable(brand));doc.text('Generated: '+printable(result.generatedAt));doc.text('Submission: '+printable(result.requestId));doc.text('Method: '+printable(result.method)+' / '+printable(result.methodologyVersion));if(result.toolId!=='seo_aeo_audit')doc.text('Currency: '+printable(result.currency)+' — amounts are not currency-converted.');
   const heading=label=>{doc.moveDown();doc.fillColor('#152648').fontSize(14).text(label);doc.moveDown(.4);doc.fillColor('#35445a').fontSize(10);};
   heading('Results');for(const m of result.metrics||[])doc.text(printable(m.label)+': '+(m.value===null?(result.toolId==='seo_aeo_audit'?'Unable to calculate: '+printable(m.reason):'Not available'):Number(m.value).toLocaleString('en-IN',{maximumFractionDigits:2}))+' '+printable(m.unit==='currency'?result.currency:m.unit));
   heading('Submitted inputs');for(const [key,value] of Object.entries(result.inputs||{}))doc.text(printable(key)+': '+printable(typeof value==='object'?JSON.stringify(value):value));
   for(const [key,label] of [['methodology','Methodology'],['assumptions','Assumptions'],['warnings','Limitations and warnings'],['recommendations','Recommendations'],['dataSources','Data sources']]){if(!result[key]?.length)continue;heading(label);for(const line of result[key]||[])doc.text('• '+printable(line),{paragraphGap:5});}
   for(const [key,label] of [['scenarios','Scenario comparison'],['cashFlow','Twelve-month cash flow'],['allocations','Budget allocation'],['comparison','One / three / five-year costs'],['labMetrics','Observed Lighthouse metrics']])if(result[key]?.length){heading(label);for(const item of result[key])doc.text(Object.entries(item).map(([k,v])=>printable(k)+': '+printable(typeof v==='number'?Number(v.toFixed(2)):v)).join(' | '),{paragraphGap:6});}
   if(result.readiness){heading('30 / 60 / 90-day plan');for(const step of result.readiness.plan)doc.text(`${step.days} days: ${printable(step.action)}`,{paragraphGap:6});}
   if(result.findings?.length){heading('Observed diagnostic evidence');for(const f of result.findings)doc.text(`${printable(f.severity)} — ${printable(f.issue)}\n${printable(f.evidence)}\n${printable(f.url)}`,{paragraphGap:8});}
   if(result.toolId==='seo_aeo_audit'){
    const auditText=(value,options)=>doc.text(printable(value),options);
    heading('Audit provenance and coverage');
    for(const key of ['auditVersion','observedAt','requestedUrl','finalUrl','methodologyUrl'])auditText(key+': '+printable(result[key]));
    auditText('Coverage: '+JSON.stringify(result.coverage));
    heading('Score calculations');for(const [key,score]of Object.entries(result.scores||{}))auditText(key+': '+JSON.stringify(score),{paragraphGap:5});
    heading('Page evidence and every check');for(const page of result.pages||[]){
     auditText('URL: '+page.url+' / HTTP '+page.httpStatus+' / SHA-256 '+page.contentHash,{paragraphGap:4});
     for(const key of ['requestedUrl','observedAt','redirectChain','rendering','httpEvidence','freshnessEvidence','title','description','canonical','robotsDirectives','headings'])auditText(key+': '+JSON.stringify(page[key]));
     for(const [family,score]of Object.entries(page.scores||{})){auditText(family+': '+(score.value===null?'Unable to calculate: '+score.reason:score.value)+' / earned '+score.earnedWeight+' of '+score.evaluatedWeight);for(const check of score.checks)auditText(JSON.stringify(check),{paragraphGap:3});}
     auditText('Structured data: '+JSON.stringify(page.structuredData),{paragraphGap:8});
    }
    heading('Real visibility and unavailable measurements');auditText(JSON.stringify(result.visibility));
    auditText('AI mentions, citations and Google rich-result eligibility: Not measured unless explicitly evidenced.');
   }
   const pages=doc.bufferedPageRange();for(let i=pages.start;i<pages.start+pages.count;i++){doc.switchToPage(i);const bottom=doc.page.margins.bottom;doc.page.margins.bottom=0;doc.fontSize(8).fillColor('#697587').text(`${brand} | ${i+1} / ${pages.count} | ${result.toolId==='seo_aeo_audit'?'Evidence snapshot; not a ranking.':'Estimates are not guarantees.'}`,48,doc.page.height-30,{lineBreak:false});doc.page.margins.bottom=bottom;}
   doc.end();
  }catch(error){doc.destroy();reject(error);}
 });
}
