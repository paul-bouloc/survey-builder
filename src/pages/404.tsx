import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { routes } from '@/config/routes'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          But you can <Link href={routes.home.getHref()}>go home.</Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
