import React,{lazy,Suspense} from 'react';
import definitions from './definitions.json';
const ClientPage=lazy(()=>import('./ProductPlatforms.jsx').then(m=>({default:m.ProductPlatformPage})));
const ClientDirectory=lazy(()=>import('./ProductPlatforms.jsx').then(m=>({default:m.ProductPlatformDirectory})));
let serverRenderers={};
export function configurePlatformRenderers(renderers){serverRenderers=renderers;}
export function platformForPath(path){return definitions.find(page=>page.path===path);}
export function ProductPlatformPage(props){const Page=import.meta.env.SSR?serverRenderers.Page:ClientPage;return <Suspense fallback={<div className="page-shell platform-loading">Loading product workspace…</div>}><Page {...props}/></Suspense>;}
export function ProductPlatformDirectory(){const Page=import.meta.env.SSR?serverRenderers.Directory:ClientDirectory;return <Suspense fallback={<div className="page-shell platform-loading">Loading products…</div>}><Page/></Suspense>;}
