import { messagesByLocale } from './messages'

declare module 'next-intl' {
  interface AppConfig {
    Messages: (typeof messagesByLocale)['fr']
  }
}
