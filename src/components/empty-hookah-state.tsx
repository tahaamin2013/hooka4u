'use client'

import { Bell, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyHookahState() {
  const handleRefresh = () => {
    // @ts-ignore
    window.location.reload()
  }

  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bell />
        </EmptyMedia>
        <EmptyTitle>No Data Found</EmptyTitle>
        <EmptyDescription>
          Ask your admin to add hookah&apos;s.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  )
}