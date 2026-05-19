import React, { useState } from "react"
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  Maximize2,
  Minimize2,
  Menu,
  Search,
  Trash2,
  Check,
  User,
  PlusCircle,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import type { Appointment } from "../store/useDentalisStore"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"

// Mock de Feriados no Brasil
const holidays: Record<string, string> = {
  "2026-04-03": "Paixão de Cristo",
  "2026-04-05": "Domingo de Páscoa",
  "2026-04-21": "Tiradentes",
  "2026-05-01": "Dia do Trabalho",
  "2026-06-04": "Corpus Christi",
  "2026-09-07": "Independência do Brasil",
  "2026-10-12": "Nossa Senhora Aparecida",
  "2026-11-02": "Finados",
  "2026-11-15": "Proclamação da República",
  "2026-11-20": "Consciência Negra",
  "2026-12-25": "Natal",
}

// Helpers de Data
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay() // 0 = Dom, 1 = Seg, etc.
}

const adjustMonth = (dateStr: string, increment: number) => {
  const d = new Date(dateStr + "T00:00:00")
  d.setMonth(d.getMonth() + increment)
  return d.toISOString().split("T")[0]
}

const isSameDay = (dateStr1: string, dateStr2: string) => {
  return dateStr1.split("T")[0] === dateStr2.split("T")[0]
}

const isToday = (dateStr: string) => {
  return dateStr === new Date().toISOString().split("T")[0]
}

export const Agenda: React.FC = () => {
  const {
    appointments,
    patients,
    teamMembers,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
  } = useDentalisStore()

  // Estados de Controle Principal
  const [currentView, setCurrentView] = useState<"diario" | "semanal" | "mensal">("mensal")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [miniCalDate, setMiniCalDate] = useState<string>(selectedDate)
  
  // Toggles de Layout (Widescreen e Sidebar)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  // Filtros de busca e checkboxes
  const [searchPerson, setSearchPerson] = useState<string>("")
  const [activeDentists, setActiveDentists] = useState<string[]>(
    teamMembers.filter((m) => m.role === "dentista").map((d) => d.id)
  )
  const [showHolidays, setShowHolidays] = useState<boolean>(true)

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAptDetails, setSelectedAptDetails] = useState<Appointment | null>(null)

  // Form de Novo Agendamento
  const [patientId, setPatientId] = useState(patients[0]?.id || "")
  const [dentistId, setDentistId] = useState(teamMembers[0]?.id || "")
  const [date, setDate] = useState(selectedDate)
  const [time, setTime] = useState("14:00")
  const [duration, setDuration] = useState("60")
  const [procedure, setProcedure] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<Appointment["status"]>("confirmado")

  // Cores por profissional para estilo Google Calendar
  const getDentistColor = (dentistId: string) => {
    switch (dentistId) {
      case "den-1": // Dra. Beatriz
        return {
          bg: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-900/30 hover:bg-sky-100/80",
          dot: "bg-sky-500",
        }
      case "den-2": // Dr. Rodrigo
        return {
          bg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/30 hover:bg-amber-100/80",
          dot: "bg-amber-500",
        }
      case "den-3": // Dra. Camila
        return {
          bg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900/30 hover:bg-purple-100/80",
          dot: "bg-purple-500",
        }
      default:
        return {
          bg: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:bg-slate-100",
          dot: "bg-slate-500",
        }
    }
  }

  // Geração de Grid Mensal (Calcula 42 dias)
  const generateMonthGrid = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00")
    const year = d.getFullYear()
    const month = d.getMonth()

    const daysInCurrentMonth = getDaysInMonth(year, month)
    const firstDayIndex = getFirstDayOfMonth(year, month)

    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

    const grid: { dateString: string; dayNum: number; isCurrentMonth: boolean }[] = []

    // Dias do mês anterior
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const mStr = String(prevMonth + 1).padStart(2, "0")
      const dStr = String(day).padStart(2, "0")
      grid.push({
        dateString: `${prevYear}-${mStr}-${dStr}`,
        dayNum: day,
        isCurrentMonth: false,
      })
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const mStr = String(month + 1).padStart(2, "0")
      const dStr = String(i).padStart(2, "0")
      grid.push({
        dateString: `${year}-${mStr}-${dStr}`,
        dayNum: i,
        isCurrentMonth: true,
      })
    }

    // Dias do próximo mês
    const remainingSlots = 42 - grid.length
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    for (let i = 1; i <= remainingSlots; i++) {
      const mStr = String(nextMonth + 1).padStart(2, "0")
      const dStr = String(i).padStart(2, "0")
      grid.push({
        dateString: `${nextYear}-${mStr}-${dStr}`,
        dayNum: i,
        isCurrentMonth: false,
      })
    }

    return grid
  }

  // Geração de Dias da Semana
  const getWeekDays = (dateStr: string) => {
    const selected = new Date(dateStr + "T00:00:00")
    const start = new Date(selected)
    start.setDate(selected.getDate() - selected.getDay()) // Domingo

    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days
  }

  // Filtragem Geral de Agendamentos
  const getFilteredAppointments = () => {
    return appointments.filter((apt) => {
      // Filtro por dentista ativo na barra lateral
      const matchesDentist = activeDentists.includes(apt.dentistId)
      
      // Filtro por nome digitado na busca
      const matchesSearch =
        searchPerson.trim() === "" ||
        apt.patientName.toLowerCase().includes(searchPerson.toLowerCase()) ||
        apt.procedure.toLowerCase().includes(searchPerson.toLowerCase())

      return matchesDentist && matchesSearch
    })
  }

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const p = patients.find((pat) => pat.id === patientId)
    const d = teamMembers.find((den) => den.id === dentistId)

    if (!p || !d || !procedure) return

    addAppointment({
      patientId: p.id,
      patientName: p.name,
      dentistId: d.id,
      dentistName: d.name,
      date,
      time,
      duration: Number(duration),
      status,
      procedure,
      notes,
    })

    setIsModalOpen(false)
    setProcedure("")
    setNotes("")
  }

  const handleDayClick = (dateString: string) => {
    setSelectedDate(dateString)
    setMiniCalDate(dateString)
  }

  const handleCellClick = (dateString: string) => {
    setDate(dateString)
    setTime("14:00")
    setIsModalOpen(true)
  }

  const handleTimeSlotClick = (dateString: string, hourStr: string) => {
    setDate(dateString)
    setTime(hourStr)
    setIsModalOpen(true)
  }

  const handleToggleDentist = (dentistId: string) => {
    if (activeDentists.includes(dentistId)) {
      setActiveDentists(activeDentists.filter((id) => id !== dentistId))
    } else {
      setActiveDentists([...activeDentists, dentistId])
    }
  }

  const handleNavigateView = (direction: number) => {
    if (currentView === "mensal") {
      setSelectedDate(adjustMonth(selectedDate, direction))
    } else if (currentView === "semanal") {
      const d = new Date(selectedDate + "T00:00:00")
      d.setDate(d.getDate() + direction * 7)
      setSelectedDate(d.toISOString().split("T")[0])
    } else {
      const d = new Date(selectedDate + "T00:00:00")
      d.setDate(d.getDate() + direction)
      setSelectedDate(d.toISOString().split("T")[0])
    }
  }

  const formatHeaderMonth = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  const weekdaysHeader = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."]
  const miniWeekdays = ["D", "S", "T", "Q", "Q", "S", "S"]
  
  const currentMonthGrid = generateMonthGrid(selectedDate)
  const currentMiniGrid = generateMonthGrid(miniCalDate)
  const weekDaysList = getWeekDays(selectedDate)

  const hoursList = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ]

  return (
    <div
      className={`${
        isExpanded
          ? "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 p-6 flex flex-col h-screen overflow-hidden"
          : "space-y-6 animate-fade-in pb-12 flex flex-col"
      }`}
    >
      {/* HEADER DA AGENDA */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-border shadow-sm flex-wrap gap-4 select-none shrink-0">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu que recolhe a barra lateral da Agenda */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
            title="Recolher barra lateral"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Agenda</h2>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const todayStr = new Date().toISOString().split("T")[0]
                setSelectedDate(todayStr)
                setMiniCalDate(todayStr)
              }}
            >
              Hoje
            </Button>
            <div className="flex items-center">
              <button
                onClick={() => handleNavigateView(-1)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleNavigateView(1)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <span className="text-base font-bold text-foreground capitalize ml-2">
            {formatHeaderMonth(selectedDate)}
          </span>
        </div>

        {/* Busca e Toggles de Visões */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchPerson}
              onChange={(e) => setSearchPerson(e.target.value)}
              className="h-9 pl-9 pr-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-850 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>

          {/* Selectores de Visões */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border">
            {(["diario", "semanal", "mensal"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  currentView === view
                    ? "bg-white dark:bg-slate-900 text-foreground shadow-sm"
                    : "text-slate-500 hover:text-foreground"
                }`}
              >
                {view === "diario" ? "Dia" : view === "semanal" ? "Semana" : "Mês"}
              </button>
            ))}
          </div>

          {/* Botão de Expansão (Widescreen) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 border border-border hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
            title={isExpanded ? "Ocultar tela cheia" : "Modo expandido de tela cheia"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL DA AGENDA */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* BARRA LATERAL DA AGENDA (Google Calendar Style) */}
        {isSidebarOpen && (
          <div className="w-64 shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 select-none select-none">
            {/* Botão Criar Novo */}
            <button
              onClick={() => {
                setDate(selectedDate)
                setIsModalOpen(true)
              }}
              className="w-40 flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-border shadow-md hover:shadow-lg transition-all text-sm font-bold text-slate-700 dark:text-slate-200 group active:scale-95"
            >
              <PlusCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Criar</span>
            </button>

            {/* MINI CALENDÁRIO */}
            <Card className="p-4 border border-border/80 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground capitalize">
                  {formatHeaderMonth(miniCalDate)}
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => setMiniCalDate(adjustMonth(miniCalDate, -1))}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setMiniCalDate(adjustMonth(miniCalDate, 1))}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid Mini Calendário */}
              <div className="grid grid-cols-7 gap-y-1 text-center text-[10px]">
                {miniWeekdays.map((w, idx) => (
                  <span key={idx} className="font-semibold text-slate-400 py-1">{w}</span>
                ))}
                
                {currentMiniGrid.map((cell, idx) => {
                  const isCellSelected = cell.dateString === selectedDate
                  const isCellToday = isToday(cell.dateString)
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(cell.dateString)}
                      className={`h-6 w-6 mx-auto flex items-center justify-center rounded-full transition-colors ${
                        !cell.isCurrentMonth ? "text-slate-300 dark:text-slate-700" : "text-foreground font-medium"
                      } ${
                        isCellSelected
                          ? "bg-primary/20 text-primary font-bold"
                          : isCellToday
                          ? "bg-primary text-white font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {cell.dayNum}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Pesquisar Pessoas */}
            <div className="space-y-1 bg-white dark:bg-slate-900 rounded-xl p-3 border border-border shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Filtrar Paciente</span>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nome do paciente..."
                  value={searchPerson}
                  onChange={(e) => setSearchPerson(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Filtros por Dentista (Minhas Agendas) */}
            <div className="space-y-3 bg-white dark:bg-slate-900 rounded-xl p-4 border border-border shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Minhas Agendas</span>
              <div className="space-y-2.5">
                {teamMembers.filter((m) => m.role === "dentista").map((den) => {
                  const colors = getDentistColor(den.id)
                  const isChecked = activeDentists.includes(den.id)

                  return (
                    <label key={den.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleDentist(den.id)}
                          className="sr-only"
                        />
                        <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                          isChecked ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-700 group-hover:border-primary"
                        }`}>
                          {isChecked && <Check className="h-3 w-3 text-white stroke-[3]" />}
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: colors.dot.replace("bg-", "") }} />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium group-hover:text-foreground transition-colors line-clamp-1">
                        {den.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Outras Agendas (Feriados) */}
            <div className="space-y-3 bg-white dark:bg-slate-900 rounded-xl p-4 border border-border shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Outras Agendas</span>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={showHolidays}
                    onChange={() => setShowHolidays(!showHolidays)}
                    className="sr-only"
                  />
                  <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                    showHolidays ? "bg-emerald-600 border-emerald-600" : "border-slate-300 dark:border-slate-700 group-hover:border-emerald-600"
                  }`}>
                    {showHolidays && <Check className="h-3 w-3 text-white stroke-[3]" />}
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full shrink-0 bg-emerald-500" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium group-hover:text-foreground transition-colors">
                  Feriados no Brasil
                </span>
              </label>
            </div>
          </div>
        )}

        {/* GRADE DE VISUALIZAÇÃO DO CALENDÁRIO */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
          
          {/* VISÃO MENSAL */}
          {currentView === "mensal" && (
            <div className="flex-1 flex flex-col overflow-hidden select-none">
              {/* Cabeçalho de Dias da Semana */}
              <div className="grid grid-cols-7 border-b border-border/80 bg-slate-50 dark:bg-slate-800/50 shrink-0">
                {weekdaysHeader.map((day, idx) => (
                  <div key={idx} className="text-center py-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid de Dias */}
              <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-y-auto min-h-0 bg-slate-200/20 dark:bg-slate-950/20 gap-[1px]">
                {currentMonthGrid.map((cell, idx) => {
                  const holiday = showHolidays ? holidays[cell.dateString] : null
                  const cellApts = getFilteredAppointments().filter((apt) => isSameDay(apt.date, cell.dateString))
                  const cellToday = isToday(cell.dateString)
                  const isSelected = cell.dateString === selectedDate

                  return (
                    <div
                      key={idx}
                      className={`bg-white dark:bg-slate-900 p-1 flex flex-col gap-1 min-h-[90px] group transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-800/10 cursor-pointer ${
                        !cell.isCurrentMonth ? "opacity-40" : ""
                      } ${isSelected ? "ring-1 ring-primary/40 ring-inset" : ""}`}
                      onClick={() => handleCellClick(cell.dateString)}
                    >
                      {/* Número do Dia */}
                      <div className="flex items-center justify-between px-1">
                        <span
                          className={`text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full ${
                            cellToday
                              ? "bg-primary text-white"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {cell.dayNum}
                        </span>
                      </div>

                      {/* Itens do Dia (Feriados e Agendamentos) */}
                      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none" onClick={(e) => e.stopPropagation()}>
                        {holiday && (
                          <div className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                            🎉 {holiday}
                          </div>
                        )}

                        {cellApts.map((apt) => {
                          const style = getDentistColor(apt.dentistId)
                          return (
                            <div
                              key={apt.id}
                              onClick={() => setSelectedAptDetails(apt)}
                              className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1.5 transition-all truncate cursor-pointer ${style.bg}`}
                              title={`${apt.time} - ${apt.patientName} (${apt.procedure})`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
                              <span className="font-semibold shrink-0">{apt.time}</span>
                              <span className="truncate">{apt.patientName}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* VISÃO SEMANAL */}
          {currentView === "semanal" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Dias da Semana */}
              <div className="grid grid-cols-8 border-b border-border bg-slate-50 dark:bg-slate-800/50 shrink-0">
                <div className="border-r border-border py-2 text-center text-xs font-semibold text-slate-400">Horário</div>
                {weekDaysList.map((day, idx) => {
                  const dayStr = day.toISOString().split("T")[0]
                  const cellToday = isToday(dayStr)
                  return (
                    <div key={idx} className="py-2 text-center flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {weekdaysHeader[day.getDay()]}
                      </span>
                      <span className={`text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full mt-0.5 ${
                        cellToday ? "bg-primary text-white" : "text-slate-650"
                      }`}>
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots da Semana */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-8 divide-y divide-border/60">
                  {hoursList.map((hour, hIdx) => (
                    <React.Fragment key={hIdx}>
                      <div className="border-r border-border text-center py-4 text-xs font-semibold text-slate-400 bg-slate-50/30 dark:bg-slate-800/10">
                        {hour}
                      </div>

                      {weekDaysList.map((day, dIdx) => {
                        const dayStr = day.toISOString().split("T")[0]
                        const apts = getFilteredAppointments().filter(
                          (a) => isSameDay(a.date, dayStr) && a.time.startsWith(hour.substring(0, 2))
                        )

                        return (
                          <div
                            key={dIdx}
                            onClick={() => handleTimeSlotClick(dayStr, hour)}
                            className="relative min-h-[50px] border-r border-border/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors p-1 cursor-pointer"
                          >
                            {apts.map((apt) => {
                              const style = getDentistColor(apt.dentistId)
                              return (
                                <div
                                  key={apt.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedAptDetails(apt)
                                  }}
                                  className={`p-1.5 rounded border text-[10px] font-bold truncate flex flex-col gap-0.5 cursor-pointer shadow-sm ${style.bg}`}
                                >
                                  <div className="flex items-center gap-1">
                                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                    <span>{apt.time} - {apt.patientName}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                    {apt.procedure}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VISÃO DIÁRIA */}
          {currentView === "diario" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/40 dark:bg-slate-800/30 shrink-0">
                <span className="text-sm font-bold text-foreground">Horários agendados</span>
                <span className="text-xs text-slate-400">
                  {getFilteredAppointments().filter((a) => isSameDay(a.date, selectedDate)).length} consultas
                </span>
              </div>

              {/* Time Slots do Dia */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {hoursList.map((hour, idx) => {
                  const apts = getFilteredAppointments().filter(
                    (a) => isSameDay(a.date, selectedDate) && a.time.startsWith(hour.substring(0, 2))
                  )

                  return (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-14 text-right text-xs font-bold text-slate-400 pt-3">{hour}</div>
                      <div className="flex-1 min-h-[60px] border-b border-border/80 pb-3 flex flex-col gap-2">
                        {apts.length === 0 ? (
                          <button
                            onClick={() => handleTimeSlotClick(selectedDate, hour)}
                            className="w-max px-3 py-1.5 text-xs text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl border border-dashed border-border/60 hover:border-primary transition-all flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" /> Agendar horário
                          </button>
                        ) : (
                          apts.map((apt) => {
                            const style = getDentistColor(apt.dentistId)
                            return (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedAptDetails(apt)}
                                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm cursor-pointer transition-colors ${style.bg}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-border flex items-center justify-center font-bold text-slate-700 dark:text-slate-350">
                                    {apt.patientName.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-foreground">{apt.patientName}</h4>
                                    <p className="text-xs font-semibold text-primary mt-0.5">{apt.procedure}</p>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                      <span>Dr(a): {apt.dentistName}</span>
                                      <span>•</span>
                                      <span>Duração: {apt.duration} min</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                  {apt.status === "confirmado" && (
                                    <Badge variant="primary" className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Confirmado
                                    </Badge>
                                  )}
                                  {apt.status === "em_atendimento" && (
                                    <Badge variant="warning" className="flex items-center gap-1">
                                      <Play className="h-3 w-3 animate-pulse" /> Em Atendimento
                                    </Badge>
                                  )}
                                  {apt.status === "finalizado" && (
                                    <Badge variant="success" className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Finalizado
                                    </Badge>
                                  )}
                                  {apt.status === "aguardando" && (
                                    <Badge variant="default" className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Aguardando
                                    </Badge>
                                  )}
                                  {apt.status === "falta" && (
                                    <Badge variant="destructive" className="flex items-center gap-1">
                                      <XCircle className="h-3 w-3" /> Falta
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* POPUP DE DETALHES DO AGENDAMENTO (Estilo Google Calendar) */}
      <Modal
        isOpen={!!selectedAptDetails}
        onClose={() => setSelectedAptDetails(null)}
        title="Detalhes da Consulta"
      >
        {selectedAptDetails && (
          <div className="space-y-6 mt-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground">{selectedAptDetails.patientName}</h4>
                <p className="text-xs text-primary font-semibold mt-0.5">{selectedAptDetails.procedure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-650 dark:text-slate-350 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Horário: <strong>{selectedAptDetails.time}</strong> ({selectedAptDetails.duration} min)</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" />
                <span>Data: <strong>{selectedAptDetails.date.split("-").reverse().join("/")}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span>Profissional: <strong>{selectedAptDetails.dentistName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="capitalize">Status: <strong>{selectedAptDetails.status.replace("_", " ")}</strong></span>
              </div>
            </div>

            {selectedAptDetails.notes && (
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 italic">
                "{selectedAptDetails.notes}"
              </div>
            )}

            {/* Ações Rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border">
              <button
                onClick={() => {
                  deleteAppointment(selectedAptDetails.id)
                  setSelectedAptDetails(null)
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1.5 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Desmarcar Consulta
              </button>

              <div className="flex items-center gap-2">
                <Select
                  value={selectedAptDetails.status}
                  onChange={(e) => {
                    updateAppointmentStatus(selectedAptDetails.id, e.target.value as "confirmado" | "aguardando" | "em_atendimento" | "finalizado" | "falta")
                    setSelectedAptDetails(null)
                  }}
                  className="h-8 text-xs font-semibold"
                >
                  <option value="confirmado">Confirmado</option>
                  <option value="aguardando">Aguardando na Recepção</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="falta">Falta</option>
                </Select>
                <Button variant="primary" size="sm" onClick={() => setSelectedAptDetails(null)}>
                  Ok
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL DE NOVO AGENDAMENTO */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Agendamento">
        <form onSubmit={handleCreateAppointment} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select label="Paciente" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>{pat.name} ({pat.cpf})</option>
              ))}
            </Select>

            <Select label="Dentista Responsável" value={dentistId} onChange={(e) => setDentistId(e.target.value)}>
              {teamMembers.filter((m) => m.role === "dentista").map((den) => (
                <option key={den.id} value={den.id}>{den.name}</option>
              ))}
            </Select>

            <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

            <Input label="Horário" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

            <Select label="Duração Estimada" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1 hora e 30 minutos</option>
              <option value="120">2 horas</option>
            </Select>

            <Select label="Status Inicial" value={status} onChange={(e) => setStatus(e.target.value as "confirmado" | "aguardando" | "em_atendimento" | "finalizado" | "falta")}>
              <option value="confirmado">Confirmado</option>
              <option value="aguardando">Aguardando na Recepção</option>
              <option value="em_atendimento">Em Atendimento</option>
            </Select>
          </div>

          <Input label="Procedimento / Tratamento" placeholder="Ex: Restauração Resina Composta, Clareamento..." value={procedure} onChange={(e) => setProcedure(e.target.value)} required />

          <Input label="Observações Adicionais (Opcional)" placeholder="Ex: Paciente com sensibilidade..." value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Confirmar Agendamento</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
