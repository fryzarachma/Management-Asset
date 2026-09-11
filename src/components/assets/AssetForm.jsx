import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useState } from "react"

const EMPLOYEE_LIST = [
    "Ir. WIJIONO, ST,M.Mkes", "SIGIT PRASETYO,S.IP.MAP", "SUYATNO,SH", "DIDIK AGIT W, SE.MAP", "NUGRAHENI RAHAYU S, SE,M.Si",
    "DIDIK SUPRIYANTO,S.Sos.M.Si", "EKO DARMINTO,SE.M.Si", "Ir. AGUNG SRIYONO", "DJOKO PURNOMO,SE", "AGUNG YUDYANA, S.H., M.H.",
    "DWI SUCI RAHAYU, SE.", "Ir. BENNO HERA T.", "TOTOK SUBIANTO, SE", "BASORI, ST", "RIKE ARSHINTA MAYASARI,  ST,M.A.P",
    "WINDU SETIYADI, ST", "NIKEN SRI PALUPI,SE", "HAPPY RAHMAWATI,SE", "ENI SUMAWATI, SE", "UTARI PRASETYANI,SE",
    "FENY RATNAWATI,SE", "UMROTUL MAHFUDHOH,  S.Ak.", "SIGIH SETIONO,  S.Ak.", "NANDITO MONLIEV PASSA,S.Kom", "SULIKAH,S.TP.,M.A.P",
    "PUSPANAGARI PUTRI RIDANTI,S.Ak", "CHOIRUNNISA,S.A.", "FEREN FEBRIYANTI,S.Ak", "ANANDA SEPTA WILLYANDA,S.E.", "ADHI TRIYANTO, S.Tr.I.P",
    "FERYAL NADA AZIZAH,A.Md.Ak", "NADIAH FIRDAUSSINTA D,A.Md.Ak", "CHRIS TRYANTO MARTA P P,A,Md.Ak", "DESTY AYU SAPUTRI,A.Md.Ak", "MUHAMAD IQBAL MAULIDI,A.Md.Ak",
    "ABYADH NURUTTIMAMI FR, A.Md.Ak", "ANINDYA FAUZIYAH BASUKI,A.Md.Ak", "ANDIKA PUTRA HARDYANSYAH,A,Md.Ak", "MUHAMMAD IDHAM FIRDAUS,A.Md.Ak", "CAHYA FITRIA ARDIANI, A. Md",
    "ROEKAN, ST", "SULIS SETYAWATI, SE", "YENI KRISTUTI", "KATIRAN", "KUSNUL KOTIMAH",
    "HARYADI", "DYAH WIDI MRANANI, SE", "NANANG MARDIANTORO, S.Pd", "NUVENTIN ASNA PUTRI, S.Ak", "PUTRI PATRISIA FERNANDA, S.M.",
    "IRMALA PRASISTYA CAHYANING P, S.Ak", "KUKUH ARI FIRMANSYAH, S.H", "ZAKIATUL MUFARRIHAH, ST", "ERNI AGUSTINA, S.H.", "INDAH NABILLA HASNA, S.T.",
    "DIAH AJENG MELIASARI, S.H", "MOH. MUHADHIR SYAFAAT, S.T.", "KARTIKA KUSUMA DEWI, S.E.", "AJI SURYA SAKSAMA, S.T", "MELA ENDRIANI, S.E.",
    "YOPI ADI PRAYOGA, S.T.", "DEVI SELVIA, S.E.", "MUHAMMAD ADITYA K, S.E", "RORO PUTRI SETIANINGAYU,S.Tr.E", "TOMMY KURNIAWAN, S.E",
    "FELLIS ENRICHA PUTRI, S.Ak.", "FRYZA RACHMANIA M, A.Md.Kom", "HARMINTO", "SUPRIYADI", "APRILIYAN SUSANTO"
].sort()

export function AssetForm({ onCancel, onSubmit, initialData, suggestions = {} }) {
    const [formData, setFormData] = useState(initialData || {
        name: "",
        kodeBarang: "",
        lokasi: "",
        jenisBarang: "",
        merk: "",
        type: "",
        ukuran: "",
        bahan: "",
        tahunBeli: new Date().getFullYear(),
        noPabrik: "",
        noRangka: "",
        noMesin: "",
        noPolisi: "",
        noBpkb: "",
        asalUsul: "",
        harga: "",
        kondisi: "Baik",
        foto: "",
        qrCode: "",
        assignee: "",
        status: "Available",
        purchaseDate: new Date().toISOString().split('T')[0],
    })

    const formatRupiah = (value) => {
        if (!value) return ""
        const numberString = value.replace(/[^,\d]/g, "").toString()
        const split = numberString.split(",")
        const sisa = split[0].length % 3
        let rupiah = split[0].substr(0, sisa)
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

        if (ribuan) {
            const separator = sisa ? "." : ""
            rupiah += separator + ribuan.join(".")
        }

        return split[1] !== undefined ? rupiah + "," + split[1] : rupiah
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === "harga") {
            setFormData(prev => ({ ...prev, [name]: formatRupiah(value) }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                // Resize image to save space
                const img = new Image()
                img.src = reader.result
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    const MAX_WIDTH = 800
                    const scaleSize = MAX_WIDTH / img.width
                    canvas.width = MAX_WIDTH
                    canvas.height = img.height * scaleSize
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
                    setFormData(prev => ({ ...prev, foto: compressedBase64 }))
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                {/* Row 1: Identity */}
                <div className="col-span-2 space-y-1">
                    <label className="text-xs font-medium">Asset Name <span className="text-red-500">*</span></label>
                    <Input list="names-list" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Aset" required className="h-8 text-sm" />
                    <datalist id="names-list">
                        {suggestions.names?.map((item, i) => <option key={i} value={item} />)}
                    </datalist>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Kode Barang <span className="text-red-500">*</span></label>
                    <Input name="kodeBarang" value={formData.kodeBarang} onChange={handleChange} placeholder="Kode" required className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Lokasi <span className="text-red-500">*</span></label>
                    <Input list="lokasis-list" name="lokasi" value={formData.lokasi} onChange={handleChange} placeholder="Lokasi" required className="h-8 text-sm" />
                    <datalist id="lokasis-list">
                        {suggestions.lokasis?.map((item, i) => <option key={i} value={item} />)}
                    </datalist>
                </div>

                {/* Row 2: Specs A */}
                <div className="space-y-1">
                    <label className="text-xs font-medium">Jenis Barang <span className="text-red-500">*</span></label>
                    <Input list="jenisBarangs-list" name="jenisBarang" value={formData.jenisBarang} onChange={handleChange} placeholder="Jenis" required className="h-8 text-sm" />
                    <datalist id="jenisBarangs-list">
                        {suggestions.jenisBarangs?.map((item, i) => <option key={i} value={item} />)}
                    </datalist>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Merk <span className="text-red-500">*</span></label>
                    <Input list="merks-list" name="merk" value={formData.merk} onChange={handleChange} placeholder="Merk" required className="h-8 text-sm" />
                    <datalist id="merks-list">
                        {suggestions.merks?.map((item, i) => <option key={i} value={item} />)}
                    </datalist>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Type <span className="text-red-500">*</span></label>
                    <Input list="types-list" name="type" value={formData.type} onChange={handleChange} placeholder="Type" required className="h-8 text-sm" />
                    <datalist id="types-list">
                        {suggestions.types?.map((item, i) => <option key={i} value={item} />)}
                    </datalist>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Tahun Beli <span className="text-red-500">*</span></label>
                    <Input type="number" name="tahunBeli" value={formData.tahunBeli} onChange={handleChange} placeholder="YYYY" required className="h-8 text-sm" />
                </div>

                {/* Row 3: Specs B */}
                <div className="space-y-1">
                    <label className="text-xs font-medium">Ukuran <span className="text-red-500">*</span></label>
                    <Input name="ukuran" value={formData.ukuran} onChange={handleChange} placeholder="Ukuran" required className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Bahan <span className="text-red-500">*</span></label>
                    <Input list="bahans-list" name="bahan" value={formData.bahan} onChange={handleChange} placeholder="Bahan" required className="h-8 text-sm" />
                    <datalist id="bahans-list">
                        {suggestions.bahans?.map((item, i) => <option key={i} value={item} />)}
                    </datalist>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Harga (Rp) <span className="text-red-500">*</span></label>
                    <Input name="harga" value={formData.harga} onChange={handleChange} placeholder="Rp" required className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Asal Usul <span className="text-red-500">*</span></label>
                    <Input name="asalUsul" value={formData.asalUsul} onChange={handleChange} placeholder="Asal Usul" required className="h-8 text-sm" />
                </div>

                {/* Row 4: Numbers */}
                <div className="space-y-1">
                    <label className="text-xs font-medium">No. Pabrik <span className="text-red-500">*</span></label>
                    <Input name="noPabrik" value={formData.noPabrik} onChange={handleChange} placeholder="No Pabrik" required className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">No. Rangka <span className="text-red-500">*</span></label>
                    <Input name="noRangka" value={formData.noRangka} onChange={handleChange} placeholder="No Rangka" required className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">No. Mesin <span className="text-red-500">*</span></label>
                    <Input name="noMesin" value={formData.noMesin} onChange={handleChange} placeholder="No Mesin" required className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">No. Polisi/BPKB <span className="text-red-500">*</span></label>
                    <Input name="noPolisi" value={formData.noPolisi} onChange={handleChange} placeholder="Nopol / BPKB" required className="h-8 text-sm" />
                </div>

                {/* Row 5: Status & User */}
                <div className="space-y-1">
                    <label className="text-xs font-medium">Kondisi <span className="text-red-500">*</span></label>
                    <select
                        name="kondisi"
                        value={formData.kondisi}
                        onChange={handleChange}
                        required
                        className="flex h-8 w-full rounded-md border border-secondary-200 bg-white px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                        <option value="Baik">Baik</option>
                        <option value="Kurang Baik">Kurang Baik</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Status <span className="text-red-500">*</span></label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="flex h-8 w-full rounded-md border border-secondary-200 bg-white px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Retired">Retired</option>
                    </select>
                </div>
                <div className="col-span-2 space-y-1">
                    <label className="text-xs font-medium">Pengguna <span className="text-red-500">*</span></label>
                    <Input
                        list="employee-list"
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        placeholder="Pilih Pegawai..."
                        required
                        className="h-8 text-sm"
                    />
                    <datalist id="employee-list">
                        {EMPLOYEE_LIST.map((name, i) => (
                            <option key={i} value={name} />
                        ))}
                    </datalist>
                </div>

                {/* Row 6: Photo */}
                <div className="col-span-4 space-y-1">
                    <label className="text-xs font-medium">Foto Aset <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <Input type="file" accept="image/*" onChange={handleImageUpload} required={!formData.foto} className="h-8 text-sm w-full" />
                        {formData.foto && (
                            <div className="h-8 w-8 relative">
                                <img src={formData.foto} alt="Preview" className="h-full w-full object-cover rounded" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} size="sm">Cancel</Button>
                <Button type="submit" size="sm">Save Asset</Button>
            </div>
        </form>
    )
}
