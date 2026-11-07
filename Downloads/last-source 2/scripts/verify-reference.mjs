import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {render, allPages} from '../.reference-ssr/entry-server.js';

function filesAt(directory) {
  return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesAt(file) : [file];
  });
}

let verifiedFiles = 0;
// Explicitly requested contact and tools API connections preserve the ZIP styles.
const contactOverrides = new Set(['resources/EnquiryForm.jsx', 'resources/ResourcePages.jsx', 'resources/resourceRoutes.jsx', 'resources/ResourceTools.jsx']);
for (const [reference, destination] of [
  ['design-reference/natton-digital/src', 'src/reference-site'],
  ['design-reference/natton-digital/public', 'public'],
]) {
  for (const file of filesAt(reference)) {
    const target = path.join(destination, path.relative(reference, file));
    if (destination === 'src/reference-site' && contactOverrides.has(path.relative(reference, file))) continue;
    assert.ok(fs.readFileSync(file).equals(fs.readFileSync(target)), `ZIP parity: ${target}`);
    verifiedFiles++;
  }
}

const routes = ['/', '/services/', '/products/', '/industries/', ...allPages.map(page => page.path)];
for (const route of routes) {
  const $ = load(fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8'));
  const expected = load(render(route));
  assert.equal($('#root').text(), expected.root().text(), `ZIP content: ${route}`);
  assert.equal($('#root .nh-header').length, 1, `One header: ${route}`);
  assert.equal($('#root .nh-footer').length, 1, `One footer: ${route}`);
  assert.equal($('h1').length, 1, `One page heading: ${route}`);
  const styles = $('link[rel="stylesheet"]').map((_, element) => $(element).attr('href')).get();
  assert.ok(styles[0]?.includes('ReferenceWebsite-'), `Public base styles must precede page styles: ${route}`);
  assert.ok(!styles.some(file => /\/index-/.test(file)), `Legacy styles must stay isolated: ${route}`);
  $('img[src], video[src], source[src], link[rel="stylesheet"]').each((_, element) => {
    const url = $(element).attr('src') || $(element).attr('href');
    if (url?.startsWith('/')) assert.ok(fs.existsSync(path.join('dist', url.split(/[?#]/)[0])), `Asset ${url} on ${route}`);
  });
  $('a[href^="/"]').each((_, element) => {
    const url = $(element).attr('href').split(/[?#]/)[0];
    if (url) assert.ok(fs.existsSync(path.join('dist', url)) || fs.existsSync(path.join('dist', url, 'index.html')), `Link ${url} on ${route}`);
  });
}
console.log(`Verified ${verifiedFiles} exact ZIP source/assets (${contactOverrides.size} intentional API integration overrides) and ${routes.length} rendered pages; no missing assets, broken internal links, or duplicate frames.`);
