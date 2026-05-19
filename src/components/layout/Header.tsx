import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Search, Bell, Sun, Moon, Plus, ChevronRight } from "lucide-react"
import { Button } from "../ui/Button"

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  })
  const [showNotifications, setShowNotifications] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  const routeNames: Record<string, string> = {
    "/": "Dashboard",
    "/pacientes": "Pacientes",
    "/agenda": "Agenda Inteligente",
    "/prontuario": "Prontuário Odontológico",
    "/financeiro": "Gestão Financeira",
    "/estoque": "Controle de Estoque",
    "/equipe": "Gestão da Equipe",
    "/relatorios": "Relatórios e Analytics",
    "/marketing": "Marketing e Automação",
    "/ia": "Inteligência Artificial",
  }

  const currentPath = location.pathname
  const pageTitle = routeNames[currentPath] || "Dentalis Premium"

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border bg-white/80 dark:bg-slate-900/80 px-8 backdrop-blur-md shadow-sm transition-colors">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">Dentalis OS</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
        <h1 className="text-lg font-bold text-foreground tracking-tight">{pageTitle}</h1>
      </div>

      {/* Global Search */}
      <div className="flex items-center gap-6">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar paciente, consulta ou fatura..."
            className="h-11 w-80 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/50 pl-10 pr-12 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          <kbd className="absolute right-3.5 hidden sm:inline-block rounded-md border border-border bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm">
            ⌘K
          </kbd>
        </div>

        {/* Quick Actions & Toggles */}
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate("/agenda")}>
            Agendar Consulta
          </Button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-white dark:bg-slate-900 p-4 shadow-modal z-50 animate-fade-in">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                  <span className="font-semibold text-sm text-foreground">Notificações Recentes</span>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Marcar como lidas</span>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  <div className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs font-semibold text-foreground">Confirmação de Consulta</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Carlos Eduardo confirmou para hoje às 14:30.</span>
                    <span className="text-[10px] text-slate-400">Há 5 min</span>
                  </div>
                  <div className="flex flex-col gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-xs font-semibold text-rose-500">Alerta de Estoque</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Resina Composta Z350 atingiu o estoque mínimo (3 un).</span>
                    <span className="text-[10px] text-slate-400">Há 1 hora</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          {/* User Avatar */}
          <div className="h-11 w-11 rounded-xl overflow-hidden border border-border shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
              alt="Dra. Beatriz Silva"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
