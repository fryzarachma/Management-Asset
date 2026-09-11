import { useState, useEffect } from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Eye, Printer } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Badge } from "../components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import { AssetForm } from "../components/assets/AssetForm"
import { AssetDetail } from "../components/assets/AssetDetail"

const initialAssets = [
    { id: 1, name: "Dell Latitude 5420", category: "Laptop", brand: "Dell", serial: "DL12345", status: "In Use", assignee: "Ir. WIJIONO, ST,M.Mkes", purchaseDate: "2024-01-15" },
    { id: 2, name: "HP LaserJet Pro", category: "Printer", brand: "HP", serial: "HP99887", status: "Available", assignee: "-", purchaseDate: "2023-11-20" },
    { id: 3, name: "MacBook Air M2", category: "Laptop", brand: "Apple", serial: "AP45678", status: "Maintenance", assignee: "-", purchaseDate: "2024-03-10" },
    { id: 4, name: "Logitech Webcam", category: "Peripheral", brand: "Logitech", serial: "LG33445", status: "In Use", assignee: "SIGIT PRASETYO,S.IP.MAP", purchaseDate: "2024-02-05" },
]

export default function Assets({ title = "Asset Management" }) {
    const [assets, setAssets] = useState(() => {
        const savedAssets = localStorage.getItem("simtik_assets")
        if (savedAssets) {
            try {
                const parsed = JSON.parse(savedAssets)
                return Array.isArray(parsed) ? parsed : initialAssets
            } catch (error) {
                console.error("Failed to parse assets from local storage", error)
                return initialAssets
            }
        }
        return initialAssets
    })

    useEffect(() => {
        localStorage.setItem("simtik_assets", JSON.stringify(assets))
    }, [assets])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState(null)

    const handleSaveAsset = (assetData) => {
        if (selectedAsset && selectedAsset.id) {
            // Update existing
            setAssets(assets.map(a => a.id === selectedAsset.id ? { ...assetData, id: a.id, purchaseDate: a.purchaseDate } : a))
        } else {
            // Add new
            setAssets([...assets, { id: Date.now(), ...assetData, purchaseDate: new Date().toISOString().split('T')[0] }])
        }
        setIsModalOpen(false)
        setSelectedAsset(null)
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

    const printAssetReport = (period) => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        let filteredReportAssets = assets.filter(item => {
            const itemDate = new Date(item.purchaseDate)
            if (period === 'monthly') {
                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
            }
            // For yearly/all-time report, we show everything
            return true
        })

        // Sort by Purchase Date (Oldest to Newest)
        filteredReportAssets.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))

        // Remove alert blocking to ensure window always opens
        // if (filteredReportAssets.length === 0) { ... }

        // Group by Year
        const assetsByYear = filteredReportAssets.reduce((acc, asset) => {
            const year = new Date(asset.purchaseDate).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(asset);
            return acc;
        }, {});

        const sortedYears = Object.keys(assetsByYear).sort();

        const reportTitle = period === 'monthly'
            ? `Laporan Aset Bulanan (Aquisisi) - ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`
            : `Laporan Rekapitulasi Aset (Per Tahun)`

        const printWindow = window.open('', '', 'width=800,height=600')
        printWindow.document.write(`
            <html>
            <head>
                <title>${reportTitle}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    @page { size: landscape; }
                    .header-container { text-align: center; margin-bottom: 20px; border-bottom: 3px double black; padding-bottom: 15px; }
                    .header-title-1 { font-size: 18px; font-weight: bold; }
                    .header-title-2 { font-size: 22px; font-weight: bold; margin: 5px 0; }
                    .header-address { font-size: 12px; font-style: italic; }

                    h1 { text-align: center; font-size: 16px; margin-bottom: 20px; text-transform: uppercase; text-decoration: underline; }
                    h2 { font-size: 14px; margin-top: 20px; margin-bottom: 5px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 20px; }
                    th, td { border: 1px solid #000; padding: 4px; text-align: left; font-size: 10px; }
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
                                <th style="width: 3%">No</th>
                                <th style="width: 15%">Asset Name</th>
                                <th style="width: 10%">Kode</th>
                                <th style="width: 10%">Jenis</th>
                                <th style="width: 10%">Merk/Type</th>
                                <th style="width: 5%">Thn</th>
                                <th style="width: 8%">Kondisi</th>
                                <th style="width: 10%">Lokasi</th>
                                <th style="width: 8%">Status</th>
                                <th style="width: 15%">Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assetsByYear[year].map((asset, index) => `
                                <tr>
                                    <td style="text-align: center;">${index + 1}</td>
                                    <td>${asset.name}</td>
                                    <td>${asset.kodeBarang || "-"}</td>
                                    <td>${asset.jenisBarang || asset.category || "-"}</td>
                                    <td>${asset.merk ? `${asset.merk} ${asset.type || ''}` : (asset.brand || "-")}</td>
                                    <td style="text-align: center;">${asset.tahunBeli || asset.purchaseDate}</td>
                                    <td style="text-align: center;">${asset.kondisi || "-"}</td>
                                    <td>${asset.lokasi || "-"}</td>
                                    <td style="text-align: center;">${asset.status}</td>
                                    <td>${asset.assignee || "-"}</td>
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

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.serial && asset.serial.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (asset.kodeBarang && asset.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const [assetToDelete, setAssetToDelete] = useState(null)

    const handleDeleteAsset = (asset) => {
        setAssetToDelete(asset)
    }

    const confirmDelete = () => {
        if (assetToDelete) {
            setAssets(assets.filter(a => a.id !== assetToDelete.id))
            setAssetToDelete(null)
        }
    }

    const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false)

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
                                            printAssetReport('monthly')
                                            setIsPrintMenuOpen(false)
                                        }}
                                    >
                                        Laporan Bulanan
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            printAssetReport('yearly')
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
                        setSelectedAsset(null)
                        setIsModalOpen(true)
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Asset
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-medium">All Assets</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                            <Input
                                placeholder="Search assets..."
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
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">No</TableHead>
                                    <TableHead className="min-w-[150px]">Asset Name</TableHead>
                                    <TableHead className="min-w-[100px]">Lokasi</TableHead>
                                    <TableHead className="min-w-[100px]">Merk</TableHead>
                                    <TableHead className="min-w-[100px]">Type</TableHead>
                                    <TableHead className="min-w-[80px]">Tahun</TableHead>
                                    <TableHead className="min-w-[80px]">Ukuran</TableHead>
                                    <TableHead className="min-w-[80px]">Bahan</TableHead>
                                    <TableHead className="min-w-[100px]">Kondisi</TableHead>
                                    <TableHead className="min-w-[100px]">Status</TableHead>
                                    <TableHead className="min-w-[150px]">Assignee</TableHead>
                                    <TableHead className="min-w-[100px]">Foto</TableHead>
                                    <TableHead className="text-right sticky right-0 bg-white shadow-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAssets.map((asset, index) => (
                                    <TableRow key={asset.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{asset.name}</TableCell>
                                        <TableCell>{asset.lokasi || "-"}</TableCell>
                                        <TableCell>{asset.merk || asset.brand || "-"}</TableCell>
                                        <TableCell>{asset.type || "-"}</TableCell>
                                        <TableCell>{asset.tahunBeli || asset.purchaseDate}</TableCell>
                                        <TableCell>{asset.ukuran || "-"}</TableCell>
                                        <TableCell>{asset.bahan || "-"}</TableCell>
                                        <TableCell>{asset.kondisi || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadge(asset.status)}>{asset.status}</Badge>
                                        </TableCell>
                                        <TableCell>{asset.assignee}</TableCell>
                                        <TableCell>
                                            {asset.foto ? (
                                                <img src={asset.foto} alt="Asset" className="h-8 w-8 object-cover rounded" />
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right sticky right-0 bg-white">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => {
                                                    setSelectedAsset(asset)
                                                    setIsViewModalOpen(true)
                                                }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => {
                                                    setSelectedAsset(asset)
                                                    setIsModalOpen(true)
                                                }}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteAsset(asset)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedAsset(null)
                }}
                title={selectedAsset ? "Edit Asset" : "Add Asset"}
                className="max-w-4xl"
            >
                <AssetForm
                    initialData={selectedAsset}
                    onCancel={() => {
                        setIsModalOpen(false)
                        setSelectedAsset(null)
                    }}
                    onSubmit={handleSaveAsset}
                    suggestions={{
                        names: [...new Set(assets.map(a => a.name).filter(Boolean))],
                        lokasis: [...new Set(assets.map(a => a.lokasi).filter(Boolean))],
                        jenisBarangs: [...new Set(assets.map(a => a.jenisBarang).filter(Boolean))],
                        merks: [...new Set(assets.map(a => a.merk).filter(Boolean))],
                        types: [...new Set(assets.map(a => a.type).filter(Boolean))],
                        bahans: [...new Set(assets.map(a => a.bahan).filter(Boolean))],
                    }}
                />
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Asset Details"
                className="max-w-4xl"
            >
                <AssetDetail
                    asset={selectedAsset}
                    onClose={() => setIsViewModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={!!assetToDelete}
                onClose={() => setAssetToDelete(null)}
                title="Konfirmasi Hapus"
                className="max-w-sm"
            >
                <div className="space-y-4 pt-2">
                    <p>Apakah Anda yakin ingin menghapus aset <strong className="font-semibold text-secondary-900">{assetToDelete?.name}</strong>?</p>
                    <p className="text-sm text-secondary-500">Tindakan ini tidak dapat dibatalkan dan akan menghapus aset dari sistem.</p>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setAssetToDelete(null)}>Batal</Button>
                        <Button variant="danger" onClick={confirmDelete}>Hapus Aset</Button>
                    </div>
                </div>
            </Modal>
        </div >
    )
}
