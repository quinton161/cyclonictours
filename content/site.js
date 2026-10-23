// Add only official, approved company details. Numbers use international digits,
// without a leading +, spaces, or punctuation. An empty value never opens WhatsApp.
export const site = {
  name: 'Cyclonic Tours',
  location: 'Victoria Falls, Zimbabwe',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263772619171',
  phone: '+263 77 261 9171',
  email: '',
  address: 'Stand 6578, Mkhosana Township, Victoria Falls, Zimbabwe',
  mapsUrl: 'https://www.google.com/maps?cid=18208153585167050167',
  hours: 'Open 24 hours',
  plusCode: '3R9J+93 Victoria Falls',
  checkedAt: '2026-10-23',
  socialLinks: [],
  description: 'Safaris, wildlife tours, airport transfers and personal travel arrangements from Victoria Falls, Zimbabwe.',
};

// Draft informational copy; the business must approve it before public launch.
export const faqs = [
  ['How do I enquire about a tour?', 'Choose an experience, enter your preferred date, traveller count and name, then continue to WhatsApp. Send the prepared message to request availability and a quotation.'],
  ['Can I request a customised tour?', 'Include your interests, travel dates and any special requirements in your enquiry. Ask Cyclonic Tours which arrangements are available for your visit.'],
  ['How do I confirm availability?', 'Availability is confirmed directly by Cyclonic Tours. Sending an enquiry does not reserve a place or confirm a booking.'],
  ['What should I bring?', 'Ask for the packing list for your chosen activity before travelling. Requirements depend on the experience, weather and itinerary.'],
  ['Where is Cyclonic Tours located?', 'Find us at Stand 6578, Mkhosana Township, Victoria Falls, Zimbabwe. Arrange your visit or pickup before travelling.'],
  ['How are payments handled?', 'Confirm the price, payment method, cancellation terms and booking conditions directly with Cyclonic Tours. This website does not collect payments.'],
];
