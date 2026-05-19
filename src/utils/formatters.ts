/**
 * Formata um valor numérico para Moeda Brasileira (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Formata uma string de CPF (999.999.999-99)
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, "")
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

/**
 * Formata uma string de Telefone Celular ou Fixo ((99) 99999-9999)
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  return phone
}

/**
 * Formata uma string de data ISO para o formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("T")[0].split("-")
  return `${day}/${month}/${year}`
}

/**
 * Retorna as iniciais de um nome para uso em Avatares
 */
export const getInitials = (name: string): string => {
  if (!name) return ""
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
