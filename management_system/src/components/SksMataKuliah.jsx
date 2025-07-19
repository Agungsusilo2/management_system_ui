import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    sksMataKuliahAll,
    sksMataKuliahAdd,
    sksMataKuliahUpdate,
    sksMataKuliahDelete,
} from "../lib/api/sksMataKuliahApi.js";
import DataTable from "./Table.jsx";
import ModalForm from "./ModelForm.jsx";
import ChatAssistant from "./ChatAssistant.jsx";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert.js";
import {mataKuliahAll} from "../lib/api/mataKuliahApi.js";

export default function SksMataKuliah() {
    const { authToken, user } = useAuth();
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [mkOptions, setmkOptions] = useState([]);

    const isAdmin = user.user_type === "Admin";

    const formFields = [
        { name: "bobotTatapMuka", label: "Tatap Muka", type: "number", required: false },
        { name: "bobotPraktikum", label: "Praktikum", type: "number", required: false },
        { name: "bobotPraktekLapangan", label: "Praktek Lapangan", type: "number", required: false },
        { name: "bobotSimulasi", label: "Simulasi", type: "number", required: false },
        { name: "idmk", label: "ID Mata Kuliah", type: "select", required: true ,options:mkOptions},
    ];

    const fetchData = async () => {
        const res = await sksMataKuliahAll({ token: authToken, page, size });
        const result = await res.json();

        if (res.ok) {
            setData(result.data);
            setTotalItems(result.paging?.total_item || result.data.length);
        } else {
            await alertFailed(result.errors || "Gagal memuat data SKS Mata Kuliah");
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataOption()
    }, [page]);

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setModalVisible(true);
    };

    const fetchDataOption = async ()=>{
        const res = await mataKuliahAll({token:authToken,page:1,size:100});

        const body = await res.json()
        if(res.ok){
            setmkOptions(
                (body.data || []).map((item)=>({
                    value:item.idmk,
                    label:`${item.idmk} - ${item.namaMk}`
                }))
            )
        }
    }




    const handleSubmit = async (formData) => {
        const payload = {
            bobotTatapMuka: parseFloat(formData.bobotTatapMuka),
            bobotPraktikum: parseFloat(formData.bobotPraktikum),
            bobotPraktekLapangan: parseFloat(formData.bobotPraktekLapangan),
            bobotSimulasi: parseFloat(formData.bobotSimulasi),
            idmk: formData.idmk,
            token: authToken,
        };

        let res;
        if (selectedRow) {
            res = await sksMataKuliahUpdate({
                ...payload,
                kodeSKS: selectedRow.kodeSKS,
            });
        } else {
            res = await sksMataKuliahAdd(payload);
        }

        const result = await res.json();

        if (res.ok) {
            await alertSuccess("Berhasil menyimpan data SKS");
            setModalVisible(false);
            fetchData();
        } else {
            await alertFailed(result.errors || "Gagal menyimpan data SKS");
        }
    };

    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus data SKS ini?");
        if (!confirmed) return;

        const res = await sksMataKuliahDelete({
            token: authToken,
            kodeSKS: row.kodeSKS,
        });

        const result = await res.json();

        if (res.ok) {
            await alertSuccess("Berhasil menghapus data SKS");
            fetchData();
        } else {
            await alertFailed(result.errors || "Gagal menghapus data SKS");
        }
    };

    const handleAIResponse = async (result) => {
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("Format tidak valid. Gunakan `action: add` dan `items[]`");
            return;
        }

        for (const item of result.items) {
            try {
                const res = await sksMataKuliahAdd({
                    token: authToken,
                    bobotTatapMuka: parseFloat(item.bobotTatapMuka),
                    bobotPraktikum: parseFloat(item.bobotPraktikum),
                    bobotPraktekLapangan: parseFloat(item.bobotPraktekLapangan),
                    bobotSimulasi: parseFloat(item.bobotSimulasi),
                    idmk: item.idmk,
                });

                if (!res.ok) {
                    const err = await res.json();
                    await alertFailed(err.errors || `Gagal tambah SKS untuk ${item.idmk}`);
                }
            } catch (e) {
                console.error(e);
            }
        }

        await alertSuccess("✅ Semua data SKS berhasil ditambahkan!");
        fetchData();
    };

    const columns = [
        { key: "kodeSKS", label: "Kode SKS" },
        { key: "bobotTatapMuka", label: "Tatap Muka" },
        { key: "bobotPraktikum", label: "Praktikum" },
        { key: "bobotPraktekLapangan", label: "Praktek Lapangan" },
        { key: "bobotSimulasi", label: "Simulasi" },
        { key: "totalBobot", label: "Total Bobot" },
        { key: "idmk", label: "ID Mata Kuliah" },
    ];

    const handlePrev = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    const handleNext = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage((p) => p + 1);
    };

    return (
        <>
            {isAdmin && (
                <ChatAssistant
                    fields={["bobotTatapMuka", "bobotPraktikum", "bobotPraktekLapangan", "bobotSimulasi", "idmk"]}
                    onAIResponse={handleAIResponse}
                />
            )}

            <DataTable
                title="Daftar SKS Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd : undefined}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                searchPlaceholder="Cari berdasarkan ID Mata Kuliah..."
            />

            <ModalForm
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialData={selectedRow}
                fields={formFields}
            />

            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    onClick={handlePrev}
                    disabled={page <= 1}
                    className={`btn btn-secondary px-4 py-2 rounded-md text-white ${
                        page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    ← Prev
                </button>

                <span className="text-gray-700 font-medium">Halaman {page}</span>

                <button
                    onClick={handleNext}
                    disabled={page >= Math.ceil(totalItems / size)}
                    className={`btn btn-primary px-4 py-2 rounded-md text-white ${
                        page >= Math.ceil(totalItems / size)
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    Next →
                </button>
            </div>
        </>
    );
}
