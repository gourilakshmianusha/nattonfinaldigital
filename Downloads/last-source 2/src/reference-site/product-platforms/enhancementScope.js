// Scope the supplied demo controllers to one mounted React page. Page-level
// listeners, observers and pending animation work are disposed on route changes.
export function enhancementScope(root) {
  const cleanups = [];
  const timers = new Set();
  const frames = new Set();
  let disposed = false;
  const listen = (target, type, callback, options) => {
    target.addEventListener(type, callback, options);
    cleanups.push(() => target.removeEventListener(type, callback, options));
  };
  const scopedDocument = new Proxy(document, {
    get(target, key) {
      if (key === 'querySelector') return selector => root.querySelector(selector);
      if (key === 'querySelectorAll') return selector => root.querySelectorAll(selector);
      if (key === 'getElementById') return id => root.querySelector(`#${CSS.escape(id)}`);
      if (key === 'addEventListener') return (type, callback, options) => listen(target, type, callback, options);
      const value = Reflect.get(target, key, target);
      return typeof value === 'function' ? value.bind(target) : value;
    }
  });
  return {
    document: scopedDocument,
    window,
    addEventListener: (type, callback, options) => listen(window, type, callback, options),
    matchMedia: query => {
      const media = window.matchMedia(query);
      return new Proxy(media, { get(target, key) {
        if (key === 'addEventListener') return (type, callback, options) => listen(target, type, callback, options);
        const value = Reflect.get(target, key, target);
        return typeof value === 'function' ? value.bind(target) : value;
      }});
    },
    IntersectionObserver: class extends IntersectionObserver {
      constructor(...args) { super(...args); cleanups.push(() => this.disconnect()); }
    },
    setTimeout: (callback, delay) => {
      const id = window.setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, delay);
      timers.add(id); return id;
    },
    clearTimeout: id => { timers.delete(id); window.clearTimeout(id); },
    requestAnimationFrame: callback => {
      const id = window.requestAnimationFrame(time => { frames.delete(id); if (!disposed) callback(time); });
      frames.add(id); return id;
    },
    cancelAnimationFrame: id => { frames.delete(id); window.cancelAnimationFrame(id); },
    dispose: () => {
      disposed = true;
      cleanups.forEach(cleanup => cleanup());
      timers.forEach(id => window.clearTimeout(id));
      frames.forEach(id => window.cancelAnimationFrame(id));
    }
  };
}
