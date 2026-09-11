import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Monitor, Box, Activity } from "lucide-react"

const data = [
    { name: 'Jan', tickets: 40 },
    { name: 'Feb', tickets: 30 },
    { name: 'Mar', tickets: 20 },
    { name: 'Apr', tickets: 27 },
    { name: 'May', tickets: 18 },
    { name: 'Jun', tickets: 23 },
    { name: 'Jul', tickets: 34 },
]

export default function Dashboard() {
    const [assetStats, setAssetStats] = useState({
        total: 0,
        available: 0,
        inUse: 0,
        maintenance: 0,
        retired: 0
    })

    const [deviceStats, setDeviceStats] = useState({
        total: 0,
        available: 0,
        inUse: 0,
        maintenance: 0,
        retired: 0
    })

    const [atkStats, setAtkStats] = useState({
        total: 0,
        available: 0,
        lowStock: 0
    })

    const [ticketStats, setTicketStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
    })

    const [recentActivity, setRecentActivity] = useState([])

    useEffect(() => {
        const loadStats = () => {
            const activities = []

            // Load Assets
            const savedAssets = localStorage.getItem("simtik_assets")
            if (savedAssets) {
                const assets = JSON.parse(savedAssets)
                setAssetStats({
                    total: assets.length,
                    available: assets.filter(a => a.status === 'Available').length,
                    inUse: assets.filter(a => a.status === 'In Use').length,
                    maintenance: assets.filter(a => a.status === 'Maintenance').length,
                    retired: assets.filter(a => a.status === 'Retired').length
                })

                // Add recent assets to activities
                assets.forEach(asset => {
                    activities.push({
                        type: 'Asset',
                        title: `New Asset: ${asset.name}`,
                        desc: `${asset.category} - ${asset.serial}`,
                        date: new Date(asset.purchaseDate || Date.now()),
                        id: `asset-${asset.id}`
                    })
                })
            }

            // Load Devices
            const savedDevices = localStorage.getItem("simtik_devices")
            if (savedDevices) {
                const devices = JSON.parse(savedDevices)
                setDeviceStats({
                    total: devices.length,
                    available: devices.filter(d => d.status === 'Available').length,
                    inUse: devices.filter(d => d.status === 'In Use').length,
                    maintenance: devices.filter(d => d.status === 'Maintenance').length,
                    retired: devices.filter(d => d.status === 'Retired').length
                })
            }

            // Load ATK
            const savedAtk = localStorage.getItem("simtik_stock_atk")
            if (savedAtk) {
                const atks = JSON.parse(savedAtk)
                const availableCount = atks.filter(a => a.quantity > 5).length
                const lowStockCount = atks.filter(a => a.quantity <= 5).length

                setAtkStats({
                    total: atks.length,
                    available: availableCount,
                    lowStock: lowStockCount // Using "Limit" term from user request as Low Stock
                })
            }

            // Load Tickets
            const savedTickets = localStorage.getItem("simtik_tickets")
            if (savedTickets) {
                const tickets = JSON.parse(savedTickets)
                setTicketStats({
                    total: tickets.length,
                    open: tickets.filter(t => t.status === 'Open').length,
                    inProgress: tickets.filter(t => t.status === 'In Progress').length,
                    resolved: tickets.filter(t => t.status === 'Resolved').length,
                    closed: tickets.filter(t => t.status === 'Closed').length
                })

                // Add recent tickets to activities
                tickets.forEach(ticket => {
                    activities.push({
                        type: 'Ticket',
                        title: `Ticket: ${ticket.subject}`,
                        desc: `${ticket.priority} - ${ticket.status}`,
                        date: new Date(ticket.date),
                        id: `ticket-${ticket.id}`
                    })
                })
            }

            // Sort by date desc and take top 5
            activities.sort((a, b) => b.date - a.date)
            setRecentActivity(activities.slice(0, 5))
        }
        loadStats()
    }, [])

    return (
        <div className="space-y-6">
            {/* Main Totals */}
            {/* Dashboard Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. Devices */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Perangkat (Devices)</CardTitle>
                        <Monitor className="h-4 w-4 text-secondary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary-900">{deviceStats.total}</div>
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Available</span>
                                <span className="font-medium">{deviceStats.available}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> In Use</span>
                                <span className="font-medium">{deviceStats.inUse}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Maintenance</span>
                                <span className="font-medium">{deviceStats.maintenance}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div> Retired</span>
                                <span className="font-medium">{deviceStats.retired}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Assets */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Inventaris Aset</CardTitle>
                        <Box className="h-4 w-4 text-secondary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary-900">{assetStats.total}</div>
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Available</span>
                                <span className="font-medium">{assetStats.available}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> In Use</span>
                                <span className="font-medium">{assetStats.inUse}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Maintenance</span>
                                <span className="font-medium">{assetStats.maintenance}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div> Retired</span>
                                <span className="font-medium">{assetStats.retired}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. ATK */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Stok Opname ATK</CardTitle>
                        <Box className="h-4 w-4 text-secondary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary-900">{atkStats.total} <span className="text-xs font-normal text-secondary-500">Items</span></div>
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Available</span>
                                <span className="font-medium">{atkStats.available}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Limit / Low</span>
                                <span className="font-medium">{atkStats.lowStock}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Helpdesk */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Helpdesk Tickets</CardTitle>
                        <Activity className="h-4 w-4 text-secondary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary-900">{ticketStats.total}</div>
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Open</span>
                                <span className="font-medium">{ticketStats.open}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> In Progress</span>
                                <span className="font-medium">{ticketStats.inProgress}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Resolved</span>
                                <span className="font-medium">{ticketStats.resolved}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div> Closed</span>
                                <span className="font-medium">{ticketStats.closed}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>





            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* 1. Devices Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Status Perangkat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Available', value: deviceStats.available },
                                            { name: 'In Use', value: deviceStats.inUse },
                                            { name: 'Maintenance', value: deviceStats.maintenance },
                                            { name: 'Retired', value: deviceStats.retired }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#16a34a" /> {/* Available - Green */}
                                        <Cell fill="#4f46e5" /> {/* In Use - Indigo */}
                                        <Cell fill="#d97706" /> {/* Maintenance - Amber */}
                                        <Cell fill="#4b5563" /> {/* Retired - Gray */}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div> Available: {deviceStats.available}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div> In Use: {deviceStats.inUse}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-600 mr-2"></div> Maintenance: {deviceStats.maintenance}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div> Retired: {deviceStats.retired}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Assets Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Inventaris Aset</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Available', value: assetStats.available },
                                            { name: 'In Use', value: assetStats.inUse },
                                            { name: 'Maintenance', value: assetStats.maintenance },
                                            { name: 'Retired', value: assetStats.retired }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#16a34a" /> {/* Available - Green */}
                                        <Cell fill="#4f46e5" /> {/* In Use - Indigo */}
                                        <Cell fill="#d97706" /> {/* Maintenance - Amber */}
                                        <Cell fill="#4b5563" /> {/* Retired - Gray */}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div> Available: {assetStats.available}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div> In Use: {assetStats.inUse}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-600 mr-2"></div> Maintenance: {assetStats.maintenance}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div> Retired: {assetStats.retired}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. ATK Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Stok Opname ATK</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Available', value: atkStats.available },
                                            { name: 'Low Stock', value: atkStats.lowStock }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#16a34a" /> {/* Available - Green */}
                                        <Cell fill="#dc2626" /> {/* Low Stock - Red */}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div> Available: {atkStats.available}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div> Low Stock: {atkStats.lowStock}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Helpdesk Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Tiket Helpdesk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Open', value: ticketStats.open },
                                            { name: 'In Progress', value: ticketStats.inProgress },
                                            { name: 'Resolved', value: ticketStats.resolved },
                                            { name: 'Closed', value: ticketStats.closed }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#dc2626" /> {/* Open - Red */}
                                        <Cell fill="#d97706" /> {/* In Progress - Amber */}
                                        <Cell fill="#10b981" /> {/* Resolved - Emerald */}
                                        <Cell fill="#4b5563" /> {/* Closed - Gray */}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div> Open: {ticketStats.open}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-600 mr-2"></div> In Progress: {ticketStats.inProgress}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> Resolved: {ticketStats.resolved}</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div> Closed: {ticketStats.closed}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${activity.type === 'Asset' ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-purple-100 border-purple-200 text-purple-600'
                                        }`}>
                                        {activity.type === 'Asset' ? <Monitor className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                                        <p className="text-sm text-secondary-500">{activity.desc}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-secondary-400">
                                        {activity.date.toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
