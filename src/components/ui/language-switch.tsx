import { EnIcon } from '@/components/icons/flags/en.icon'
import { FrIcon } from '@/components/icons/flags/fr.icon'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

export function LanguageSwitch() {
  const router = useRouter();
  const nextLocale = router.locale === 'fr' ? 'en' : 'fr';
  const t = useTranslations('nav')('switchLanguage');

  const toggle = async () => {
    await router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: nextLocale }
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm" onClick={toggle} aria-label="Switch language">
          <div className="relative size-4 overflow-hidden">
            <AnimatePresence>
              {router.locale === 'fr' ? (
                <motion.div
                  key="fr"
                  aria-label="Français"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                    mass: 1.5
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <FrIcon />
                </motion.div>
              ) : (
                <motion.div
                  key="en"
                  aria-label="English"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                    mass: 1.5
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <EnIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t}</p>
      </TooltipContent>
    </Tooltip>
  )
}
