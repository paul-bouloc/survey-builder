import { EnIcon } from '@/components/icons/flags/en.icon'
import { FrIcon } from '@/components/icons/flags/fr.icon'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

export function LanguageSwitch() {
  const router = useRouter();
  const nextLocale = router.locale === 'fr' ? 'en' : 'fr';

  const toggle = async () => {
    await router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: nextLocale }
    );
  };

  return (
    <Button variant="outline" size="icon-sm" onClick={toggle}>
      <div className="relative size-4">
        <AnimatePresence mode="wait">
          {router.locale === 'fr' ? (
            <motion.div
              key="fr"
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <FrIcon />
            </motion.div>
          ) : (
            <motion.div
              key="en"
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <EnIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Button>
  )
}
