import { useEffect } from 'react';
import CartDrawer from './CartDrawer';
import EnquiryDrawer from './EnquiryDrawer';
import PortfolioBar from './PortfolioBar';
import StickyCartButton from './StickyCartButton';
import { openEnquiryDrawer } from './store';

interface Props {
  turnstileSiteKey?: string;
}

export default function AppShell({ turnstileSiteKey = '' }: Props) {
  useEffect(() => {
    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-open-enquiry]')) {
        event.preventDefault();
        openEnquiryDrawer();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      <PortfolioBar />
      <CartDrawer />
      <EnquiryDrawer turnstileSiteKey={turnstileSiteKey} />
      <StickyCartButton />
    </>
  );
}
