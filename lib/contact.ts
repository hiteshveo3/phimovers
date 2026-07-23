/**
 * Single source of truth for phone / WhatsApp.
 */
export const PHONE_DISPLAY = "+44 7405 793433";
export const PHONE_E164 = "+447405793433";

export const PHONE_HREF = `tel:${PHONE_E164}`;
export const WHATSAPP_HREF = `https://wa.me/${PHONE_E164.replace("+", "")}`;

export const CALL_HREF = PHONE_HREF;
export const CALL_LABEL = PHONE_DISPLAY;

/** Single site-wide email — use nowhere else. */
export const EMAIL = "info@phimovers.co.uk";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const COMPANY_LEGAL_NAME = "Phi Movers Ltd";
export const SITE_URL = "https://phimovers.co.uk";
