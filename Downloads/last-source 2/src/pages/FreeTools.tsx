import React from 'react';
import PublicTools from '../growth/PublicTools';
import {RoutePath} from '../types';
export default function FreeTools({darkMode}:{setPath:(path:RoutePath)=>void;darkMode:boolean}){return <PublicTools mode="free" darkMode={darkMode}/>;}
