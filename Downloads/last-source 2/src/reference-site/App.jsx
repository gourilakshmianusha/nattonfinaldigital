import React,{lazy,Suspense} from 'react';
import HomeRoute,{SharedSiteFrame} from './homepage/homeRoutes.jsx';
import {ResourceRoute,resourceForPath} from './resources/resourceRoutes.jsx';
import {ProductPlatformPage,ProductPlatformDirectory,platformForPath} from './product-platforms/platformRoutes.jsx';
import {useViewportEffects} from './performance/useViewportEffects.js';
import './site-review.css';
import './review/section-density.css';

const ClientCollection=lazy(()=>import('./CollectionPages.jsx'));
let ServerCollection;
export function configureCollectionRenderer(Page){ServerCollection=Page;}
function RouteContent({path}){
 const normalized=path==='/'?'/':path.replace(/\/$/,'')+'/';
 if(normalized==='/'||normalized==='/homepage/')return <HomeRoute/>;
 const resource=resourceForPath(normalized);
 if(resource)return <ResourceRoute key={resource.slug} page={resource}/>;
 const platform=platformForPath(normalized);
 if(platform)return <ProductPlatformPage key={platform.slug} page={platform}/>;
 if(normalized==='/products/platforms/')return <ProductPlatformDirectory/>;
 const Page=import.meta.env.SSR?ServerCollection:ClientCollection;
 return <Suspense fallback={<main className="page-shell"><p>Loading page…</p></main>}><Page path={path}/></Suspense>;
}
export default function App({path='/'}){
 useViewportEffects(path);
 const home=path==='/'||path.replace(/\/$/,'')==='/homepage';
 return home?<RouteContent path={path}/>:<SharedSiteFrame><RouteContent path={path}/></SharedSiteFrame>;
}
