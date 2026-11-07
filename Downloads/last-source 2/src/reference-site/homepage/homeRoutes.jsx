import React,{lazy,Suspense} from 'react';
const ClientHome=lazy(()=>import('./HomePage.jsx'));
const ClientFrame=lazy(()=>import('./HomePage.jsx').then(m=>({default:m.HomeFrame})));
let ServerHome,ServerFrame;
export function configureHomeRenderer(Page,Frame){ServerHome=Page;ServerFrame=Frame;}
export default function HomeRoute(){const Page=import.meta.env.SSR?ServerHome:ClientHome;return <Suspense fallback={<main className="homepage-loading">Loading Natton Digital…</main>}><Page/></Suspense>;}

export function SharedSiteFrame({children}){const Frame=import.meta.env.SSR?ServerFrame:ClientFrame;return <Suspense fallback={<>{children}</>}><Frame>{children}</Frame></Suspense>;}
