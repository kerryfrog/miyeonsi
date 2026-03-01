'use client';

import { useSyncExternalStore } from 'react';
import Script from 'next/script';

const ADSENSE_CLIENT = 'ca-pub-2881048601217100';

const isXInAppBrowser = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  return ua.includes('twitter') || ua.includes('x-web-view');
};

export default function AdsenseScript() {
  const userAgent = useSyncExternalStore(
    () => () => {},
    () => navigator.userAgent ?? '',
    () => ''
  );
  const shouldLoadAds = userAgent !== '' && !isXInAppBrowser(userAgent);

  if (!shouldLoadAds) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
