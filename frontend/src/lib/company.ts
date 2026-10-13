/**
 * Company identification published on the site: legal name and tax ID from the commercial profile, plus the public
 * email and address. The email and address have built-in defaults and may be overridden at build time with
 * VITE_CONTACT_EMAIL / VITE_COMPANY_ADDRESS (an empty value keeps the default). No telephone number is published
 * and there is no phone variable: add one here, with its display, once the company supplies a number.
 */
export const company = {
  legalName: 'Jelson & Wilson Cunha – Comércio e Prestação de Serviços, Lda.',
  taxId: '5001205536',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'jw@cunha.ao',
  address:
    import.meta.env.VITE_COMPANY_ADDRESS?.trim() || 'Rua 53, Projecto Nova Vida, n.º E 808, Kilamba Kiaxi, Luanda, Angola',
};
