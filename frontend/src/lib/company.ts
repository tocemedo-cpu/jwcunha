/**
 * Company identification published on the site, taken from the company's commercial profile.
 * Email and address have defaults and can be overridden at build time (see .env.example); the phone number is shown
 * only when configured, so no made-up details are ever published.
 */
export const company = {
  legalName: 'Jelson & Wilson Cunha – Comércio e Prestação de Serviços, Lda.',
  taxId: '5001205536',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'jw@cunha.ao',
  phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '',
  address:
    import.meta.env.VITE_COMPANY_ADDRESS?.trim() || 'Rua 53, Projecto Nova Vida, n.º E 808, Kilamba Kiaxi, Luanda, Angola',
};
