import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SurveyEditCanvasComponentProps {
  className?: string
}

export default function SurveyEditCanvasComponent({
  className
}: SurveyEditCanvasComponentProps) {
  return (
    <ScrollArea
      className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}
    >
      <div className="mx-auto flex flex-col gap-4 px-4 py-4 md:max-w-[600px]">
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Inspector</CardDescription>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
