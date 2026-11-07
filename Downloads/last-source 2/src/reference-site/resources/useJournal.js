import {useEffect,useState} from 'react';
import {loadJournal} from '../../journal-api';
export function useJournal({article='',query='',category='',page=1}={}){
 const[data,setData]=useState({posts:[],total:0,categories:[]}),[loading,setLoading]=useState(true),[error,setError]=useState(''),[refresh,setRefresh]=useState(0);
 useEffect(()=>{let active=true;const run=()=>{setLoading(true);loadJournal({article,q:query,category:category==='All articles'?'':category,page}).then(value=>{if(active){setData(value);setError('');}}).catch(e=>{if(active){setError(e.message||'Articles could not be loaded.');setData({posts:[],total:0,categories:[]});}}).finally(()=>{if(active)setLoading(false);});};
 const timer=setTimeout(run,query?250:0),update=()=>{if(document.visibilityState==='visible')run();};window.addEventListener('focus',update);const interval=setInterval(update,60000);return()=>{active=false;clearTimeout(timer);clearInterval(interval);window.removeEventListener('focus',update);};},[article,query,category,page,refresh]);
 return{...data,loading,error,retry:()=>setRefresh(n=>n+1)};
}
