import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { Button } from "../ui/Button"
import { useUser } from "../../context/UserContext"

export function Header() {
    const { user } = useUser()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleLogout = () => {
        localStorage.removeItem('simtik_auth')
        navigate('/login')
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold text-secondary-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-secondary-500" />
                </Button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-2 focus:outline-none p-1 rounded-md hover:bg-secondary-50 transition-colors"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <User className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-secondary-700">{user.name}</span>
                        <ChevronDown className={`h-4 w-4 text-secondary-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
