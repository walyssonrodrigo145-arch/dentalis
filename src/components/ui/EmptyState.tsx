import React from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Button } from "./Button"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-slate-50/50 dark:bg-slate-900/50"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-slate-800 text-primary mb-4 shadow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
