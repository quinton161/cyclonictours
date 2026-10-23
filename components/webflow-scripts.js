'use client';

import { useEffect } from 'react';

export default function WebflowScripts({ scripts, pageId, collection, itemSlug }) {
  useEffect(() => {
    const root = document.documentElement;

    if (pageId) root.setAttribute('data-wf-page', pageId);
    if (collection) root.setAttribute('data-wf-collection', collection);
    else root.removeAttribute('data-wf-collection');
    if (itemSlug) root.setAttribute('data-wf-item-slug', itemSlug);
    else root.removeAttribute('data-wf-item-slug');

    if (window.__webflowLoaderStarted) return;
    window.__webflowLoaderStarted = true;

    async function initialise() {
      // The original runtime mutates sliders, navigation and animated elements.
      // Start it after React hydrates, keeping those mutations out of hydration.
      await document.fonts.ready;
      for (const script of scripts) {
        const element = document.createElement('script');
        if (script.type === 'code') {
          element.text = script.value;
          document.body.appendChild(element);
        } else {
          await new Promise((resolve, reject) => {
            element.src = script.value;
            element.async = false;
            element.onload = resolve;
            element.onerror = () => reject(new Error(`Unable to load site animation script: ${script.value}`));
            document.body.appendChild(element);
          });
        }
      }
      await new Promise((resolve) => window.Webflow.push(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      // Late loading misses the browser's initial page-finish event. Use the
      // runtime's own update event so its original entrance timelines start.
      document.dispatchEvent(new CustomEvent('IX2_PAGE_UPDATE'));
      window.dispatchEvent(new Event('resize'));
      root.setAttribute('data-animations-ready', 'true');
    }
    initialise().catch((error) => console.error(error));
  }, [scripts, pageId, collection, itemSlug]);

  return null;
}
