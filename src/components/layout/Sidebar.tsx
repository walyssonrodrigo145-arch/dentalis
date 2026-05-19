import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Calendar as CalendarIcon,
  Activity,
  Wallet,
  Package,
  UserCheck,
  BarChart3,
  MessageSquare,
  Sparkles,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "../../lib/utils"

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Pacientes", path: "/pacientes", icon: Users },
    { name: "Agenda Inteligente", path: "/agenda", icon: CalendarIcon },
    { name: "Prontuário", path: "/prontuario", icon: Activity },
    { name: "Financeiro", path: "/financeiro", icon: Wallet },
    { name: "Estoque", path: "/estoque", icon: Package },
    { name: "Equipe", path: "/equipe", icon: UserCheck },
    { name: "Relatórios", path: "/relatorios", icon: BarChart3 },
    { name: "Marketing", path: "/marketing", icon: MessageSquare },
    { name: "Inteligência Artificial", path: "/ia", icon: Sparkles },
  ]

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
      className="sticky top-0 h-screen flex flex-col border-r border-border bg-white dark:bg-slate-900 z-40 select-none shadow-sm"
    >
      {/* Logo & Clinic Name */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-border overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-premium">
            <Sparkles className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
              <span className="font-bold text-base leading-tight tracking-tight text-foreground">Dentalis OS</span>
              <span className="text-xs text-primary font-medium">Premium Edition</span>
            </motion.div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary-50 dark:bg-slate-800 text-primary font-semibold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                    />
                  )}
                  <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* User Profile & Actions */}
      <div className="p-4 border-t border-border flex flex-col gap-2">
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-1">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
              alt="Dra. Beatriz Silva"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary/20"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-foreground truncate">Dra. Beatriz Silva</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">CRO-SP 48291</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-around gap-1">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground transition-colors">
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span className="text-xs font-medium">Ajustes</span>}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors">
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="text-xs font-medium">Sair</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
