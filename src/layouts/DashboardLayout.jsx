import { Outlet, useNavigate } from "react-router-dom"
import { Sidebar } from "../components/layout/Sidebar"
import { Header } from "../components/layout/Header"
import { useEffect } from "react"

export default function DashboardLayout() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('simtik_auth')
        if (!token) {
            navigate('/login')
        }
    }, [navigate])

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="print:hidden">
                    <Header />
                </div>
                <main className="flex-1 p-6 overflow-y-auto print:p-0 print:overflow-visible">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
