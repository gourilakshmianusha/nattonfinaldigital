import React,{useEffect,useState} from 'react';
import {Icon} from '../ui.jsx';

export const solutionFilms={
 'growth-os':{src:'/media/growthos-hero-original.mp4',poster:'/media/growthos-poster.webp',duration:63,title:'GrowthOS',description:'Your business, your audience, your next priority. A connected strategy explained.'},
 'business-os':{file:'businessos',duration:58,title:'BusinessOS',description:'From the first enquiry to a shared record, a responsible owner and a recorded result.'},
 'agentic-os':{file:'agenticos',duration:82,title:'AgenticOS',description:'See specialist agents coordinate research, conversations and business tasks, with review at the right steps.'},
 'ai-marketing-platform':{file:'ai-marketing',duration:84,title:'AI Marketing Platforms',description:'Follow the work across content, search visibility, campaigns, customer feedback and enquiry follow-up.'}
};

export const filmTime=seconds=>`${Math.floor(Math.max(0,seconds||0)/60)}:${String(Math.floor(Math.max(0,seconds||0)%60)).padStart(2,'0')}`;

export default function SolutionFilm({slug,videoRef,expanded,onRequestReveal}){
 const film=solutionFilms[slug];
 const[playing,setPlaying]=useState(false),[current,setCurrent]=useState(0),[duration,setDuration]=useState(film.duration),[ready,setReady]=useState(false),[error,setError]=useState('');
 const src=film.src||'/media/films/'+film.file+'-hero.mp4';
 useEffect(()=>{
  const video=videoRef.current;
  const syncMetadata=()=>{if(Number.isFinite(video.duration)){setDuration(video.duration);setReady(true);}};
  const pauseWhenHidden=()=>{if(document.hidden)video.pause();};
  // Metadata can already be cached before hydration attaches React's event handlers.
  syncMetadata();video.addEventListener('loadedmetadata',syncMetadata);video.addEventListener('durationchange',syncMetadata);
  document.addEventListener('visibilitychange',pauseWhenHidden);
  return()=>{video.removeEventListener('loadedmetadata',syncMetadata);video.removeEventListener('durationchange',syncMetadata);document.removeEventListener('visibilitychange',pauseWhenHidden);};
 },[videoRef]);
 const toggle=()=>{const video=videoRef.current;if(video.paused){video.play().catch(()=>setError('Press the video’s play control to start playback.'));}else video.pause();};
 const skip=delta=>{const video=videoRef.current;if(!Number.isFinite(video.duration))return;video.currentTime=Math.min(video.duration,Math.max(0,video.currentTime+delta));setCurrent(video.currentTime);};
 return <figure className="solution-film" data-film={slug}>
  <div className="solution-film-frame">
   <video id={slug+'-hero-video'} ref={videoRef} src={src} poster={film.poster||'/media/films/'+film.file+'-poster.webp'} controls muted playsInline preload="metadata" width="1920" height="1080" tabIndex="0" aria-label={film.title+' film, '+film.duration+' seconds'+(film.file?'. Explanatory subtitles included.':'.')}
    onLoadedMetadata={()=>{setDuration(videoRef.current.duration);setReady(true);}}
    onTimeUpdate={()=>{setCurrent(videoRef.current.currentTime);if(!ready&&Number.isFinite(videoRef.current.duration)){setDuration(videoRef.current.duration);setReady(true);}}}
    onPlay={()=>{setPlaying(true);setError('');onRequestReveal();}}
    onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}
    onError={()=>setError('The film could not load. You can download it using the link below.')}>
    {film.file&&<track kind="captions" src={'/media/films/'+film.file+'-captions.vtt'} srcLang="en" label="English"/>}
    Your browser cannot play this film. <a href={src}>Download the {film.title} film</a>.
   </video>
  </div>
  <div className="solution-film-toolbar" role="group" aria-label={film.title+' playback controls'} hidden={!expanded}>
   <div className="solution-film-buttons">
    <button type="button" onClick={()=>skip(-5)} disabled={!ready} aria-label="Rewind 5 seconds"><span aria-hidden="true">−5<span>s</span></span></button>
    <button type="button" className="solution-film-toggle" onClick={toggle} aria-label={(playing?'Pause ':'Play ')+film.title+' video'}><Icon name={playing?'pause':'play'}/><span>{playing?'Pause':'Play'}</span></button>
    <button type="button" onClick={()=>skip(5)} disabled={!ready} aria-label="Forward 5 seconds"><span aria-hidden="true">+5<span>s</span></span></button>
   </div>
   <output aria-label="Playback time" aria-live="off">{filmTime(current)} <span>/ {filmTime(duration)}</span></output>
  </div>
  {error&&<p className="solution-film-error" role="status">{error} <a href={src}>Download film ↗</a></p>}
  <figcaption hidden={!expanded}><span>{film.title} / {filmTime(film.duration)}</span><p>{film.description}</p><span>Illustrative workflow · Example data</span></figcaption>
 </figure>;
}
