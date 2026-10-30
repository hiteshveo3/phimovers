'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { MagicStar as MagicStarIcon } from 'iconsax-reactjs';
import { Ico } from '../Ico';
import { T } from '../../assistant/config';
import { LAUNCHER_CSS } from './styles';

// The "Ask Phi" button on every page. The chat panel itself loads only when someone opens it
// (or hovers the button), so pages stay light. Other parts of the site can open it with
//   document.dispatchEvent(new CustomEvent('phi:open'))
//   window.dispatchEvent(new CustomEvent('phi:assistant', { detail: { prompt: 'optional question' } }))
// or a link to #ask-phi.
// On phones it is a round icon above the tab bar (see LAUNCHER_CSS).

const Panel = dynamic(() => import('./AssistantPanel'), { ssr: false });
const preload = () => {
  void import('./AssistantPanel');
};

const isAskHash = () => window.location.hash === '#ask-phi';

const OPEN_KEY = 'phi-chat-open';
const remember = (open: boolean) => {
  try {
    if (open) sessionStorage.setItem(OPEN_KEY, '1');
    else sessionStorage.removeItem(OPEN_KEY);
  } catch {
    // storage blocked
  }
};

export default function AssistantLauncher() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<{ text: string; n: number } | undefined>();

  const show = useCallback((text?: string) => {
    setMounted(true);
    setOpen(true);
    remember(true);
    if (text) setPrompt((p) => ({ text, n: (p?.n ?? 0) + 1 }));
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    remember(false);
    (document.querySelector('.amc-launch') as HTMLElement | null)?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    // Keep the panel open across pages on large screens (a link in an answer opens a new page).
    let wasOpen = false;
    try {
      wasOpen = sessionStorage.getItem(OPEN_KEY) === '1';
    } catch {
      // storage blocked
    }
    if (isAskHash() || (wasOpen && window.matchMedia('(min-width: 1024px)').matches)) show();
    const onEvent = (e: Event) => show((e as CustomEvent<{ prompt?: string }>).detail?.prompt);
    const onOpen = () => show();
    const onHash = () => isAskHash() && show();
    window.addEventListener('phi:assistant', onEvent);
    document.addEventListener('phi:open', onOpen);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('phi:assistant', onEvent);
      document.removeEventListener('phi:open', onOpen);
      window.removeEventListener('hashchange', onHash);
    };
  }, [show]);

  // Shown from the first paint so visitors see at once that there is an AI assistant.
  const visible = !open;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LAUNCHER_CSS }} />
      <button
        type="button"
        className={`amc-launch${visible ? '' : ' is-hidden'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={mounted ? 'phi-assistant' : undefined}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        onPointerEnter={preload}
        onFocus={preload}
        onClick={() => show()}
      >
        <span className="amc-launch-ico" aria-hidden="true"><Ico icon={MagicStarIcon} size={24} variant="Bold" /></span>
        <span>{T.open}</span>
      </button>
      {mounted && <Panel open={open} onClose={hide} prompt={prompt} />}
    </>
  );
}
