import React, { createContext, useContext, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export interface TabItem {
  id: string
  label: string | React.ReactNode
  content: React.ReactNode
}

export interface TabsProps {
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  className?: string
  tabs?: TabItem[]
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, onValueChange, children, className, tabs }) => {
  const defaultVal = defaultValue || (tabs && tabs[0]?.id) || ""
  const [activeTab, setActiveTabState] = useState(defaultVal)

  const setActiveTab = (value: string) => {
    setActiveTabState(value)
    onValueChange?.(value)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full flex flex-col gap-4", className)}>
        {tabs ? (
          <>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </>
        ) : (
          children
        )}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-slate-500 dark:text-slate-400", className)}>
    {children}
  </div>
)

export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({
  value,
  children,
  className,
}) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")
  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "text-foreground font-semibold" : "hover:text-slate-700 dark:hover:text-slate-200",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabPill"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg shadow-sm"
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export const TabsContent: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({
  value,
  children,
  className,
}) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")
  const { activeTab } = context

  if (activeTab !== value) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn("w-full focus:outline-none", className)}
    >
      {children}
    </motion.div>
  )
}
