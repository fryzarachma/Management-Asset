import { useState, useEffect } from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Eye, Printer } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Badge } from "../components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import { DeviceForm } from "../components/devices/DeviceForm"
import { DeviceDetail } from "../components/devices/DeviceDetail"

const initialDevices = [
    { id: 1, name: "Dell Latitude 5420", category: "Laptop", brand: "Dell", serial: "DL12345", status: "In Use", assignee: "Ir. WIJIONO, ST,M.Mkes", purchaseDate: "2024-01-15" },
    { id: 2, name: "HP LaserJet Pro", category: "Printer", brand: "HP", serial: "HP99887", status: "Available", assignee: "-", purchaseDate: "2023-11-20" },
    { id: 3, name: "MacBook Air M2", category: "Laptop", brand: "Apple", serial: "AP45678", status: "Maintenance", assignee: "-", purchaseDate: "2024-03-10" },
    { id: 4, name: "Logitech Webcam", category: "Peripheral", brand: "Logitech", serial: "LG33445", status: "In Use", assignee: "SIGIT PRASETYO,S.IP.MAP", purchaseDate: "2024-02-05" },
]

export default function Devices({ title = "Device Management" }) {
    const [devices, setDevices] = useState(() => {
        const savedDevices = localStorage.getItem("simtik_devices")
        if (savedDevices) {
            try {
                const parsed = JSON.parse(savedDevices)
                return Array.isArray(parsed) ? parsed : initialDevices
            } catch (error) {
                console.error("Failed to parse devices from local storage", error)
                return initialDevices
            }
        }
        return initialDevices
    })

    useEffect(() => {
        localStorage.setItem("simtik_devices", JSON.stringify(devices))
    }, [devices])

    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)

    const handleSaveDevice = (deviceData) => {
        if (selectedDevice && selectedDevice.id) {
            // Update existing
            setDevices(devices.map(d => d.id === selectedDevice.id ? { ...deviceData, id: d.id } : d))
        } else {
            // Add new
            setDevices([...devices, { id: Date.now(), ...deviceData }])
        }
        setIsModalOpen(false)
        setSelectedDevice(null)
    }

    const [deviceToDelete, setDeviceToDelete] = useState(null)

    const handleDeleteDevice = (device) => {
        setDeviceToDelete(device)
    }

    const confirmDelete = () => {
        if (deviceToDelete) {
            setDevices(devices.filter(d => d.id !== deviceToDelete.id))
            setDeviceToDelete(null)
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Available': return 'success'
            case 'In Use': return 'default'
            case 'Maintenance': return 'warning'
            case 'Retired': return 'secondary'
            default: return 'outline'
        }
    }

    const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false)

    const printDeviceReport = (period) => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        let filteredReportDevices = devices.filter(item => {
            const itemDate = new Date(item.purchaseDate)
            if (period === 'monthly') {
                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
            }
            return true
        })

        filteredReportDevices.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))

        const devicesByYear = filteredReportDevices.reduce((acc, device) => {
            const year = new Date(device.purchaseDate).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(device);
            return acc;
        }, {});

        const sortedYears = Object.keys(devicesByYear).sort();

        const reportTitle = period === 'monthly'
            ? `Laporan Perangkat Bulanan (Aquisisi) - ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`
            : `Laporan Rekapitulasi Perangkat (Per Tahun)`

        const printWindow = window.open('', '', 'width=800,height=600')
        printWindow.document.write(`
            <html>
            <head>
                <title>${reportTitle}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header-container { text-align: center; margin-bottom: 20px; border-bottom: 3px double black; padding-bottom: 15px; }
                    .header-title-1 { font-size: 18px; font-weight: bold; }
                    .header-title-2 { font-size: 22px; font-weight: bold; margin: 5px 0; }
                    .header-address { font-size: 12px; font-style: italic; }

                    h1 { text-align: center; font-size: 16px; margin-bottom: 20px; text-transform: uppercase; text-decoration: underline; }
                    h2 { font-size: 14px; margin-top: 20px; margin-bottom: 5px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 20px; }
                    th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 12px; }
                    th { background-color: #f2f2f2; text-align: center; }

                    .footer { margin-top: 30px; text-align: right; font-size: 12px; }

                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                        th { background-color: #f2f2f2 !important; }
                        h2 { page-break-after: avoid; }
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="header-title-1">PEMERINTAH KABUPATEN TRENGGALEK</div>
                    <div class="header-title-2">INSPEKTORAT</div>
                    <div class="header-address">Jl. KH. Wachid Hasyim No.5 66311 Telp. 0355-791472</div>
                    <div class="header-address">https://inspektorat.trenggalekkab.go.id</div>
                </div>

                <h1>${reportTitle}</h1>

                ${sortedYears.map(year => `
                    <h2>TAHUN ${year}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%">No</th>
                                <th style="width: 20%">Device Name</th>
                                <th style="width: 15%">Category</th>
                                <th style="width: 10%">Brand</th>
                                <th style="width: 15%">Serial No.</th>
                                <th style="width: 10%">Date</th>
                                <th style="width: 10%">Status</th>
                                <th style="width: 15%">Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${devicesByYear[year].map((device, index) => `
                                <tr>
                                    <td style="text-align: center;">${index + 1}</td>
                                    <td>${device.name}</td>
                                    <td>${device.category}</td>
                                    <td>${device.brand}</td>
                                    <td>${device.serial}</td>
                                    <td style="text-align: center;">${device.purchaseDate}</td>
                                    <td style="text-align: center;">${device.status}</td>
                                    <td>${device.assignee}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `).join('')}

                <div class="footer">
                    <p>Trenggalek, ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p>Dicetak oleh Admin</p>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    const filteredDevices = devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (device.serial && device.serial.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-secondary-900">{title}</h2>
                <div className="flex space-x-2 relative">
                    <div className="relative">
                        <Button variant="outline" onClick={() => setIsPrintMenuOpen(!isPrintMenuOpen)}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        {isPrintMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="py-1">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            printDeviceReport('monthly')
                                            setIsPrintMenuOpen(false)
                                        }}
                                    >
                                        Laporan Bulanan
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            printDeviceReport('yearly')
                                            setIsPrintMenuOpen(false)
                                        }}
                                    >
                                        Laporan Tahunan
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Overlay to close when clicking outside */}
                        {isPrintMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsPrintMenuOpen(false)} />}
                    </div>

                    <Button onClick={() => {
                        setSelectedDevice(null)
                        setIsModalOpen(true)
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Device
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-medium">All Devices</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                            <Input
                                placeholder="Search devices..."
                                className="pl-8 w-[250px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Device Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Serial No.</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDevices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell className="font-medium">{device.name}</TableCell>
                                    <TableCell>{device.category}</TableCell>
                                    <TableCell>{device.brand}</TableCell>
                                    <TableCell>{device.serial}</TableCell>
                                    <TableCell>{device.purchaseDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadge(device.status)}>{device.status}</Badge>
                                    </TableCell>
                                    <TableCell>{device.assignee}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => {
                                                setSelectedDevice(device)
                                                setIsViewModalOpen(true)
                                            }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => {
                                                setSelectedDevice(device)
                                                setIsModalOpen(true)
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteDevice(device)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedDevice(null)
                }}
                title={selectedDevice ? "Edit Device" : "Add Device"}
            >
                <DeviceForm
                    initialData={selectedDevice}
                    onCancel={() => {
                        setIsModalOpen(false)
                        setSelectedDevice(null)
                    }}
                    onSubmit={handleSaveDevice}
                />
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Device Details"
            >
                <DeviceDetail
                    asset={selectedDevice}
                    onClose={() => setIsViewModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={!!deviceToDelete}
                onClose={() => setDeviceToDelete(null)}
                title="Konfirmasi Hapus"
                className="max-w-sm"
            >
                <div className="space-y-4 pt-2">
                    <p>Apakah Anda yakin ingin menghapus perangkat <strong className="font-semibold text-secondary-900">{deviceToDelete?.name}</strong>?</p>
                    <p className="text-sm text-secondary-500">Tindakan ini tidak dapat dibatalkan dan akan menghapus perangkat dari sistem.</p>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setDeviceToDelete(null)}>Batal</Button>
                        <Button variant="danger" onClick={confirmDelete}>Hapus Perangkat</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
