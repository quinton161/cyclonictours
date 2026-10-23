'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { site } from '@/content/site';
import { tours } from '@/content/tours';
import { photoById } from '@/content/photos';
import { buildEnquiryUrl, localDate } from '@/lib/whatsapp';

function EnquiryForm({ initialTour = '' }) {
  const id = useId();
  const [status, setStatus] = useState('');
  const [preparedUrl, setPreparedUrl] = useState('');
  const [minimumDate, setMinimumDate] = useState('');
  useEffect(() => setMinimumDate(localDate()), []);

  function submit(event) {
    event.preventDefault();
    setPreparedUrl('');
    const values = new FormData(event.currentTarget);
    const nameField = event.currentTarget.elements.namedItem('name');
    if (!String(values.get('name')).trim()) {
      nameField.setCustomValidity('Please enter your name.');
      nameField.reportValidity();
      return;
    }
    if (!/^\d{10,15}$/.test(site.whatsapp)) {
      setStatus('The official WhatsApp contact details have not been published yet. Please check back soon. Your enquiry has not been sent.');
      return;
    }
    const tour = tours.find((item) => item.slug === values.get('tour'));
    const url = buildEnquiryUrl({ number: site.whatsapp, tourName: tour?.name || 'a customised trip', date: values.get('date'), travellers: values.get('travellers'), name: values.get('name'), notes: values.get('notes') || '' });
    if (!url) {
      setStatus('Please enter a valid date from today onwards and a whole number of travellers between 1 and 99.');
      return;
    }
    setPreparedUrl(url);
    setStatus('Your message is ready. Review and send it in WhatsApp. Availability and your booking still need to be confirmed by Cyclonic Tours.');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <form className="ct-enquiry" onSubmit={submit}>
      <label htmlFor={`${id}-tour`}>Experience
        <select id={`${id}-tour`} name="tour" defaultValue={initialTour} required>
          <option value="">Choose an experience</option>
          {tours.map((tour) => <option key={tour.slug} value={tour.slug}>{tour.name}</option>)}
          <option value="custom">A customised trip</option>
        </select>
      </label>
      <label htmlFor={`${id}-name`}>Your name
        <input id={`${id}-name`} name="name" autoComplete="name" placeholder="Your full name" maxLength={100} required onInput={(event) => event.currentTarget.setCustomValidity('')} />
      </label>
      <div className="ct-form-row">
        <label htmlFor={`${id}-date`}>Preferred date
          <input id={`${id}-date`} type="date" name="date" min={minimumDate} required />
        </label>
        <label htmlFor={`${id}-travellers`}>Travellers
          <input id={`${id}-travellers`} type="number" name="travellers" min="1" max="99" step="1" defaultValue="2" required inputMode="numeric" />
        </label>
      </div>
      <label htmlFor={`${id}-notes`}>Anything else? <span>(optional)</span>
        <textarea id={`${id}-notes`} name="notes" rows={3} maxLength={1500} placeholder="Your interests, pickup needs or questions" />
      </label>
      <button type="submit" className="ct-solid-button">Continue to WhatsApp <span aria-hidden="true">↗</span></button>
      <p>Nothing is sent automatically. You’ll review and send the message in WhatsApp. This enquiry does not confirm a reservation or payment.</p>
      {status && <p className="ct-form-status" role="status">{status}</p>}
      {preparedUrl && <a href={preparedUrl} target="_blank" rel="noopener noreferrer" className="ct-text-link">Open your prepared WhatsApp message ↗</a>}
      <p><a href="/privacy">How your enquiry information is used</a></p>
    </form>
  );
}

export default function SiteInteractions() {
  const enquiryDialog = useRef(null);
  const photoDialog = useRef(null);
  const [selectedTour, setSelectedTour] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [portals, setPortals] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-ct-ready', 'true');
    const hosts = [...document.querySelectorAll('[data-enquiry-form]')];
    hosts.forEach((host) => host.replaceChildren());
    setPortals(hosts);
    function click(event) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const enquiry = target.closest('[data-enquire]');
      if (enquiry) {
        event.preventDefault(); event.stopPropagation();
        setSelectedTour(enquiry.getAttribute('data-enquire') || '');
        enquiryDialog.current?.showModal(); return;
      }
      const picture = target.closest('[data-photo]');
      if (picture) {
        event.preventDefault();
        const photo = photoById[picture.getAttribute('data-photo')];
        if (photo) { setSelectedPhoto(photo); photoDialog.current?.showModal(); }
        return;
      }
      const filter = target.closest('[data-filter]');
      if (filter) {
        const kind = filter.getAttribute('data-filter'); const value = filter.getAttribute('data-value');
        document.querySelectorAll(`[data-filter="${kind}"]`).forEach((button) => button.setAttribute('aria-pressed', String(button === filter)));
        document.querySelectorAll(`[data-filter-list="${kind}"] > [data-category]`).forEach((item) => { item.hidden = value !== 'All' && item.getAttribute('data-category') !== value; });
      }
      const question = target.closest('.faq-question[role="button"]');
      if (question) question.setAttribute('aria-expanded', String(question.getAttribute('aria-expanded') !== 'true'));
    }
    function keydown(event) {
      const question = event.target.closest?.('.faq-question[role="button"]');
      if (question && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); question.click(); }
    }
    document.addEventListener('click', click, true); document.addEventListener('keydown', keydown);
    return () => { document.documentElement.removeAttribute('data-ct-ready'); document.removeEventListener('click', click, true); document.removeEventListener('keydown', keydown); };
  }, []);

  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
  }
  return (
    <>
      {portals.map((element, index) => createPortal(<><h3>Let’s plan your experience</h3><p className="ct-dialog-intro">Share a few details to prepare your enquiry.</p><EnquiryForm initialTour={element.getAttribute('data-enquiry-form')} /></>, element, String(index)))}
      <button type="button" className="ct-whatsapp-float" data-enquire aria-label="Start a WhatsApp travel enquiry">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.5-4.8A9 9 0 1 1 21 11.5Z"/><path d="M8 7c0 5 4 9 9 9l1-3-3-1-1 1c-2-1-3-2-4-4l1-1-1-2-2 1Z"/></svg>
        <span>WhatsApp enquiry</span>
      </button>
      <dialog ref={enquiryDialog} className="ct-dialog" aria-labelledby="ct-enquiry-title" onClick={closeOnBackdrop}>
        <button type="button" className="ct-dialog-close" aria-label="Close enquiry" onClick={() => enquiryDialog.current.close()}>×</button>
        <h2 id="ct-enquiry-title">Your adventure starts here.</h2>
        <p className="ct-dialog-intro">Tell Cyclonic Tours what you have in mind. Availability, pricing and arrangements are confirmed directly.</p>
        <EnquiryForm key={selectedTour} initialTour={selectedTour} />
      </dialog>
      <dialog ref={photoDialog} className="ct-dialog ct-lightbox" aria-label="Destination photograph" onClick={closeOnBackdrop}>
        <button type="button" className="ct-dialog-close" aria-label="Close photograph" onClick={() => photoDialog.current.close()}>×</button>
        {selectedPhoto && <><img src={`/images/${selectedPhoto.file}`} alt={selectedPhoto.title} /><p>{selectedPhoto.title} · {selectedPhoto.author} · <a href={selectedPhoto.source} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p></>}
      </dialog>
    </>
  );
}
