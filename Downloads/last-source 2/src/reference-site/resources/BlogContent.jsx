import React from 'react';
import {safeBlogUrl} from '../../blog-content.mjs';
function Inline({text}){
 return String(text||'').split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g).filter(Boolean).map((part,i)=>{
  if(part.startsWith('**')&&part.endsWith('**'))return <strong key={i}>{part.slice(2,-2)}</strong>;
  if(part.startsWith('`')&&part.endsWith('`'))return <code key={i}>{part.slice(1,-1)}</code>;
  const match=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/),href=match&&safeBlogUrl(match[2]);
  return href?<a key={i} href={href} rel={href.startsWith('http')?'noopener noreferrer':undefined}>{match[1]}</a>:<React.Fragment key={i}>{part}</React.Fragment>;
 });
}
export default function BlogContent({blocks}){return <section>{blocks.map((block,i)=>block.type==='heading'?<h2 key={i}><Inline text={block.text}/></h2>:block.type==='list'?block.ordered?<ol key={i}>{block.items.map((item,j)=><li key={j}><Inline text={item}/></li>)}</ol>:<ul key={i}>{block.items.map((item,j)=><li key={j}><Inline text={item}/></li>)}</ul>:block.type==='table'?<div key={i} className="resource-table-scroll"><table><thead><tr>{block.columns.map((value,j)=><th key={j} scope="col"><Inline text={value}/></th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((value,k)=><td key={k}><Inline text={value}/></td>)}</tr>)}</tbody></table></div>:<p key={i} style={{whiteSpace:'pre-line'}}><Inline text={block.text}/></p>)}</section>;}
