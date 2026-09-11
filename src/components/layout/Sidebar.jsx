import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { LayoutDashboard, Monitor, LifeBuoy, Settings, ChevronDown, ChevronRight, Layers, Archive } from "lucide-react"
import { useState } from "react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    {
        icon: Monitor,
        label: "Assets",
        href: "/assets", // Parent href, maybe redirect or toggle
        subItems: [
            { icon: Monitor, label: "Perangkat", href: "/assets/devices" },
            { icon: Layers, label: "Aset", href: "/assets/inventory" },
            { icon: Archive, label: "Stock Opname ATK", href: "/assets/atk" },
        ]
    },
    { icon: LifeBuoy, label: "Helpdesk", href: "/helpdesk" },

]

export function Sidebar({ className }) {
    const location = useLocation()
    const [openMenus, setOpenMenus] = useState({ "/assets": true }) // Default open for now

    const toggleMenu = (href) => {
        setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }))
    }

    return (
        <div className={cn("pb-12 min-h-screen w-64 border-r border-secondary-200 bg-white", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary-600">
                        SIM-TIK
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <div key={item.label}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => toggleMenu(item.href)}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary-100 hover:text-secondary-900",
                                                location.pathname.startsWith(item.href) ? "text-secondary-900" : "text-secondary-500"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className="mr-2 h-4 w-4" />
                                                {item.label}
                                            </div>
                                            {openMenus[item.href] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </button>
                                        {openMenus[item.href] && (
                                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-secondary-100 pl-2">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        to={subItem.href}
                                                        className={cn(
                                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary-100 hover:text-secondary-900",
                                                            location.pathname === subItem.href ? "bg-secondary-100 text-primary-600" : "text-secondary-500"
                                                        )}
                                                    >
                                                        {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary-100 hover:text-secondary-900",
                                            location.pathname === item.href ? "bg-secondary-100 text-primary-600" : "text-secondary-500"
                                        )}
                                    >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-secondary-900">
                        Settings
                    </h2>
                    <div className="space-y-1">
                        <Link
                            to="/settings"
                            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
