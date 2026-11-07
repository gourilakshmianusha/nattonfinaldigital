import {STEPS,STOP_PROGRESS} from './journey.js';
export const FRAME_COUNT=193;
export const CAMERA_STOPS=STEPS.map((s,i)=>i===0?0:s.group===1?1+s.localIndex/12*1.2:s.group===2?3+s.localIndex/7*1.2:5+s.localIndex);
export function cameraPositionAt(p){
  const value=Math.max(0,Math.min(1,p));
  for(let i=0;i<STOP_PROGRESS.length-1;i++)if(value<=STOP_PROGRESS[i+1]){const t=(value-STOP_PROGRESS[i])/(STOP_PROGRESS[i+1]-STOP_PROGRESS[i]);return CAMERA_STOPS[i]+(CAMERA_STOPS[i+1]-CAMERA_STOPS[i])*t;}
  return 8;
}
export const frameAt=p=>Math.max(0,Math.min(FRAME_COUNT-1,cameraPositionAt(p)/8*(FRAME_COUNT-1)));
