import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"

export function AssetDetail({ asset, onClose }) {
    if (!asset) return null

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <h4 className="text-sm font-medium text-secondary-500">Asset Name</h4>
                    <p className="text-lg font-semibold text-secondary-900">{asset.name}</p>
                </div>
                <div className="col-span-2">
                    <h4 className="text-sm font-medium text-secondary-500">Status</h4>
                    <Badge className="mt-1" variant={
                        asset.status === 'Available' ? 'success' :
                            asset.status === 'In Use' ? 'default' :
                                asset.status === 'Maintenance' ? 'warning' : 'secondary'
                    }>
                        {asset.status}
                    </Badge>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Kode Barang</h4>
                    <p className="text-sm text-secondary-900">{asset.kodeBarang || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Lokasi</h4>
                    <p className="text-sm text-secondary-900">{asset.lokasi || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Kondisi</h4>
                    <p className="text-sm text-secondary-900">{asset.kondisi || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Jenis Barang</h4>
                    <p className="text-sm text-secondary-900">{asset.jenisBarang || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Merk</h4>
                    <p className="text-sm text-secondary-900">{asset.merk || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Type</h4>
                    <p className="text-sm text-secondary-900">{asset.type || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Ukuran</h4>
                    <p className="text-sm text-secondary-900">{asset.ukuran || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Bahan</h4>
                    <p className="text-sm text-secondary-900">{asset.bahan || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Tahun Beli</h4>
                    <p className="text-sm text-secondary-900">{asset.tahunBeli || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Harga</h4>
                    <p className="text-sm text-secondary-900">{asset.harga ? `Rp ${asset.harga}` : "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">Asal Usul</h4>
                    <p className="text-sm text-secondary-900">{asset.asalUsul || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">No. Pabrik</h4>
                    <p className="text-sm text-secondary-900">{asset.noPabrik || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">No. Rangka</h4>
                    <p className="text-sm text-secondary-900">{asset.noRangka || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">No. Mesin</h4>
                    <p className="text-sm text-secondary-900">{asset.noMesin || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">No. Polisi</h4>
                    <p className="text-sm text-secondary-900">{asset.noPolisi || "-"}</p>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-secondary-500">No. BPKB</h4>
                    <p className="text-sm text-secondary-900">{asset.noBpkb || "-"}</p>
                </div>
                <div className="col-span-4">
                    <h4 className="text-xs font-medium text-secondary-500">Foto</h4>
                    {asset.foto ? (
                        <div className="mt-1 h-32 w-auto border rounded overflow-hidden">
                            <img src={asset.foto} alt="Asset" className="h-full w-auto object-contain" />
                        </div>
                    ) : (
                        <p className="text-sm text-secondary-900">-</p>
                    )}
                </div>
                <div className="col-span-4 border-t border-secondary-100 pt-2">
                    <h4 className="text-xs font-medium text-secondary-500">Current Assignee</h4>
                    <p className="text-base font-medium text-secondary-900">{asset.assignee || "-"}</p>
                </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-secondary-100">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </div>
    )
}
