interface Props {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Recommended Harbour & Pine AI chat mark: chat bubble with pine canopy + harbour wave.
 * Reads as “assistant” at a glance, stays brand-distinct from cart/nav, and stays
 * legible at 20px (FAB) and ~22px (panel avatar) on desktop and mobile.
 */
export default function ChatIcon({ className = '', size = 20, title }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M5 6.4A3.4 3.4 0 0 1 8.4 3h7.2A3.4 3.4 0 0 1 19 6.4v5.8A3.4 3.4 0 0 1 15.6 15.6H11.1l-3.7 3.1c-.7.6-1.7.1-1.7-.8v-2.3A3.4 3.4 0 0 1 5 12.2V6.4Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.9 14.55 9.35h-1.25L15.1 11.9h-1.35L15.3 14.2H8.7l1.55-2.3H8.9l1.8-2.55H9.45L12 5.9Z"
        fill="currentColor"
      />
      <path d="M11.35 14.2h1.3v.85h-1.3V14.2Z" fill="currentColor" opacity="0.9" />
      <path
        d="M8.35 16.05c1.05-.68 1.85-.68 2.9 0s1.85.68 2.9 0"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
