import React,{useState} from 'react';

export const marketingWorkspaceNames={
 'marketing-brief':'Northline · Marketing brief',
 'marketing-content':'Content & creative review',
 'marketing-search':'SEO, AEO & GEO · Page checks',
 'marketing-ads':'Campaign preparation',
 'marketing-reviews':'Customer feedback & response',
 'marketing-leads':'Enquiry qualification & ownership',
 'marketing-results':'Campaign-to-follow-up record'
};
function Status({children,pending=false}){return <span className={'sx-status sx-status-'+(pending?'amber':'green')}>{children}</span>;}
function Pair({label,children}){return <div className="sx-record-row"><span>{label}</span><strong>{children}</strong></div>;}
function Table({headers,rows}){return <div className="sx-data-table"><table><thead><tr>{headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;}

export default function MarketingWorkspace({type}){
 const[changed,setChanged]=useState(false);
 const action=(before,after,note)=><div className="sx-preview-actions"><span aria-live="polite">{note}</span><button type="button" aria-pressed={changed} onClick={()=>setChanged(!changed)}>{changed?after:before} ↗</button></div>;
 if(type==='marketing-brief')return <div className="sx-marketing-record"><div className="sx-document-title">Northline · Headphone launch</div><Pair label="Audience">Daily commuters</Pair><Pair label="Offer">Foldable headphones · Product demonstration</Pair><Pair label="Inputs">Approved product brief + customer questions</Pair><Pair label="Journey">Product page → Enquiry → Sales follow-up</Pair><div className="sx-document-note">Content, search, campaigns and customer response share the same brief.</div></div>;
 if(type==='marketing-content')return <div className="sx-marketing-record"><div className="sx-draft-meta"><span>Product introduction · Social draft</span><Status pending={!changed}>{changed?'Approved example':'For brand review'}</Status></div><div className="sx-draft-copy">Sound for the everyday journey.<p>Meet Northline’s foldable headphones. View the product details and ask our team about a demonstration.</p></div><Pair label="Source">Approved product brief · Foldable design</Pair><Pair label="Related assets">Product page · Email · Social variation</Pair>{action('Approve sample copy','Reset example',changed?'Ready for the publishing owner. Nothing sent.':'Check tone and product facts before release.')}</div>;
 if(type==='marketing-search')return <div className="sx-marketing-record"><div className="sx-document-title">Product page · Answer and source checks</div><Table headers={['Customer question','Source','Next step']} rows={[
  ['Does it fold?','Product brief','Add a clear answer'],
  ['What is the battery life?','Not supplied','Ask the product team'],
  ['Can I request a demo?','Enquiry form','Check the contact route']
 ]}/><Pair label="Page foundations">Indexing · Internal links · Accurate page information</Pair><div className="sx-document-note">SEO supports discovery. AEO and GEO focus on answer and AI-search visibility. These checks do not predict a citation.</div></div>;
 if(type==='marketing-ads')return <div className="sx-marketing-record"><div className="sx-document-title">One offer · Channel-specific assets</div><Table headers={['Channel','Asset','Destination']} rows={[
  ['Google Search','Product-demo message','Product page'],
  ['Meta','Commuter creative','Campaign page'],
  ['Email','Product introduction','Demo enquiry']
 ]}/>{changed&&<div className="sx-marketing-checklist"><Pair label="Before launch">Budget owner · Account access · Form test</Pair><Pair label="Measurement">Source tag + Demo enquiry event</Pair></div>}{action('Show launch checklist','Hide checklist','Assets are examples. Publishing access is scoped separately.')}</div>;
 if(type==='marketing-reviews')return <div className="sx-marketing-record"><div className="sx-draft-meta"><span>Customer feedback · Example</span><Status pending={!changed}>{changed?'Follow-up assigned':'Needs service follow-up'}</Status></div><div className="sx-message received">The headphones arrived, but the charging cable was missing.</div><div className="sx-message drafted"><span>RESPONSE DRAFT</span>Please contact our support team with your order reference so we can check the missing item.</div><Pair label="Team action">{changed?'Support owner: Neha · Check order contents':'Check order details before deciding the resolution'}</Pair>{action('Create sample follow-up','Reset example',changed?'A service task is recorded. The public reply is still a draft.':'Separate the public response from the service action.')}</div>;
 if(type==='marketing-leads')return <div className="sx-marketing-record"><div className="sx-draft-meta"><span>Demo enquiry · Amit Chauhan</span><Status pending={!changed}>{changed?'Assigned to Priya':'Needs an owner'}</Status></div><Pair label="Requirement">Headphone demonstrations for a ten-person team</Pair><Pair label="Source">Product campaign · Enquiry form</Pair><Pair label="Qualification reason">Requirement stated + Product-demo request</Pair><Pair label="Next action">{changed?'Priya to confirm demonstration availability':'Review fit and assign the sales follow-up'}</Pair><div className="sx-document-note">An explainable rule-based example. No predictive score or confirmed sale is implied.</div>{action('Assign sample enquiry','Reset example',changed?'Owner and next action recorded locally.':'Only the useful customer context follows the handover.')}</div>;
 return <div className="sx-marketing-record"><Table headers={['Workstream','Example result','Next responsibility']} rows={[
  ['Content','Draft assets prepared','Brand review'],
  ['Search','Question gaps recorded','Confirm product facts'],
  ['Campaign','Assets and page connected','Approve release'],
  ['Feedback','Service question identified','Support follow-up'],
  ['Enquiry','Requirement and source captured','Sales response']
 ]}/><div className="sx-document-note">Review the work completed and the next responsibility. These are illustrative records, not client performance.</div></div>;
}
