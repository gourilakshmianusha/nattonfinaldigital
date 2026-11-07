import products from './products.json';
import industries from './industries.json';
export {products,industries};
export const CONTACT='/contact/';
export const SITE_URL=(import.meta.env.VITE_SITE_URL||'https://natton-products-industries.abhijitdivate63.chatgpt.site').replace(/\/$/,'');
export const allPages=[...products,...industries];
export function pageForPath(path){const normal=path==='/'?'/':path.replace(/\/$/,'')+'/';return allPages.find(p=>p.path===normal);}
