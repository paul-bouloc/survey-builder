import frNav from './fr/nav.json'
import frRoutes from './fr/routes.json'

import enNav from './en/nav.json'
import enRoutes from './en/routes.json'

export type Locale = 'fr' | 'en';

export const frMessages = {
  nav: frNav,
  routes: frRoutes
} as const;

export const enMessages = {
  nav: enNav,
  routes: enRoutes
} satisfies typeof frMessages;

export const messagesByLocale = {
  fr: frMessages,
  en: enMessages
} as const satisfies Record<Locale, typeof frMessages>;
