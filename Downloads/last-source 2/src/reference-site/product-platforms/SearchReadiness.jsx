import React from 'react';
import { Search, FileText, PanelTop, ArrowRight, ChartNoAxesCombined } from 'lucide-react';
const seoPhoto='/media/services/seo-services-photo.webp';
import './search-readiness.css';

const steps = [
  { icon: Search, title: 'Understand customer searches', text: 'Find the words and questions people use when looking for your services.' },
  { icon: FileText, title: 'Create helpful, clear pages', text: 'Organise useful answers with clear headings, relevant links, and accurate page information.' },
  { icon: PanelTop, title: 'Review your search appearance', text: 'Prepare a relevant page title and description so people understand what your page offers.' },
];

export default function SearchReadiness() {
  return <><header className="container polish-section-heading"><span className="ex-eyebrow">SEO & SEARCH READINESS</span><h2>Help customers find you.<br /><em>Make every page clearer.</em></h2><p>Turn real customer questions into useful pages with clear titles, helpful answers and relevant links.</p></header><div className="container ex-feature-grid search-readiness">
    <div className="ex-feature-copy">
      <p>We help you understand what customers search for and turn those questions into useful website content. Clear titles, helpful answers, and relevant links make your pages easier for people and search engines to understand.</p>
      <ol className="search-readiness-steps">
        {steps.map(({ icon: Icon, title, text }, index) => <li key={title}>
          <span className="search-readiness-icon"><Icon size={22} aria-hidden="true" /></span>
          <div><span className="search-readiness-number">STEP 0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>
        </li>)}
      </ol>
    </div>
    <figure className="search-readiness-visual">
      <div className="search-readiness-photo">
        <img src={seoPhoto} alt="Laptop displaying website traffic and analytics charts" width={1440} height={960} loading="lazy" />
        <span><ChartNoAxesCombined size={17} aria-hidden="true" />Understand. Improve. Review.</span>
      </div>
      <figcaption>
        <span className="search-readiness-label">HOW A CLEAR PAGE CAN APPEAR IN SEARCH</span>
        <div className="search-readiness-result">
          <div className="search-readiness-address"><span aria-hidden="true"><Search size={17} /></span><div><strong>Your Business</strong><small>yourbusiness.example / services</small></div></div>
          <h3>Digital marketing for your growing business</h3>
          <p>Explore marketing, customer management, and automation services. Find a practical next step for your business.</p>
        </div>
        <div className="search-readiness-flow"><span>Customer question</span><ArrowRight size={14} aria-hidden="true" /><span>Helpful page</span><ArrowRight size={14} aria-hidden="true" /><span>Clear next step</span></div>
        <p className="search-readiness-note">Illustrative search preview. Actual search results may differ.</p>
      </figcaption>
    </figure>
  </div></>;
}
