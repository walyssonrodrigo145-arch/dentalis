import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = "top", className }) => {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-premium whitespace-nowrap pointer-events-none border border-slate-700/50",
              positions[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
