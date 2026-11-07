import React from 'react';
import './brand-detail-theme.css';

export default function BrandDetailTheme({ darkMode, children }: { darkMode: boolean; children: React.ReactNode }) {
  return <div className="brand-detail-theme" data-theme={darkMode ? 'dark' : 'light'}>{children}</div>;
}
