interface Props {
  className?: string;
  size?: number;
  /** Emphasize filled bag when cart has items. */
  active?: boolean;
  title?: string;
}

/**
 * Recommended Harbour & Pine cart mark: soft tote with clear handle,
 * readable at 20px (header) and 24px (mobile FAB).
 */
export default function CartIcon({ className = '', size = 20, active = false, title }: Props) {
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
        d="M7.2 8.2V7.1A4.8 4.8 0 0 1 12 2.3a4.8 4.8 0 0 1 4.8 4.8v1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.4 8.2h13.2l-.9 11.1a2.2 2.2 0 0 1-2.2 2H8.5a2.2 2.2 0 0 1-2.2-2L5.4 8.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.12 : 0}
      />
      <path
        d="M9.2 12.2v3.2M14.8 12.2v3.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity={active ? 1 : 0.9}
      />
    </svg>
  );
}

export function CartCountBadge({ count, className = '' }: { count: number; className?: string }) {
  if (count <= 0) return null;
  const label = count > 99 ? '99+' : String(count);
  return (
    <span
      className={`inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1.5 text-[0.68rem] font-bold leading-none text-porcelain ${className}`}
    >
      {label}
    </span>
  );
}
