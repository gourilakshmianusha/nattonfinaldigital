import React from 'react';
import App from './reference-site/App.jsx';
import './reference-site/styles.css';
import './reference-site/standalone.css';
import './reference-site/review/layout-polish.css';
import './reference-site/solutions/hero-film.css';
import './reference-site/resources/navigation-restoration.css';
import './reference-site/performance/scroll-performance.css';

export default function ReferenceWebsite({ path }: { path: string }) {
  return <App path={path} />;
}
