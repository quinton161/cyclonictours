export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function buildEnquiryUrl({ number, tourName, date, travellers, name, notes = '' }) {
  if (!/^\d{10,15}$/.test(number || '')) return null;
  if (!name?.trim() || !tourName?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date || '') || date < localDate()) return null;
  const parsedDate = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0,10) !== date) return null;
  const count = Number(travellers);
  if (!Number.isInteger(count) || count < 1 || count > 99) return null;
  const message = `Hello Cyclonic Tours! I'm interested in ${tourName}.\n\nPreferred date: ${date}\n\nNumber of travellers: ${count}\n\nMy name: ${name.trim()}\n\nCould you please confirm availability, pricing and booking details?${notes.trim() ? `\n\nSpecial notes: ${notes.trim()}` : ''}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
