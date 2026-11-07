// Keep the supplied original untouched; remove its branding bands for the hero derivative.
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const dir='public/media/ten-pages/growth-os';
const run=args=>{const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);};
run(['-i',`${dir}/growthos-hero-original.mp4`,'-vf',"delogo=x=448:y=456:w=46:h=46:enable='lt(t,12.6)',delogo=x=1028:y=862:w=180:h=34:enable='gte(t,49)',crop=1920:740:0:175,scale=1280:494,pad=1280:720:0:113:color=0x110b33",'-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',`${dir}/growthos-background-clean.mp4`]);
const frame=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','2','-i',`${dir}/growthos-background-clean.mp4`,'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'],{maxBuffer:10*1024*1024});
if(frame.status!==0)throw Error(frame.stderr.toString());
await sharp(frame.stdout).webp({quality:88}).toFile(`${dir}/growthos-background-poster.webp`);
console.log('Clean GrowthOS background video and poster prepared.');
