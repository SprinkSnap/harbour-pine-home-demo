import { useEffect, useState } from 'react';
import { siteConfig } from '../../data/site';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

const STORAGE_KEY = 'hp-portfolio-bar-dismissed';

export default function PortfolioBar() {
  const { setEnquiryOpen } = useStore();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === '1';
    if (dismissed) setVisible(false);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--portfolio-bar-height', visible ? '2.75rem' : '0px');
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="portfolio-bar relative z-[60]">
      <div className="container-page flex min-h-11 flex-wrap items-center justify-between gap-2 py-2 text-sm">
        <p className="max-w-3xl">
          E-commerce website concept designed by{' '}
          <a
            href={siteConfig.studioUrl}
            className="underline decoration-sand/70 underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Che Xu Studio
          </a>
          .
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={siteConfig.caseStudyUrl}
            className="btn btn-ghost min-h-9 px-3 text-porcelain"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('case_study_selected', { source: 'portfolio-bar' })}
          >
            View Case Study
          </a>
          <button
            type="button"
            className="btn btn-clay min-h-9"
            onClick={() => {
              trackEvent('che_xu_cta_selected', { cta: 'portfolio-bar' });
              setEnquiryOpen(true);
            }}
          >
            Build a Store Like This
          </button>
          <button
            type="button"
            className="btn btn-ghost min-h-9 px-3 text-porcelain"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, '1');
              setVisible(false);
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
