import React from 'react';
function inline(text: string): React.ReactNode[] {
 return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|\/(?!\/))[^)\s]+\))/g).filter(Boolean).map((part, index) => {
  if(part.startsWith('**')&&part.endsWith('**'))return <strong key={index}>{part.slice(2,-2)}</strong>;
  if(part.startsWith('`')&&part.endsWith('`'))return <code key={index}>{part.slice(1,-1)}</code>;
  const link=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(link)return <a key={index} href={link[2]} className="text-primary underline" rel={link[2].startsWith('http')?'noreferrer':undefined}>{link[1]}</a>;
  return part;
 });
}
export default function SafeTextContent({ text, className='' }: {text:string;className?:string}) {
 const blocks:React.ReactNode[]=[];const lines=String(text||'').split('\n');let index=0;
 while(index<lines.length){const line=lines[index];if(!line.trim()){index++;continue;}
  if(/^#{1,3}\s/.test(line)){const level=line.match(/^#+/)![0].length;blocks.push(level===3?<h3 key={index} className="font-display text-xl font-semibold">{inline(line.replace(/^#+\s/,''))}</h3>:<h2 key={index} className="font-display text-2xl font-bold text-[#110B33]">{inline(line.replace(/^#+\s/,''))}</h2>);index++;continue;}
  if(/^[-*]\s/.test(line)){const start=index,items:React.ReactNode[]=[];while(index<lines.length&&/^[-*]\s/.test(lines[index])){items.push(<li key={index}>{inline(lines[index].replace(/^[-*]\s/,''))}</li>);index++;}blocks.push(<ul key={start} className="list-disc space-y-2 pl-6">{items}</ul>);continue;}
  if(/^\d+\.\s/.test(line)){const start=index,items:React.ReactNode[]=[];while(index<lines.length&&/^\d+\.\s/.test(lines[index])){items.push(<li key={index}>{inline(lines[index].replace(/^\d+\.\s/,''))}</li>);index++;}blocks.push(<ol key={start} className="list-decimal space-y-2 pl-6">{items}</ol>);continue;}
  blocks.push(<p key={index} className="whitespace-pre-wrap leading-relaxed">{inline(line)}</p>);index++;
 }
 return <div className={`nd-safe-content space-y-5 ${className}`}>{blocks}</div>;
}
