import { useEffect, useRef } from 'react';

/**
 * A sheet or card closes on Esc, on the phone's Back button and when the page changes.
 * Opening it adds a history entry, so Back closes the sheet instead of leaving the page.
 */
export function useCloseOnNav(onClose) {
  const ref = useRef(onClose);
  ref.current = onClose;
  useEffect(() => {
    const close = () => ref.current();
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    let popped = false;
    const onPop = () => { popped = true; close(); };
    history.pushState({ sheet: true }, '');
    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', close);
      // Closed by a button or Esc: take back the history entry we added.
      if (!popped && history.state?.sheet) history.back();
    };
  }, []);
}
