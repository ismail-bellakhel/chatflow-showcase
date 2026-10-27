// Selected helpers from the private FAQ bot, followed by a showcase adapter.
// The adapter accepts an explicit FAQ list instead of reading a database.
function isLeadCaptureIntent(text) {
  const lower = text.toLowerCase();
  const patterns = ['speak to', 'talk to', 'human', 'agent', 'person', 'someone', 'contact me', 'call me', 'email me', 'reach out'];
  return patterns.some(p => lower.includes(p));
}

/**
 * Check if message contains an email address
 */
function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}


export { isLeadCaptureIntent, extractEmail };

// Adapted routing order: email -> handoff intent -> FAQ -> fallback.
// All replies describe local preview behavior; no contact details are stored or sent.
export function routeMessage(message, faqs = []) {
  const email = extractEmail(message);
  if (email) return {action:'email_captured', response:'Email recognised for this preview only. Nothing was saved or sent.'};
  if (isLeadCaptureIntent(message)) return {action:'capture_lead', response:'Human handoff requested. This preview does not contact a team.'};
  const lower = message.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some(word => lower.includes(word.toLowerCase()))) {
      return {action:'answered', response:faq.answer, category:faq.category};
    }
  }
  return {action:'capture_lead', response:'No matching FAQ. The next step would be a human handoff.'};
}
