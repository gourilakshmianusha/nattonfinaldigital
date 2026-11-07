import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHmac } from 'node:crypto';
import { adminModules, can, rolePermissions } from '../../src/admin/modules.mjs';
import { validateRecord, requirePermission, protectMutation, safeCsv, verifySignature } from '../../server/admin/security.mjs';

test('role templates keep HR, sales, publishing, and exports separate',()=>{
 assert.equal(can('marketing_manager','applicants'),false);
 assert.equal(can('marketing_manager','careers'),false);
 assert.equal(can('content_editor','pages','write'),true);
 assert.equal(can('content_editor','pages','publish'),false);
 assert.equal(can('analyst_viewer','analytics'),true);
 assert.equal(can('analyst_viewer','analytics','export'),false);
 assert.equal(can('sales_crm','leads','export'),true);
 assert.equal(can('sales_crm','team','write'),false);
 assert.throws(()=>requirePermission('analyst_viewer','leads'),{status:403});
 for(const module of adminModules)assert.equal(can('super_admin',module.id,'read'),true);
});
test('record validation rejects invalid and privileged input',()=>{
 assert.throws(()=>validateRecord('pages',{title:'Bad route',body:{slug:'admin/login'}}),{status:400});
 assert.throws(()=>validateRecord('leads',{title:'Name',body:{email:'bad'}}),{status:400});
 assert.throws(()=>validateRecord('settings',{title:'Secrets',body:{feature_flags:{api_key:'do-not-store'}}}),{status:400});
 assert.throws(()=>validateRecord('pages',{title:'A page',status:'published',body:{slug:'safe',cta_url:'javascript:alert(1)'}}),{status:400});
 assert.throws(()=>validateRecord('pages',{title:'A page',body:{slug:'safe',sections:'not JSON'}}),{status:400});
 assert.throws(()=>validateRecord('appointments',{title:'Call',status:'pending',body:{email:'test@example.invalid',owner_id:'11111111-1111-4111-8111-111111111111',timezone:'Asia/Kolkata',starts_at:'2027-01-01T10:00:00Z',ends_at:'2027-01-01T09:00:00Z'}}),{status:400});
 const record=validateRecord('leads',{title:'Synthetic test',status:'new',body:{email:'test@example.invalid',unknown_field:'ignored'},role:'super_admin'});
 assert.equal(record.body.unknown_field,undefined);assert.equal(record.role,undefined);
});
test('CSRF equivalent requires same-origin custom-header mutations',()=>{
 const req={method:'POST',protocol:'http',headers:{origin:'http://localhost:3000','x-nd-request':'admin'},get:()=> 'localhost:3000'};
 assert.doesNotThrow(()=>protectMutation(req));
 assert.throws(()=>protectMutation({...req,headers:{origin:'https://evil.invalid','x-nd-request':'admin'}}),{status:403});
 assert.throws(()=>protectMutation({...req,headers:{origin:'http://localhost:3000'}}),{status:403});
});
test('CSV values cannot execute spreadsheet formulas',()=>{
 const csv=safeCsv([{title:'=CMD()',body:{email:'+value'}}],['title','email']);
 assert.ok(csv.includes("'=CMD()"));assert.ok(csv.includes("'+value"));
});
test('webhook signatures use HMAC and reject tampering',()=>{
 const body='1700000000.{"synthetic":true}';const key='test-only-signing-key';const signature=createHmac('sha256',key).update(body).digest('hex');
 assert.equal(verifySignature(body,signature,key),true);assert.equal(verifySignature(body+'tampered',signature,key),false);assert.equal(verifySignature(body,'bad',key),false);
});
test('proposed migration is collision-guarded, additive and enables RLS on every new table',()=>{
 const sql=fs.readFileSync('supabase/proposals/20261102_nd_admin_v1_additive.sql','utf8');
 assert.ok(sql.includes('namespace collision'));
 assert.doesNotMatch(sql,/\b(?:DROP|TRUNCATE)\s+(?:TABLE|POLICY|FUNCTION|TRIGGER)|ALTER TABLE public\.blog_|UPDATE auth\.|INSERT INTO auth\./i);
 const tables=[...sql.matchAll(/CREATE TABLE public\.(nd_admin_v1_\w+)/g)].map(match=>match[1]);
 for(const table of tables)assert.ok(sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),table);
 assert.doesNotMatch(sql,/GRANT\s+(?:ALL|SELECT|INSERT|UPDATE|DELETE)[^;]*ON public\.nd_admin_v1_[^;]*TO anon/);
 assert.ok(sql.includes('p_user=auth.uid()'));assert.ok(sql.includes('pg_advisory_xact_lock'));assert.ok(sql.includes('nd_admin_v1_consents WHERE slug=p_body'));
 assert.ok(sql.includes("OLD.status='approved'"));assert.ok(sql.includes("NEW.status<>'draft'"));
 assert.ok(sql.includes("REVOKE ALL ON FUNCTION public.nd_admin_v1_ingest_lead(text,jsonb) FROM PUBLIC,anon,authenticated"));
});

test('local date conversion preserves selected timezone and rejects nonexistent times',async()=>{
 const {localInputToUtc,utcToLocalInput}=await import('../../src/admin/time.mjs');
 assert.equal(localInputToUtc('2026-11-02T10:00','Asia/Kolkata'),'2026-11-02T04:30:00.000Z');
 assert.equal(utcToLocalInput('2026-11-02T04:30:00Z','Asia/Kolkata'),'2026-11-02T10:00');
 assert.throws(()=>localInputToUtc('2026-02-31T10:00','Asia/Kolkata'));
 assert.throws(()=>localInputToUtc('2026-03-08T02:30','America/New_York'));
});

test('core design-token text pairs meet normal text contrast',()=>{
 const luminance=hex=>{const rgb=hex.replace('#','').match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
 const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 for(const [foreground,background]of [['#172440','#f4f7fb'],['#65728a','#ffffff'],['#ffffff','#5d65ed'],['#17785f','#eaf8f2'],['#8a6510','#fff8e5'],['#6650b2','#f1edff']])assert.ok(contrast(foreground,background)>=4.5,foreground+' on '+background);
});
