function parts(instant,timezone){const values=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(instant).map(item=>[item.type,item.value]));return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;}
export function utcToLocalInput(value,timezone){const date=new Date(value);if(!Number.isFinite(date.getTime()))throw new Error('Invalid stored time.');return parts(date,timezone);}
export function localInputToUtc(value,timezone){
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))throw new Error('Use a valid local date and time.');
 const desired=Date.parse(value+'Z');if(!Number.isFinite(desired)||new Date(desired).toISOString().slice(0,16)!==value)throw new Error('Use a valid calendar date and time.');
 let candidate=desired;
 for(let i=0;i<4;i++){const represented=Date.parse(parts(new Date(candidate),timezone)+'Z');const difference=desired-represented;if(difference===0)return new Date(candidate).toISOString();candidate+=difference;}
 if(parts(new Date(candidate),timezone)!==value)throw new Error('That local time does not exist in the selected timezone. Choose another time.');return new Date(candidate).toISOString();
}
export function validCalendarDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
