import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"

const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in zoom-in-95">
            <div
                className={cn(
                    "relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg sm:p-8",
                    className
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold leading-none tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-secondary-950 focus:ring-offset-2"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}

export { Modal }
