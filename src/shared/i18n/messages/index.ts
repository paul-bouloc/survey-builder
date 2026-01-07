import enAuth from './en/auth.json'
import enCommon from './en/common.json'
import enFormError from './en/form-error.json'
import enForm from './en/form.json'
import enNav from './en/nav.json'
import enRoutes from './en/routes.json'
import frAuth from './fr/auth.json'
import frCommon from './fr/common.json'
import frFormError from './fr/form-error.json'
import frForm from './fr/form.json'
import frNav from './fr/nav.json'
import frRoutes from './fr/routes.json'

export type Locale = 'fr' | 'en';

export const frMessages = {
  common: frCommon,
  nav: frNav,
  routes: frRoutes,
  form: frForm,
  auth: frAuth,
  formError: frFormError
} as const;

export const enMessages = {
  common: enCommon,
  nav: enNav,
  routes: enRoutes,
  form: enForm,
  auth: enAuth,
  formError: enFormError
} satisfies typeof frMessages;

export const messagesByLocale = {
  fr: frMessages,
  en: enMessages
} as const satisfies Record<Locale, typeof frMessages>;
