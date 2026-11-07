import React, { useEffect, useRef, useState } from 'react';
import { Save, Eye, History, RotateCcw, Send, CheckCircle2, Globe, Trash2, Bold, List, Heading2 } from 'lucide-react';
import SafeTextContent from '../components/SafeTextContent';
import MenuEditor from './MenuEditor';
import { utcToLocalInput, localInputToUtc } from './time.mjs';
import SectionBlockEditor from './SectionBlockEditor';
import { can } from './modules.mjs';
import { request, mutate, label, dateTime } from './api';
import { Modal, FormField, StatusBadge, ErrorState, LoadingSkeleton, ConfirmDialog, AuditTimeline } from './ui';

export default function RecordEditor({ spec, record, role, onClose, onSaved, notify, timezone = 'Asia/Kolkata' }: any) {
 const [current, setCurrent] = useState(record);
 const [title, setTitle] = useState(record?.title || '');
 const [status, setStatus] = useState(record?.status || spec.statuses[0]);
 const [body, setBody] = useState<any>(() => Object.fromEntries(spec.fields.map((field: any) => { let value = record?.body?.[field.key] ?? field.default ?? ''; if (field.type === 'json' && typeof value === 'object') value = JSON.stringify(value, null, 2); if (field.type === 'datetime-local' && value) { value = utcToLocalInput(value, record?.body?.timezone || timezone); } return [field.key, value]; })));
 const [tab, setTab] = useState('edit');
 const [error, setError] = useState<any>(null);
 const [busy, setBusy] = useState(false);
 const [history, setHistory] = useState<any>(null);
 const [confirm, setConfirm] = useState<any>(null);
 const [dirty, setDirty] = useState(false);
 const [savedAt, setSavedAt] = useState<string | null>(null);
 const form = useRef<HTMLFormElement>(null);
 const slugTouched = useRef(!!record);
 const writable = can(role, spec.id, 'write') && !spec.readonly;
 const editable = writable && (!spec.content || ['draft', 'review'].includes(status));
 useEffect(() => { if (tab === 'history' && current) void request(`/${spec.id}/${current.id}/history`).then(setHistory).catch(setError); }, [tab, current?.revision]);
 async function save(nextStatus = status, close = true, automatic = false) {
  if (!form.current?.reportValidity() && tab === 'edit' && !automatic) return;
  if (automatic && !form.current?.checkValidity()) return;
  setBusy(true); setError(null);
  try { const outgoingBody = { ...body }; for (const field of spec.fields) if (field.type === 'datetime-local' && outgoingBody[field.key]) outgoingBody[field.key] = localInputToUtc(outgoingBody[field.key], body.timezone || timezone); const result = await mutate(`/${spec.id}${current ? `/${current.id}` : ''}`, current ? 'PATCH' : 'POST', { title, status: spec.id === 'integrations' && nextStatus === 'connected' ? 'not_connected' : nextStatus, body: outgoingBody, revision: current?.revision }); setCurrent(result); setStatus(result.status); setDirty(false); setSavedAt(new Date().toISOString()); onSaved(); if (close) onClose(); if (!automatic) notify('Record saved centrally in Supabase.'); if (spec.id === 'blog' && !automatic) { if (result.status === 'published') window.location.assign(`/blog?article=${encodeURIComponent(result.slug)}`); else if (!current) window.location.assign('/blog'); } }
  catch (error) { setError(error); }
  finally { setBusy(false); }
 }
 useEffect(() => { if (!dirty || !current || !spec.content || status !== 'draft' || busy || !editable) return; const timeout = setTimeout(() => void save('draft', false, true), 4000); return () => clearTimeout(timeout); }, [dirty, title, body]);
 function update(key: string, value: any) { if (key === 'slug') slugTouched.current = true; setBody((previous: any) => ({ ...previous, [key]: value })); setDirty(true); }
 function format(mark: string) { const text = String(body.body || ''); update('body', mark === 'heading' ? `${text}\n\n## Heading\n` : mark === 'list' ? `${text}\n\n- List item\n` : `${text} **Bold text**`); }
 async function remove() { setBusy(true); try { await mutate(`/${spec.id}/${current.id}?revision=${current.revision}`, 'DELETE'); onSaved(); onClose(); notify('Record deleted. Its audit history was retained.'); } catch (error) { setError(error); setConfirm(null); } finally { setBusy(false); } }
 async function restore(version: any) { setBusy(true); try { const result = await mutate(`/${spec.id}/${current.id}/restore`, 'POST', { revision: version.revision, currentRevision: current.revision }); onSaved(); onClose(); notify(`Revision ${version.revision} restored as a new draft revision.`); } catch (error) { setError(error); } finally { setBusy(false); setConfirm(null); } }
 const titleText = current ? current.title : `New ${spec.label.toLowerCase()}`;
 const groups = [
  { id: 'details', label: 'Details & content', fields: spec.fields.filter((field: any) => !['meta_title', 'meta_description', 'canonical', 'og_image', 'schema', 'scheduled_at'].includes(field.key)) },
  { id: 'seo', label: 'SEO & publication', fields: spec.fields.filter((field: any) => ['meta_title', 'meta_description', 'canonical', 'og_image', 'schema', 'scheduled_at'].includes(field.key)) },
 ];
 const transitions: Record<string, string[]> = { draft: ['review'], review: ['draft', 'approved'], approved: ['draft', 'published', 'scheduled'], scheduled: ['draft'], published: ['draft', 'archived'], archived: ['draft'] };
 return <>
  <Modal title={titleText} onClose={() => dirty ? setConfirm({ type: 'discard' }) : onClose()} wide>
   <div className="nd-editor-meta"><StatusBadge status={status} /><span>{current ? `Revision ${current.revision}` : 'Unsaved draft'}</span>{savedAt && <span>Saved {dateTime(savedAt)}</span>}{dirty && <span>Unsaved changes</span>}</div>
   <div className="nd-tabs" role="tablist" aria-label="Record views">{['edit', 'preview', ...(current ? ['history'] : [])].map(value => <button key={value} role="tab" aria-selected={tab === value} onClick={() => setTab(value)}>{value === 'edit' ? 'Details' : label(value)}</button>)}</div>
   {error && <ErrorState error={error} />}
   {spec.readonly && current && tab === 'edit' && <div><h3>Source observation</h3><p className="nd-info">Recorded source, timeframe, timezone, currency, and provider metric definitions are shown below. These are aggregate reporting records, separate from private CRM contacts.</p><pre>{JSON.stringify(current.body,null,2)}</pre></div>}
   {tab === 'edit' && <form ref={form} data-skip-global-lead-sync="true" onSubmit={event => { event.preventDefault(); void save(); }}>
    <p className="nd-info">Times are entered in {body.timezone || timezone} and saved with UTC offsets. Original source and consent metadata is preserved.</p>
    <fieldset disabled={!editable || busy}>
     <FormField field={{ key: 'title', label: 'Name / title', required: true }} value={title} onChange={(value: string) => { setTitle(value); setDirty(true); if (!current && !slugTouched.current && spec.fields.some((field: any) => field.key === 'slug')) setBody((previous: any) => ({ ...previous, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })); }} />
     {!spec.content && <FormField field={{ key: 'status', label: 'Status', type: 'select', options: spec.statuses, required: true }} value={spec.id === 'integrations' && status === 'connected' ? 'not_connected' : status} onChange={(value: string) => { setStatus(value); setDirty(true); }} />}
     {groups.filter(group => group.fields.length).map(group => <details key={group.id} className="nd-field-group" open><summary>{group.label}</summary><div className="nd-form-grid">{group.fields.map((field: any) => <React.Fragment key={field.key}>{field.key === 'menu' && <MenuEditor value={body.menu} onChange={value => update('menu', value)} />}{field.key === 'sections' && <SectionBlockEditor value={body.sections} onChange={value => update('sections', value)} />}{field.key === 'body' && <div className="nd-editor-toolbar"><span>Plain text / Markdown</span><button type="button" aria-label="Insert bold text" onClick={() => format('bold')}><Bold size={15} /></button><button type="button" aria-label="Insert heading" onClick={() => format('heading')}><Heading2 size={15} /></button><button type="button" aria-label="Insert list" onClick={() => format('list')}><List size={15} /></button></div>}<FormField field={spec.id==='appointments'&&['requested','cancelled','no_show'].includes(status)&&['owner_id','starts_at','ends_at'].includes(field.key)?{...field,required:false}:current && ((spec.id === 'leads' && ['source','consent_at','marketing_consent'].includes(field.key)) || (spec.id === 'applicants' && field.key === 'consent_at')) ? {...field,disabled:true,help:'Original intake metadata is read only.'} : field} value={body[field.key]} onChange={(value: any) => update(field.key, value)} /></React.Fragment>)}</div></details>)}
    </fieldset>
    {spec.id === 'blog' && !current && <p className="nd-info">Saving takes you to the public Blogs page. Your new draft stays private until it is reviewed, approved, and published.</p>}
    {!editable && spec.content && writable && <p className="nd-info">Return this record to draft before changing approved or published content.</p>}
    <div className="nd-dialog-actions"><button type="button" className="nd-button" onClick={() => dirty ? setConfirm({ type: 'discard' }) : onClose()}>Close</button>{editable && <button className="nd-button nd-primary" disabled={busy}><Save size={16} />{busy ? 'Saving…' : spec.id === 'blog' && !current ? 'Save draft & view blogs' : 'Save changes'}</button>}</div>
   </form>}
   {tab === 'preview' && <article className="nd-content-preview"><p className="nd-eyebrow">PRIVATE DRAFT PREVIEW</p>{body.hero_image && /^https?:\/\//.test(body.hero_image) && <img src={body.hero_image} alt={body.alt_text || ''} />}<h1>{title || 'Untitled draft'}</h1><p className="nd-preview-summary">{body.summary}</p><SafeTextContent text={String(body.body || body.notes || '')} /><p className="nd-info">Preview only. Raw HTML is rendered as text for safety. The public projection excludes private fields.</p></article>}
   {tab === 'history' && (!history ? <LoadingSkeleton /> : <><h3>Revision history</h3><div className="nd-version-list">{history.versions.map((version: any) => <div key={version.id}><div><strong>Revision {version.revision}</strong><p>{version.snapshot.title} · {label(version.snapshot.status)}</p><small>{dateTime(version.created_at)}</small><details><summary>Compare with current record</summary><pre>{JSON.stringify({ title: { then: version.snapshot.title, now: title }, content: { then: version.snapshot.body, now: body } }, null, 2)}</pre></details></div>{writable && version.revision !== current.revision && <button className="nd-button" onClick={() => setConfirm({ type: 'restore', version })}><RotateCcw size={15} />Restore as draft</button>}</div>)}</div><h3 className="nd-section-heading">Audit timeline</h3><AuditTimeline events={history.events} /></>)}
   {current?.status === 'published' && spec.content && <a href={spec.id === 'blog' ? `/blog?article=${encodeURIComponent(current.slug)}` : `/p/${spec.id}/${current.slug}`} target="_blank" rel="noreferrer" className="nd-link">Open published content <Globe size={15} /></a>}
   {current && spec.content && writable && <div className="nd-workflow-actions"><strong>Publication workflow</strong><div className="nd-actions">{(transitions[status] || []).filter(next => (status !== 'published' && !['approved', 'scheduled', 'published'].includes(next)) || can(role, spec.id, 'publish')).map(next => <button key={next} className="nd-button" disabled={busy || dirty} onClick={() => setConfirm({ type: 'transition', next })}>{next === 'published' ? <Globe size={15} /> : <Send size={15} />}{next === 'review' ? 'Submit for review' : next === 'draft' ? 'Return to draft' : label(next)}</button>)}</div><small>Save edits before changing status. Publishing requires approval and SEO metadata.</small></div>}
   {current && can(role, spec.id, 'delete') && <button className="nd-link nd-text-danger" onClick={() => setConfirm({ type: 'delete' })}><Trash2 size={15} />Delete record</button>}
  </Modal>
  {confirm && <ConfirmDialog title={confirm.type === 'delete' ? 'Delete this record?' : confirm.type === 'discard' ? 'Discard unsaved changes?' : confirm.type === 'restore' ? 'Restore a previous revision?' : `Change status to ${label(confirm.next)}?`} description={confirm.type === 'delete' ? 'This removes the new application record. Published content must be archived first. This does not delete existing website records.' : confirm.type === 'discard' ? 'Changes that have not been saved will be lost.' : confirm.type === 'restore' ? 'The selected version becomes a new draft. Existing revision history is retained.' : 'This action will be validated and recorded in the audit history.'} busy={busy} onClose={() => setConfirm(null)} onConfirm={() => { if (confirm.type === 'delete') void remove(); else if (confirm.type === 'discard') onClose(); else if (confirm.type === 'restore') void restore(confirm.version); else { void save(confirm.next, false); setConfirm(null); } }} />}
 </>;
}
