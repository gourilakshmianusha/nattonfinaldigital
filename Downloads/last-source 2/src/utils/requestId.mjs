/** UUID v4 for request deduplication, including browsers without randomUUID. */
export function createRequestId(provider=globalThis.crypto) {
 if(typeof provider?.randomUUID==='function')return provider.randomUUID();
 if(typeof provider?.getRandomValues!=='function')throw new Error('Secure browser randomness is unavailable. Open the website over HTTPS in an updated browser and try again.');
 const bytes=new Uint8Array(16);provider.getRandomValues(bytes);
 bytes[6]=(bytes[6]&0x0f)|0x40;bytes[8]=(bytes[8]&0x3f)|0x80;
 const hex=Array.from(bytes,byte=>byte.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
