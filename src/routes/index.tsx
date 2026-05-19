import React from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { AppLayout } from "../components/layout/AppLayout"
import { Dashboard } from "../pages/Dashboard"
import { Pacientes } from "../pages/Pacientes"
import { Agenda } from "../pages/Agenda"
import { Prontuario } from "../pages/Prontuario"
import { Financeiro } from "../pages/Financeiro"
import { Estoque } from "../pages/Estoque"
import { Equipe } from "../pages/Equipe"
import { Relatorios } from "../pages/Relatorios"
import { Marketing } from "../pages/Marketing"
import { InteligenciaArtificial } from "../pages/InteligenciaArtificial"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "pacientes", element: <Pacientes /> },
      { path: "agenda", element: <Agenda /> },
      { path: "prontuario", element: <Prontuario /> },
      { path: "financeiro", element: <Financeiro /> },
      { path: "estoque", element: <Estoque /> },
      { path: "equipe", element: <Equipe /> },
      { path: "relatorios", element: <Relatorios /> },
      { path: "marketing", element: <Marketing /> },
      { path: "ia", element: <InteligenciaArtificial /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
])

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />
}
