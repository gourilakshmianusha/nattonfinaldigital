import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { adminModules } from '../../src/admin/modules.mjs';
let ui;
const output=path.resolve('tests/admin/.ui-fixture-bundle.mjs');
test.before(async()=>{
 await build({stdin:{contents:"export { Login, AppShell } from './src/admin/AdminApplication.tsx'; export { parseLeadCsv } from './src/admin/LeadImport.tsx'; export { default as SafeTextContent } from './src/components/SafeTextContent.tsx';",resolveDir:process.cwd()},outfile:output,bundle:true,packages:'external',format:'esm',platform:'node',jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env.PROD':'false'}});
 ui=await import(pathToFileURL(output));
});
test.after(()=>{if(fs.existsSync(output))fs.unlinkSync(output);});
test('login is an accessible real form and contains no demo credential hints',()=>{
 const html=renderToStaticMarkup(React.createElement(ui.Login,{onSignedIn:()=>{}}));
 assert.ok(html.includes('type="email"'));assert.match(html,/autocomplete="current-password"/i);assert.ok(html.includes('data-skip-global-lead-sync="true"'));assert.ok(html.includes('Show password'));assert.ok(!html.includes('admin / password'));assert.ok(!html.includes('Default credentials'));
});
test('permission-aware sidebar does not expose HR or team to an analyst',()=>{
 const session={role:'analyst_viewer',user:{id:'synthetic',email:'test@example.invalid',displayName:'Synthetic Tester'}};
 const html=renderToStaticMarkup(React.createElement(ui.AppShell,{session,active:'dashboard',onLogout:()=>{},refresh:()=>{}},React.createElement('p',{},'Synthetic test child')));
 assert.ok(html.includes('/admin/analytics'));assert.ok(!html.includes('/admin/careers'));assert.ok(!html.includes('/admin/team'));assert.ok(!html.includes('/admin/leads'));assert.ok(html.includes('aria-current="page"'));
});
test('all 18 requested screens have routes, with applicants as an additional restricted view',()=>{
 const requested=['dashboard','leads','pages','services','blog','free-tools','careers','campaigns','seo','automations','analytics','case-studies','media','appointments','team','integrations','settings'];
 for(const id of requested)assert.ok(adminModules.some(module=>module.id===id),id);
 assert.ok(fs.readFileSync('scripts/prerender-seo-pages.mjs','utf8').includes('admin/login'));
 const css=fs.readFileSync('src/admin/admin.css','utf8');assert.ok(css.includes('width:254px'));assert.ok(css.includes('height:68px'));assert.ok(css.includes('prefers-reduced-motion'));assert.ok(css.includes('@media(max-width:760px)'));
});

test('CSV review handles quoted fields, rejects invalid headers, and caps import size',()=>{
 const rows=ui.parseLeadCsv('name,email,company\n"Synthetic, Person",test@example.invalid,"Acme ""Test"""');
 assert.equal(rows[0].name,'Synthetic, Person');assert.equal(rows[0].company,'Acme "Test"');
 assert.throws(()=>ui.parseLeadCsv('name,phone\nSynthetic,123'));
 assert.throws(()=>ui.parseLeadCsv('name,email\n"unfinished,test@example.invalid'));
 assert.throws(()=>ui.parseLeadCsv('name,email\n'+Array.from({length:101},()=> 'Synthetic,test@example.invalid').join('\n')));
});

test('safe content previews format text without executing HTML or unsafe links',()=>{
 const html=renderToStaticMarkup(React.createElement(ui.SafeTextContent,{text:'## Heading\n**Strong** text\n- First item\n- Second item\n<script>alert(1)</script>\n[bad](javascript:alert(1))'}));
 assert.ok(html.includes('<strong>Strong</strong>'));assert.ok(html.includes('<ul'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(!html.includes('href="javascript:'));
});
