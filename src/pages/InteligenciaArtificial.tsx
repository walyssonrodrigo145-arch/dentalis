import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Zap,
  TrendingUp,
  FileText,
  Package,
  MessageSquare,
} from "lucide-react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"

interface ChatMessage {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
}

export const InteligenciaArtificial: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Olá, Dra. Beatriz! Sou o **Dentalis AI**, seu assistente virtual odontológico. Posso ajudar a analisar o faturamento da clínica, sugerir compras de estoque ou redigir resumos clínicos. Escolha uma sugestão rápida abaixo ou digite sua pergunta!",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  // Respostas Pré-configuradas Inteligentes
  const aiResponses: Record<string, string> = {
    faturamento: `📊 **Análise de Faturamento de Maio 2026:**\n\nIdentifiquei que a clínica faturou **R$ 48.500,00** até o momento. A categoria com maior rentabilidade foi **Estética (R$ 18.200,00)**, impulsionada pelos pacotes de clareamento a laser.\n\n💡 **Recomendação AI:** Focar campanhas de reativação para pacientes de Ortodontia pode aumentar a receita em cerca de 15% no próximo mês.`,
    resumo: `📋 **Resumo Clínico — Carlos Eduardo Santos:**\n\n• **Queixa Principal:** Dor aguda no dente 46 e sensibilidade a frios.\n• **Histórico:** Restauração em resina há 2 anos no dente 16 e endodontia no dente 24.\n• **Alerta Médico:** Paciente hipertenso (Losartana 50mg) e relata ansiedade.\n\n⚠️ **Sugestão de Conduta:** Utilizar anestésico local sem epinefrina (ex: Prilocaína com Felipressina) e agendar no primeiro horário da manhã para reduzir estresse.`,
    campanha: `🚀 **Sugestão de Campanha de WhatsApp:**\n\n*"Olá {nome_paciente}! Notamos que sua última visita à Dentalis Premium foi há mais de 6 meses. Cuidar do sorriso é prevenir! Que tal agendarmos uma avaliação preventiva esta semana? Temos horários especiais para você!"*\n\n👉 *Taxa de conversão esperada com este texto: 22% a 28%*.`,
    estoque: `📦 **Análise Inteligente de Estoque:**\n\nVerifiquei seu inventário e identifiquei **1 item em estado CRÍTICO** (Luvas de Procedimento Nitrilo - restam apenas 2 caixas) e **2 itens em ALERTA**.\n\n🛒 **Sugestão de Compra Automática:** Sugiro emitir pedido de reposição com a *Dental Cremer* para obter frete grátis no lote de Luvas e Resina Z350.`,
  }

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputMessage("")
    setIsTyping(true)

    // Simula tempo de resposta da IA
    setTimeout(() => {
      let aiText = "Desculpe, estou funcionando em modo de simulação (Mock). Escolha um dos botões de sugestão rápida acima para ver demonstrações completas de análises geradas por IA!"

      if (text.toLowerCase().includes("faturamento") || text.toLowerCase().includes("financeiro")) {
        aiText = aiResponses.faturamento
      } else if (text.toLowerCase().includes("resumo") || text.toLowerCase().includes("carlos")) {
        aiText = aiResponses.resumo
      } else if (text.toLowerCase().includes("campanha") || text.toLowerCase().includes("marketing")) {
        aiText = aiResponses.campanha
      } else if (text.toLowerCase().includes("estoque") || text.toLowerCase().includes("material")) {
        aiText = aiResponses.estoque
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar da IA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Dentalis AI — Assistente Inteligente</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Análises preditivas, automação de resumos e insights de faturamento impulsionados por IA.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setMessages([messages[0]])}>
          Limpar Histórico
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Painel Lateral: Sugestões Rápidas (1 Coluna) */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm border border-border/80 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" /> Prompts Rápidos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Clique em qualquer sugestão abaixo para gerar relatórios e insights instantâneos.</p>

            <div className="space-y-3">
              <button
                onClick={() => handleSendMessage("Analisar faturamento e rentabilidade deste mês")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/60 text-left group"
              >
                <TrendingUp className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground leading-tight">Analisar Faturamento do Mês</span>
              </button>

              <button
                onClick={() => handleSendMessage("Gerar resumo clínico e conduta para o paciente Carlos Eduardo")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/60 text-left group"
              >
                <FileText className="h-4 w-4 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground leading-tight">Resumo Clínico do Paciente</span>
              </button>

              <button
                onClick={() => handleSendMessage("Redigir texto altamente persuasivo para campanha de reativação de WhatsApp")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/60 text-left group"
              >
                <MessageSquare className="h-4 w-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground leading-tight">Redigir Campanha de Marketing</span>
              </button>

              <button
                onClick={() => handleSendMessage("Verificar estoque atual e sugerir lista de compras inteligente")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/60 text-left group"
              >
                <Package className="h-4 w-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground leading-tight">Sugestão de Compra de Estoque</span>
              </button>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border border-border/80 bg-gradient-to-br from-purple-500/10 via-primary/5 to-transparent border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Modelo LLM Premium
            </h4>
            <p className="text-xs text-foreground leading-relaxed">
              O Dentalis AI utiliza processamento de linguagem natural avançado para cruzar dados de agendamentos, anamnese e fluxo de caixa em tempo real.
            </p>
          </Card>
        </div>

        {/* Interface de Chat (3 Colunas) */}
        <Card className="lg:col-span-3 shadow-sm border border-border/80 bg-white dark:bg-slate-900 flex flex-col h-[650px] overflow-hidden">
          {/* Cabeçalho do Chat */}
          <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Dentalis AI Assistant</h3>
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online e Pronto
                </span>
              </div>
            </div>
            <Badge variant="primary" className="text-[10px]">v2.4 Preditiva</Badge>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-sm ${
                  msg.sender === "user" ? "bg-primary text-white" : "bg-purple-500 text-white"
                }`}>
                  {msg.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                <div className={`max-w-[80%] space-y-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm inline-block ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-slate-50 dark:bg-slate-800 text-foreground border border-border/80 rounded-tl-none whitespace-pre-line"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 block px-1">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-border/80 rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Barra de Input */}
          <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-800/20">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Pergunte algo ao Dentalis AI (ex: Analise o faturamento ou resuma o paciente Carlos)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              />
              <Button variant="primary" type="submit" disabled={!inputMessage.trim() || isTyping} className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
