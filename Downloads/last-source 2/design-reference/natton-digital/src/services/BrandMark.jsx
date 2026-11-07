import React from 'react';

const names={instagram:'Instagram','facebook-f':'Facebook','x-twitter':'X','reddit-alien':'Reddit',threads:'Threads','linkedin-in':'LinkedIn',google:'Google',wordpress:'WordPress',shopify:'Shopify',meta:'Meta',youtube:'YouTube',whatsapp:'WhatsApp'};
export function BrandMark({brand,label=false,className=''}){
 return <span className={`real-brand brand-${brand} ${className}`} title={names[brand]||brand}><span className="brand-symbol"><img src={`/media/brands/${brand}.svg`} alt={names[brand]||brand} width="32" height="32"/></span>{label&&<span className="brand-name">{names[brand]||brand}</span>}</span>;
}
export function GoogleWordmark({className=''}){return <img className={`google-wordmark ${className}`} src="/media/brands/google-wordmark.png" alt="Google" width="544" height="184"/>;}
