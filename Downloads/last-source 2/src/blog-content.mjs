/** Canonical Markdown shared by the admin editor and public journal. */
export function articleMarkdown(article){
 const lines=[];
 const cell=value=>String(value).replaceAll('|','\\|').replaceAll('\n',' ');
 for(const section of article.sections||[]){
  lines.push('## '+section.title,'',...(section.paragraphs||[]).flatMap(p=>[p,'']));
  if(section.items)lines.push(...section.items.map(item=>'- '+item),'');
  if(section.table)lines.push('| '+section.table.columns.map(cell).join(' | ')+' |','| '+section.table.columns.map(()=> '---').join(' | ')+' |',...section.table.rows.map(row=>'| '+row.map(cell).join(' | ')+' |'),'');
  if(section.source)lines.push('[Source: Google Search Central]('+section.source+')','');
 }
 if(article.related)lines.push('[Explore the next step]('+article.related+')');
 return lines.join('\n').trim();
}
export function safeBlogUrl(value,{image=false}={}){
 const url=String(value||'').trim();
 if(/^\/(?!\/|\\)/.test(url)&&!/[\u0000-\u0020\\]/.test(url))return url;
 try{const parsed=new URL(url);return /^https?:$/.test(parsed.protocol)&&!parsed.username&&!parsed.password?parsed.href:'';}catch{return '';}
}
export function blogBlocks(markdown){
 const lines=String(markdown||'').split(/\r?\n/),blocks=[];
 const cells=line=>line.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(cell=>cell.trim().replaceAll('\\|','|'));
 for(let i=0;i<lines.length;){const line=lines[i];if(!line.trim()){i++;continue;}
  if(/^#{1,6}\s/.test(line)){blocks.push({type:'heading',text:line.replace(/^#+\s/,'')});i++;continue;}
  if(line.includes('|')&&/^\s*\|?[\s:|-]+\|\s*$/.test(lines[i+1]||'')){const columns=cells(line),rows=[];i+=2;while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){rows.push(cells(lines[i]));i++;}blocks.push({type:'table',columns,rows});continue;}
  if(/^[-*]\s|^\d+\.\s/.test(line)){const ordered=/^\d+\./.test(line),items=[];while(i<lines.length&&(ordered?/^\d+\.\s/:/^[-*]\s/).test(lines[i]))items.push(lines[i++].replace(/^(?:[-*]|\d+\.)\s/,''));blocks.push({type:'list',ordered,items});continue;}
  const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^#{1,6}\s|^[-*]\s|^\d+\.\s/.test(lines[i])&&!(lines[i].includes('|')&&/^\s*\|?[\s:|-]+\|\s*$/.test(lines[i+1]||'')))paragraph.push(lines[i++]);blocks.push({type:'paragraph',text:paragraph.join('\n')});
 }
 return blocks;
}
export function mapJournalPost(row){
 const body=row.body||{},content=String(body.body||'');const cta=content.match(/(?:^|\n)\[Explore the next step\]\(([^)]+)\)\s*$/);let image=safeBlogUrl(body.hero_image,{image:true});if(image.startsWith('https://nattondigital.com/media/'))image=image.slice('https://nattondigital.com'.length);
 return{id:row.id,slug:row.slug||row.id,title:row.title,summary:body.summary||'',category:body.category||'Insights',author:body.author||'Natton Digital',image,alt:body.alt_text||'',readTime:`${Math.max(1,Math.ceil(content.split(/\s+/).filter(Boolean).length/220))} min read`,content,related:cta?safeBlogUrl(cta[1]):'',blocks:blogBlocks(cta?content.slice(0,cta.index):content),metaTitle:body.meta_title||row.title,metaDescription:body.meta_description||body.summary||'',updatedAt:row.updated_at};
}
export function journalPostSeed(article){return{title:article.title,slug:article.slug,body:{slug:article.slug,summary:article.summary,body:articleMarkdown(article),hero_image:article.image?.startsWith('/')?'https://nattondigital.com'+article.image:article.image,alt_text:article.title+' — illustrative working scene',author:'Natton Digital',category:article.category,tags:'',meta_title:article.title+' | Natton Digital',meta_description:article.summary,canonical:'https://nattondigital.com/blog/'+article.slug+'/'}};}
