import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useDentalisStore } from "../../store/useDentalisStore"

export const AppLayout: React.FC = () => {
  const fetchData = useDentalisStore((state) => state.fetchData)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
