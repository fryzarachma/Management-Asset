import { X } from "lucide-react"
import { Button } from "../ui/Button"

export function DeviceDetail({ asset, onClose }) {
    if (!asset) return null

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                    <h4 className="text-sm font-medium text-secondary-500">Device Name</h4>
                    <p className="text-lg font-semibold text-secondary-900">{asset.name}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-secondary-500">Category</h4>
                    <p className="text-base text-secondary-900">{asset.category}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-secondary-500">Brand</h4>
                    <p className="text-base text-secondary-900">{asset.brand}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-secondary-500">Serial Number</h4>
                    <p className="text-base text-secondary-900">{asset.serial}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-secondary-500">Purchase Date</h4>
                    <p className="text-base text-secondary-900">{asset.purchaseDate}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-secondary-500">Status</h4>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${asset.status === 'Available' ? 'bg-green-100 text-green-800' :
                        asset.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                            asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {asset.status}
                    </span>
                </div>
                <div className="col-span-2">
                    <h4 className="text-sm font-medium text-secondary-500">Assignee</h4>
                    <p className="text-base text-secondary-900">{asset.assignee || "-"}</p>
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-secondary-100">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </div>
    )
}
