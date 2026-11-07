import {blogRequest} from './utils/blogService';
import {mapJournalPost} from './blog-content.mjs';
export async function loadJournal(query: {article?:string;q?:string;category?:string;page?:number}={}){
 const params=new URLSearchParams(Object.entries(query).filter(([,value])=>value!==undefined&&value!=='').map(([key,value])=>[key,String(value)]));
 const data=await blogRequest('/posts?'+params);
 if(!Array.isArray(data.rows))throw new Error('The published article list could not be loaded.');
 return{posts:data.rows.map(mapJournalPost),total:Number(data.total)||0,categories:Array.isArray(data.categories)?data.categories:[]};
}
