import {growthRequest} from './client';
export interface AppointmentRequest {name:string;email:string;phone?:string;company?:string;service?:string;solution?:string;industry?:string;message?:string;consent:boolean;marketingConsent?:boolean;source:'contact_page'|'book_demo'|'website_enquiry';page:string;details?:Record<string,string|string[]|number|boolean>;website?:string}
export async function submitAppointmentRequest(payload:AppointmentRequest,requestId:string){
 return growthRequest('/api/public/appointment-requests',{method:'POST',body:JSON.stringify({requestId,...payload})});
}
