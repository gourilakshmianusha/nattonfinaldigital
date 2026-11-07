import ServiceWorkbench from '../review/ServiceWorkbench.jsx';
import React from 'react';
import {BrandMark,GoogleWordmark} from './BrandMark.jsx';
import {useMotionRegion} from '../motion.jsx';

export function visualFor(page,title,kind='features'){
 const text=title.toLowerCase();
 const benefitExamples={
  'Professional first impression':'web','Long-term control':'workflow',
  'Reliable business information':'profile','Stronger local discovery':'local','Customer confidence':'review',
  'Budget visibility':'tracking','Actionable optimisation':'ad',
  'Consistency':'calendar','Brand recognition':'brand','Better learning':'tracking',
  'Creative learning':'brand','Clearer explanations':'document','Reusable knowledge':'knowledge',
  'Consistent facts':'knowledge','Search-readiness':'audit','Production speed':'workflow',
  'Professional presentation':'brand','Relevant messages':'document','Measurable engagement':'tracking',
  'Easier shopping':'shop','Fewer checkout barriers':'journey','Operational control':'workflow',
  'Efficient spend':'ad','Less manual follow-up':'workflow',
 };
 if(kind==='benefits'&&benefitExamples[title])return benefitExamples[title];
 if(/on.page|structured data|metadata|page title/.test(text))return 'metadata';
 if(/authority|backlink|citations|editorial mentions/.test(text))return 'knowledge';
 if(page.motif==='local'&&/review|confidence|trust/.test(text))return 'review';
 if(page.motif==='local'&&/information|details|category|consistency/.test(text))return 'profile';
 if(/buying|decision|navigation|usability|customer journey|customer experience/.test(text))return 'journey';
 if(/enquir|conversion|lead capture|forms|sales enquiry|customer action|contact/.test(text))return 'enquiry';
 if(/calendar|publishing|schedule/.test(text))return 'calendar';
 if(/audit|technical|crawl|schema|index|quality|security|testing|check/.test(text))return 'audit';
 if(/report|measur|analytic|tracking|performance|attribution|metric/.test(text))return 'tracking';
 if(/profile|local|map|nearby|location/.test(text))return 'local';
 if(/email|subscriber|segmen|welcome|nurtur|deliverability|follow.up/.test(text))return 'email';
 if(/e.commerce|ecommerce|checkout|store|catalog|payment|product/.test(text))return 'shop';
 if(/design|creative|branding|visual|asset/.test(text))return 'brand';
 if(/copy|content|article|editor|brief|writing|blog|tone|message/.test(text))return 'document';
 if(/keyword|intent|query|search|answer|discover|visibility|authority|link/.test(text))return page.motif==='knowledge'?'knowledge':'search';
 if(/social|community|audience|engagement|channel/.test(text))return 'social';
 if(/ads|advertis|campaign|budget|bid|target|paid/.test(text))return 'ad';
 if(/automation|workflow|integration|handover|approval|responsib|scope|plan|strategy/.test(text))return 'workflow';
 return ({search:'search',web:'web',local:'local',ads:'ad',social:'social',content:'document',knowledge:'knowledge',creative:'brand',email:'email',shop:'shop',analytics:'tracking',ai:'workflow'})[page.motif]||'document';
}
function BrowserBar(){return <div className="mini-browser-bar"><i/><i/><i/><span/></div>;}
function SearchVisual(){return <div className="visual-search"><GoogleWordmark/><div className="mini-query"><span>your service + your city</span><i/></div><div className="mini-search-row row-one"><span>Your business</span><strong>Relevant services. A clear next step.</strong><i/><i/></div><div className="mini-search-row row-two"><span>Helpful information</span><i/><i/></div><span className="demo-cursor"/></div>;}
function JourneyVisual(){return <div className="visual-journey"><div className="journey-browser"><BrowserBar/><span className="mini-image-block"/><strong>What you need to know</strong><span className="mini-answer-line"/><span className="mini-answer-line short"/></div><span className="journey-arrow">→</span><div className="journey-next"><span className="mini-status-dot"/><strong>Ready to enquire</strong><span className="mini-action">Contact the team</span></div></div>;}
function EnquiryVisual(){return <div className="visual-enquiry"><div className="mini-form"><strong>New enquiry</strong><span>Your name<i/></span><span>How can we help?<i/></span><span className="mini-action">Send enquiry <b>→</b></span></div><div className="enquiry-received"><span className="received-check">✓</span><strong>Received</strong><span>Ready for follow-up</span></div></div>;}
function LocalVisual(){return <div className="visual-local"><div className="mini-map"><i className="road road-a"/><i className="road road-b"/><i className="road road-c"/><span className="mini-map-pin"/><span className="map-ripple"/></div><div className="mini-local-card"><GoogleWordmark/><strong>Your business, nearby</strong><span>Details · Photos · Directions</span><div><i/><i/><i/></div></div></div>;}
function SocialVisual(){return <div className="visual-social"><div className="mini-social-post"><div className="social-post-top"><i/><span>Brand update</span></div><div className="social-post-picture"/><span className="mini-answer-line"/><span className="mini-answer-line short"/></div><div className="mini-platforms">{['instagram','facebook-f','x-twitter','threads'].map((brand,i)=><BrandMark brand={brand} key={brand} className={`social-platform-${i}`}/>)}</div></div>;}
function AdVisual(){return <div className="visual-ad"><div className="mini-ad-header"><GoogleWordmark/><span>Sponsored</span></div><strong>Your offer in the right search</strong><span className="mini-answer-line"/><span className="mini-answer-line short"/><div className="ad-journey"><span>Search</span><i/><span>Landing page</span><i/><span>Enquiry</span></div></div>;}
function DocumentVisual(){return <div className="visual-document"><div className="document-tabs"><span>Brief</span><span>Draft</span><span>Review</span></div><div className="document-paper"><strong>Useful answers. Clear context.</strong><span className="document-highlight"/><i/><i/><i/><span className="document-review">Reviewed by your team <b>✓</b></span></div></div>;}
function AuditVisual(){return <div className="visual-audit"><BrowserBar/><div><span>Page structure</span><b>✓</b></div><div><span>Search access</span><b>✓</b></div><div><span>Customer journey</span><b>✓</b></div><span className="audit-scan"/></div>;}
function TrackingVisual(){return <div className="visual-tracking"><div className="tracking-header"><GoogleWordmark/><span>Customer actions</span></div><div className="tracking-lane"><span><i/>Website visit</span><span><i/>Enquiry received</span><span><i/>Team follow-up</span></div><div className="tracking-event"><span className="mini-status-dot"/>A useful next step, recorded</div></div>;}
function EmailVisual(){return <div className="visual-email"><div className="email-compose"><span>To: your customer</span><strong>A useful next step</strong><i/><i/><div className="mini-action">Review & send <b>↗</b></div></div><span className="email-delivered"><b>✓</b> Follow-up ready</span></div>;}
function BrandVisual(){return <div className="visual-brand"><div className="brand-paper"><strong>Aa</strong><span>Brand direction</span></div><div className="brand-colours"><i/><i/><i/><i/></div><div className="brand-formats"><span>Web</span><span>Print</span><span>Social</span></div></div>;}
function ShopVisual(){return <div className="visual-shop"><div className="mini-product"><div className="product-shape"/><strong>Product details</strong><span className="mini-answer-line"/></div><div className="shop-checkout"><BrandMark brand="shopify"/><span>Browse → Choose</span><strong>A clearer checkout</strong><span className="mini-action">Continue <b>→</b></span></div></div>;}
function CalendarVisual(){return <div className="visual-calendar"><div className="calendar-week">{['M','T','W','T','F','S','S'].map((d,i)=><span key={i}>{d}</span>)}</div><div className="calendar-schedule">{Array.from({length:14},(_,i)=><i key={i} className={[2,5,9,11].includes(i)?'has-content':''}/>)}</div><div className="calendar-post"><BrandMark brand="instagram"/><span>Approved & ready</span><b>✓</b></div></div>;}
function KnowledgeVisual(){return <div className="visual-knowledge"><div className="knowledge-question">What does your customer need to know?</div><div className="knowledge-answer"><strong>A clear, sourced answer</strong><i/><i/><div><span>Website</span><span>Reference</span><span>Review ✓</span></div></div></div>;}
function WorkflowVisual(){return <div className="visual-workflow"><div><span className="workflow-person">01</span><strong>Prepare</strong><i/></div><div><span className="workflow-person">02</span><strong>Team review</strong><i/></div><div><span className="workflow-person">03</span><strong>Next action</strong><b>✓</b></div></div>;}
function WebVisual(){return <div className="visual-web"><div className="mini-desktop"><BrowserBar/><div><span className="mini-image-block"/><span><i/><i/><b/></span></div></div><div className="mini-responsive-phone"><i/><span/><b/></div></div>;}
function ProfileVisual(){return <div className="visual-profile"><div className="profile-header"><GoogleWordmark/><span>Business information</span></div><div><span>Business name</span><i/><b>✓</b></div><div><span>Opening hours</span><i/><b>✓</b></div><div><span>Contact details</span><i/><b>✓</b></div></div>;}
function ReviewVisual(){return <div className="visual-review"><div className="review-example"><span className="mini-person-photo"/><div><strong>Customer feedback</strong><i/><i/></div></div><div className="review-team-reply"><span>↳</span><div><strong>A thoughtful team response</strong><i/><span>Reviewed before posting ✓</span></div></div></div>;}
function MetadataVisual(){return <div className="visual-metadata"><div className="metadata-field"><span>Page title</span><strong>Your service, clearly explained</strong></div><div className="metadata-field"><span>Description</span><i/><i/></div><div className="metadata-preview"><span>Content and search information aligned</span><b>✓</b></div></div>;}
const visuals={search:SearchVisual,journey:JourneyVisual,enquiry:EnquiryVisual,local:LocalVisual,social:SocialVisual,ad:AdVisual,document:DocumentVisual,audit:AuditVisual,tracking:TrackingVisual,email:EmailVisual,brand:BrandVisual,shop:ShopVisual,calendar:CalendarVisual,knowledge:KnowledgeVisual,workflow:WorkflowVisual,web:WebVisual,profile:ProfileVisual,review:ReviewVisual,metadata:MetadataVisual};
export default function ServiceVisual({page,title,kind,small=false}){return <ServiceWorkbench page={page} title={title} type={visualFor(page,title,kind)} small={small}/>;}
