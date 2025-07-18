import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { alertFailed, alertSuccess, alertConfirm } from "../../lib/alert.js";
import DataTable from "../Table.jsx";
import ModalForm from "../ModelForm.jsx";
import {
    referensiAdd,
    referensiAll,
    referensiDelete,
    referensiUpdate,
} from "../../lib/api/referensiApi.js";
import {bahanKajianCreate} from "../../lib/api/bahanKajianApi.js";
import ChatAssistant from "../ChatAssistant.jsx";

export default function Referensi() {
    const { authToken ,user} = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin";

    const fetchData = async () => {
        const res = await referensiAll({ token: authToken, page, size });
        const body = await res.json();
        if (res.ok) {
            const mapped = body.data.map((item) => ({
                kodeReferensi: item.kodeReferensi,
                namaReferensi: item.namaReferensi,
            }));

            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setModalVisible(true);
    };

    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus data ini?");
        if (!confirmed) return;

        const res = await referensiDelete({
            token: authToken,
            kodeReferensi: row.kodeReferensi,
        });
        const body = await res.json();
        if (res.ok) {
            await alertSuccess("Data berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus data");
        }
    };

    const handleAIResponse = async (result)=>{
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }
        for (const item of result.items) {
            const payload = {
                token:authToken,
                kodeReferensi: item.kodeReferensi,
                namaReferensi: item.namaReferensi,
            };

            try {
                const res = await bahanKajianCreate(payload);
                const body = await res.json();

                if (!res.ok) {
                    console.error("Gagal:", body);
                    await alertFailed(`❌ Gagal menambahkan: ${payload.namaBahanKajian}`);
                }
            } catch (err) {
                console.error(err);
            }
        }

        await alertSuccess("✅ Semua data berhasil ditambahkan!");
        fetchData();
    }


    const handleSubmit = async (formData) => {
        const payload = {
            token: authToken,
            kodeReferensi: formData.kodeReferensi,
            namaReferensi: formData.namaReferensi,
        };

        let res;
        if (selectedRow) {
            res = await referensiUpdate(payload);
        } else {
            res = await referensiAdd(payload);
        }

        const body = await res.json();
        if (res.ok) {
            await alertSuccess("Data berhasil disimpan");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menyimpan data");
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage(page + 1);
    };

    const formFields = [
        {
            name: "kodeReferensi",
            label: "Kode Referensi",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "namaReferensi",
            label: "Nama Referensi",
            type: "text",
            required: true,
        },
    ];

    const columns = [
        { key: "kodeReferensi", label: "Kode Referensi" },
        { key: "namaReferensi", label: "Nama Referensi" },
    ];

    return (
        <>
            {isAdmin?
                <ChatAssistant
                    fields={["kodeReferensi", "namaReferensi"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }

            <DataTable
                title="Referensi Profesi"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onEdit={isAdmin  ? handleEdit: undefined}
                onDelete={isAdmin  ? handleDelete: undefined}
                searchPlaceholder="Cari referensi..."
                pagination={{
                    page,
                    size,
                    total: totalItems,
                    onNext: handleNext,
                    onPrev: handlePrev,
                }}
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
