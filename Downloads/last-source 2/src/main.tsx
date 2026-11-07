import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {referencePath} from './reference-routing';

async function startWebsite() {
  const root = document.getElementById('root')!;
  const path = referencePath(window.location.pathname);
  const adminHash = /#\/admin(?:\/|$)/.test(window.location.hash);
  if (path !== null && !adminHash) {
    const {default: ReferenceWebsite} = await import('./ReferenceWebsite');
    const page = <StrictMode><ReferenceWebsite path={path} /></StrictMode>;
    if (root.dataset.referencePath===path && root.querySelector('.page-shell,.home-site')) hydrateRoot(root, page);
    else createRoot(root).render(page);
  } else {
    await import('./index.css');
    const {default: App} = await import('./App');
    createRoot(root).render(<StrictMode><App /></StrictMode>);
  }
}
void startWebsite();
