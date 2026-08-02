import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { siteConfig } from '../../data/site';
import { trackEvent } from '../../lib/analytics';
import ChatIcon from './ChatIcon';
import { useStore } from './store';

type Message = { role: 'assistant' | 'user'; content: string };

const quickActions = [
  'Help me find a product',
  'Shop by room',
  'Find a gift',
  'Compare products',
  'Explain the demo checkout',
  'Build a store like this',
] as const;

const welcomeMessage =
  'Hi — I’m the Harbour & Pine demo assistant from Che Xu Studio. I can help you explore this fictional catalogue, explain the demo checkout, or start a store-plan enquiry. Harbour & Pine Home is not a real store.';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function AiAssistant() {
  const { setEnquiryOpen, addToCart, cartOpen, enquiryOpen } = useStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [onProductPage, setOnProductPage] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [suggestEnquiry, setSuggestEnquiry] = useState(false);
  const [pendingAdd, setPendingAdd] = useState<{ productId: string; variantId: string; name: string } | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: welcomeMessage }]);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setOnProductPage(window.location.pathname.startsWith('/products/'));
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-chat-open', open);
    return () => document.body.classList.remove('is-chat-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    trackEvent('chat_opened');
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pendingAdd, busy, suggestEnquiry, open]);

  async function send(text: string) {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed || busy) return;
    setInput('');
    setBusy(true);
    setSuggestEnquiry(false);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

    try {
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as {
        reply?: string;
        suggestEnquiry?: boolean;
        confirmAdd?: { productId: string; variantId: string; name: string };
      };
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply ?? 'I can help with the fictional catalogue, demo checkout, or Che Xu Studio enquiries.',
        },
      ]);
      if (data.confirmAdd) setPendingAdd(data.confirmAdd);
      if (data.suggestEnquiry) setSuggestEnquiry(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not reach the assistant endpoint. Browse Shop, or request a store plan from Che Xu Studio.',
        },
      ]);
      setSuggestEnquiry(true);
    } finally {
      setBusy(false);
      queueMicrotask(() => inputRef.current?.focus());
    }
  }

  const hideFab = !mounted || open || cartOpen || enquiryOpen;

  const dialog =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100]" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-pine-dark/45"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            />
            <section
              className="absolute inset-x-0 bottom-0 flex h-[min(90dvh,720px)] w-full flex-col overflow-hidden rounded-t-[1.25rem] bg-porcelain pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-lift)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[min(80vh,640px)] sm:w-[min(100%-2rem,26rem)] sm:rounded-[1.25rem]"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className="flex items-start justify-between gap-3 border-b border-sand bg-linen/70 px-4 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pine-dark text-sand shadow-[var(--shadow-soft)]">
                    <ChatIcon size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-harbour">Che Xu Studio</p>
                    <h2 id={titleId} className="font-display text-xl leading-tight text-pine-dark">
                      Demo shopping assistant
                    </h2>
                    <p className="mt-0.5 text-xs text-charcoal/75">
                      Fictional catalogue help · not a human agent
                    </p>
                  </div>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="btn btn-ghost min-h-11 min-w-11 shrink-0 px-2"
                  aria-label="Close assistant"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="border-b border-sand px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-charcoal/60">Quick prompts</p>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="pill shrink-0 whitespace-nowrap disabled:opacity-50"
                      disabled={busy}
                      onClick={() => void send(action)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === 'assistant'
                        ? 'bg-linen text-charcoal'
                        : 'ml-auto bg-pine text-porcelain'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-harbour">Assistant</p>
                    ) : null}
                    {message.content}
                  </div>
                ))}

                {busy ? (
                  <div className="max-w-[70%] rounded-2xl bg-linen px-3.5 py-3 text-sm text-charcoal/70">
                    <span className="inline-flex gap-1" aria-label="Assistant is typing">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-harbour" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-harbour [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-harbour [animation-delay:240ms]" />
                    </span>
                  </div>
                ) : null}

                {pendingAdd ? (
                  <div className="rounded-2xl border border-sand bg-porcelain p-3 text-sm shadow-[var(--shadow-soft)]">
                    <p>
                      Add <strong>{pendingAdd.name}</strong> to the demo cart?
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        className="btn btn-primary w-full sm:w-auto"
                        onClick={() => {
                          addToCart(pendingAdd.productId, pendingAdd.variantId, 1);
                          setMessages((prev) => [
                            ...prev,
                            { role: 'assistant', content: `${pendingAdd.name} was added to the demo cart.` },
                          ]);
                          setPendingAdd(null);
                        }}
                      >
                        Confirm add
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary w-full sm:w-auto"
                        onClick={() => setPendingAdd(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {suggestEnquiry ? (
                  <div className="rounded-2xl border border-harbour/30 bg-linen p-3 text-sm">
                    <p className="font-semibold text-pine-dark">Want a store built like this?</p>
                    <p className="mt-1 text-charcoal/80">
                      Che Xu Studio can plan a conversion-focused storefront around your catalogue and SEO goals.
                    </p>
                    <button
                      type="button"
                      className="btn btn-clay mt-3 w-full"
                      onClick={() => {
                        setOpen(false);
                        trackEvent('che_xu_cta_selected', { cta: 'chat-suggest' });
                        setEnquiryOpen(true);
                      }}
                    >
                      Request My Store Plan
                    </button>
                  </div>
                ) : null}
              </div>

              <form
                className="border-t border-sand bg-porcelain p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send(input);
                }}
              >
                <label className="sr-only" htmlFor="ai-input">
                  Message the Che Xu Studio demo assistant
                </label>
                <div className="flex items-end gap-2">
                  <input
                    ref={inputRef}
                    id="ai-input"
                    value={input}
                    maxLength={500}
                    disabled={busy}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about products, rooms, or building a store…"
                    className="min-h-11 flex-1 rounded-full border border-charcoal/15 bg-linen/50 px-4 disabled:opacity-60"
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn-primary min-h-11 px-4" disabled={busy || !input.trim()}>
                    Send
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost px-0 text-sm"
                    onClick={() => {
                      setOpen(false);
                      trackEvent('che_xu_cta_selected', { cta: 'chat-footer' });
                      setEnquiryOpen(true);
                    }}
                  >
                    Start a Che Xu Studio enquiry
                  </button>
                  <a
                    href={siteConfig.caseStudyUrl}
                    className="text-xs font-semibold text-harbour underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('case_study_selected', { source: 'chat' })}
                  >
                    View case study
                  </a>
                </div>
                <p className="mt-2 text-[0.7rem] leading-snug text-charcoal/60">
                  Demo chat only — no personal data is required. Responses are generated for this portfolio concept.
                </p>
              </form>
            </section>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {!hideFab ? (
        <button
          type="button"
          className={`z-50 shadow-[var(--shadow-lift)] ${
            onProductPage
              ? 'btn btn-primary fixed bottom-[5.75rem] right-4 min-h-12 min-w-12 rounded-full px-3 md:bottom-5 md:right-5 md:min-w-0 md:rounded-full md:px-4'
              : 'btn btn-primary safe-fab-right gap-2 rounded-full px-4'
          }`}
          aria-label="Open Che Xu Studio demo shopping assistant"
          onClick={() => setOpen(true)}
        >
          <ChatIcon size={20} />
          <span className={onProductPage ? 'hidden md:inline' : 'inline'}>Ask Che Xu</span>
        </button>
      ) : null}
      {dialog}
    </>
  );
}
