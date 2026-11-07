export type ResultMethod = 'api_observed' | 'site_heuristic' | 'self_reported_estimate' | 'financial_scenario';
export interface GrowthMetric { label:string; value:number|null; unit:string; annualValue?:number|null }
export interface GrowthResult { toolId:string;requestId:string;generatedAt:string;method:ResultMethod;methodologyVersion:string;currency:string;period:string;inputs:Record<string,unknown>;metrics:GrowthMetric[];assumptions:string[];methodology:string[];warnings:string[];recommendations:string[];dataSources:string[];[key:string]:unknown }
export interface GrowthTool { id:string;title:string;description:string;category:string;enabled:boolean;visible:boolean;display_order:number;revision:number;config:Record<string,any>;availability:{state:string;message:string};[key:string]:any }

export interface GrowthRunRequest { requestId:string; inputs:Record<string,unknown>; website?:string }
export interface GrowthRunResponse { result:GrowthResult; submissionId:string; report:{id:string;status:'ready'|'failed'}|null }
