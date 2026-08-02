import { useEffect, useId, useRef, useState } from 'react';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

type Message = { role: 'assistant' | 'user'; content: string };

const quickActions = [
  'Help me find a product',
  'Shop by room',
  'Find a gift',
  'Compare products',
  'Explain the demo checkout',
  'Build a store like this',
];

export default function AiAssistant() {
  const { setEnquiryOpen, addToCart } = useStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [pendingAdd, setPendingAdd] = useState<{ productId: string; variantId: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'AI shopping assistant in a fictional store demonstration created by Che Xu Studio. I can help you explore the demo catalogue—Harbour & Pine Home is not a real store.',
    },
  ]);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      trackEvent('chat_opened');
      closeRef.current?.focus();
    }
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed) return;
    setInput('');
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
      if (data.suggestEnquiry) {
        // Keep user control — do not auto-open.
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I could not reach the assistant endpoint. Browse Shop, or request a store plan from Che Xu Studio.',
        },
      ]);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-secondary fixed bottom-4 left-4 z-50 shadow-[var(--shadow-soft)]" onClick={() => setOpen(true)}>
        AI assistant
      </button>
      {open ? (
        <div className="fixed inset-0 z-[85]" role="presentation">
          <button type="button" className="absolute inset-0 bg-pine-dark/40" aria-label="Close assistant" onClick={() => setOpen(false)} />
          <section
            className="absolute bottom-0 right-0 flex h-[min(85vh,640px)] w-full max-w-md flex-col rounded-t-[var(--radius-xl)] bg-porcelain shadow-[var(--shadow-lift)] sm:bottom-4 sm:right-4 sm:rounded-[var(--radius-xl)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="flex items-start justify-between gap-3 border-b border-sand px-4 py-3">
              <div>
                <h2 id={titleId} className="font-display text-xl text-pine-dark">
                  AI shopping assistant
                </h2>
                <p className="text-xs text-charcoal/75">
                  Fictional store demonstration by Che Xu Studio. I am not a human.
                </p>
              </div>
              <button ref={closeRef} type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div className="flex flex-wrap gap-2 border-b border-sand px-4 py-3">
              {quickActions.map((action) => (
                <button key={action} type="button" className="pill" onClick={() => send(action)}>
                  {action}
                </button>
              ))}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'assistant' ? 'bg-linen text-charcoal' : 'ml-auto bg-pine text-porcelain'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {pendingAdd ? (
                <div className="rounded-lg border border-sand p-3 text-sm">
                  <p>
                    Add <strong>{pendingAdd.name}</strong> to the demo cart?
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
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
                    <button type="button" className="btn btn-secondary" onClick={() => setPendingAdd(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <form
              className="border-t border-sand p-4"
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
            >
              <label className="sr-only" htmlFor="ai-input">
                Message the assistant
              </label>
              <div className="flex gap-2">
                <input
                  id="ai-input"
                  value={input}
                  maxLength={500}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products or the demo…"
                  className="min-h-11 flex-1 rounded-md border border-charcoal/20 px-3"
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </div>
              <button
                type="button"
                className="btn btn-ghost mt-2 px-0"
                onClick={() => {
                  setOpen(false);
                  setEnquiryOpen(true);
                }}
              >
                Start a Che Xu Studio enquiry
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
