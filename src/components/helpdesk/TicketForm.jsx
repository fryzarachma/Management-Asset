import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useState } from "react"

export function TicketForm({ onCancel, onSubmit, initialData }) {
    const [formData, setFormData] = useState(initialData || {
        subject: "",
        requester: "",
        priority: "Medium",
        description: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Subject</label>
                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Internet slow" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Requester Name</label>
                <Input name="requester" value={formData.requester} onChange={handleChange} placeholder="e.g. John Doe" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Priority</label>
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            {initialData && (
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Status</label>
                    <select
                        name="status"
                        value={formData.status || "Open"}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="flex min-h-[80px] w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    placeholder="Describe the issue..."
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Submit Ticket</Button>
            </div>
        </form>
    )
}
