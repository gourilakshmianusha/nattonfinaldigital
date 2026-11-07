import React from 'react';
import PublicTools from '../growth/PublicTools';
import {RoutePath} from '../types';
export default function Tools({toolType,darkMode}:{toolType:'assessment'|'roi-calculator';setPath:(path:RoutePath)=>void;darkMode:boolean}){return <PublicTools mode={toolType==='assessment'?'assessment':'roi'} darkMode={darkMode}/>;}
