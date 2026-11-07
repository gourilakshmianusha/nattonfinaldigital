import React, { createContext, useContext } from 'react';
import { hrefToPath } from './paths.js';

const NavContext = createContext({ setPath: () => {} });

export function useNav() {
  return useContext(NavContext);
}

export function NavProvider({ setPath, children }) {
  return <NavContext.Provider value={{ setPath }}>{children}</NavContext.Provider>;
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isExternalHref(href = '') {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

/** Internal links call setPath; hash anchors scroll; external http(s)/mailto open normally. */
export function SmartLink({ href = '/', children, className, onClick, ...rest }) {
  const { setPath } = useNav();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || isModifiedClick(event)) return;
    if (!href || isExternalHref(href)) return;

    event.preventDefault();

    const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1).split('?')[0] : '';
    const path = hrefToPath(href);

    if (hash && (href.startsWith('#') || href.startsWith('/#') || path === 'home' || path === '#' + hash)) {
      const scrollToHash = () => {
        const target = document.getElementById(hash);
        if (target) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      };
      if (document.getElementById(hash)) {
        scrollToHash();
        return;
      }
      setPath('home');
      requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
      return;
    }

    if (typeof path === 'string' && path.startsWith('#')) {
      document.getElementById(path.slice(1))?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }

    setPath(path);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export default NavContext;
