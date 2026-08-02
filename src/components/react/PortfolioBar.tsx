import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../../data/site';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

const STORAGE_KEY = 'hp-portfolio-bar-dismissed';

export default function PortfolioBar() {
  const { setEnquiryOpen } = useStore();
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === '1';
    if (dismissed) setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.setProperty('--portfolio-bar-height', '0px');
      return;
    }

    const node = barRef.current;
    if (!node) return;

    const apply = () => {
      document.documentElement.style.setProperty('--portfolio-bar-height', `${node.offsetHeight}px`);
    };
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty('--portfolio-bar-height', '0px');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={barRef} className="portfolio-bar relative z-[60]">
      <div className="container-page flex min-h-10 items-center justify-between gap-2 py-1.5 text-sm sm:min-h-11 sm:py-2">
        <p className="min-w-0 flex-1 truncate">
          <span className="sm:hidden">Concept by </span>
          <span className="hidden sm:inline">E-commerce website concept designed by </span>
          <a
            href={siteConfig.studioUrl}
            className="underline decoration-sand/70 underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Che Xu Studio
          </a>
          <span className="hidden sm:inline">.</span>
        </p>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href={siteConfig.caseStudyUrl}
            className="btn btn-ghost hidden min-h-9 px-3 text-porcelain sm:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('case_study_selected', { source: 'portfolio-bar' })}
          >
            View Case Study
          </a>
          <button
            type="button"
            className="btn btn-clay min-h-9 px-3 text-xs sm:text-sm"
            onClick={() => {
              trackEvent('che_xu_cta_selected', { cta: 'portfolio-bar' });
              setEnquiryOpen(true);
            }}
          >
            <span className="sm:hidden">Build a Store</span>
            <span className="hidden sm:inline">Build a Store Like This</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost min-h-9 min-w-9 px-2 text-porcelain"
            aria-label="Dismiss portfolio notice"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, '1');
              setVisible(false);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
