import React from 'react';
import PublicTools from '../growth/PublicTools';
import {RoutePath} from '../types';
export default function AiReadinessAssessmentPage({darkMode}:{setPath:(path:RoutePath)=>void;darkMode:boolean}){return <PublicTools mode="assessment" darkMode={darkMode}/>;}
