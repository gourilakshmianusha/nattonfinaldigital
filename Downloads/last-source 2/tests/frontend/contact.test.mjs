import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {unlinkSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const output = path.resolve('tests/frontend/.contact-fixture.mjs');
let contact;
const originalFetch = globalThis.fetch;
const payload = {name:'Synthetic QA', email:'qa@example.invalid', phone:'+919999999999', service:'SEO', solution:'BusinessOS', industry:'Retail', message:'Synthetic test enquiry', consent:true, source:'contact_page', page:'/contact/'};
const saved = {saved:true, appointmentId:'11111111-1111-4111-8111-111111111111', status:'requested'};
const response = (body, status=201) => new Response(JSON.stringify(body), {status, headers:{'Content-Type':'application/json'}});

test.before(async () => {
  await build({stdin:{contents:"export {createContactSubmitter} from './src/contact-submission.ts'; export {default as Form,validateEnquiry} from './src/reference-site/resources/EnquiryForm.jsx';", resolveDir:process.cwd()}, outfile:output, bundle:true, packages:'external', format:'esm', platform:'node', jsx:'automatic', plugins:[{name:'isolate-secondary-sync',setup(build){build.onResolve({filter:/utils\/googleSheets$/},()=>({path:'secondary-sync',namespace:'fixture'}));build.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export async function registerFormSubmission() {}'}));}}]});
  contact = await import(pathToFileURL(output));
});
test.afterEach(() => {globalThis.fetch = originalFetch;});
test.after(() => unlinkSync(output));

test('contact form exposes direct submit and validates contact details and consent', () => {
  const html = renderToStaticMarkup(React.createElement(contact.Form));
  assert.ok(html.includes('Send enquiry'));
  assert.ok(html.includes('data-skip-global-lead-sync="true"'));
  assert.ok(!html.includes('Review your enquiry'));
  assert.ok(!html.includes('Send by email'));
  assert.deepEqual(contact.validateEnquiry(payload), {});
  const errors = contact.validateEnquiry({...payload, email:'invalid', phone:'12', consent:false});
  assert.ok(errors.email && errors.phone && errors.consent);
});

test('submission uses the existing appointment endpoint and preserves every form field', async () => {
  let calls=0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, '/api/public/appointment-requests');
    assert.equal(options.method, 'POST');
    assert.equal(options.credentials, 'same-origin');
    const {requestId,...fields} = JSON.parse(options.body);
    assert.match(requestId,/^[a-f0-9-]{36}$/);
    assert.deepEqual(fields,payload);
    return response(saved);
  };
  const submit = contact.createContactSubmitter();
  const [first,second] = await Promise.all([submit(payload),submit(payload)]);
  assert.deepEqual(first,saved);assert.deepEqual(second,saved);
  await submit(payload);
  assert.equal(calls,1,'concurrent and repeated clicks share one save');
});

test('failed submissions surface errors and retry with the same idempotency key', async () => {
  const ids=[];
  globalThis.fetch = async (_,options) => {
    ids.push(JSON.parse(options.body).requestId);
    return ids.length===1?response({error:'Temporarily unavailable'},503):response(saved);
  };
  const submit=contact.createContactSubmitter();
  await assert.rejects(submit(payload),/Temporarily unavailable/);
  assert.deepEqual(await submit(payload),saved);
  assert.equal(ids[0],ids[1]);
  await submit({...payload,message:'Changed enquiry'});
  assert.notEqual(ids[2],ids[1]);
});

test('a response without confirmed storage never produces success', async () => {
  globalThis.fetch=async()=>response({saved:false});
  await assert.rejects(contact.createContactSubmitter()(payload),/could not confirm/);
});
