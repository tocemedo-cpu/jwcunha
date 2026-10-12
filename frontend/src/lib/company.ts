/**
 * Public contact details are supplied at build time (see .env.example). Nothing is shown unless configured,
 * so the site never publishes made-up details.
 */
export const company = {
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || '',
  phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '',
  address: import.meta.env.VITE_COMPANY_ADDRESS?.trim() || '',
};
