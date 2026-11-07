// Schedule graphics only while something has changed or is still settling.
export function createFrameScheduler({draw,isActive,request=requestAnimationFrame,cancel=cancelAnimationFrame}){
 let pending=null,disposed=false;
 const invalidate=()=>{if(!disposed&&pending===null&&isActive())pending=request(t=>{pending=null;if(!disposed&&isActive()&&draw(t))invalidate();});};
 const pause=()=>{if(pending!==null){cancel(pending);pending=null;}};
 return{invalidate,pause,destroy(){disposed=true;pause();}};
}
