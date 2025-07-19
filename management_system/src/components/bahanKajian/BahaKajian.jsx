import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
    bahanKajianCreate,
    bahanKajianKelulusanUpdate,
    bahanKajianKelulusanDelete, bahanKajianKelulusanGetAll,
} from "../../lib/api/bahanKajianApi.js";
import { referensiAll } from "../../lib/api/referensiApi.js";
import { alertSuccess, alertFailed, alertConfirm } from "../../lib/alert.js";
import DataTable from "../Table.jsx";
import ModalForm from "../ModelForm.jsx";
import ChatAssistant from "../ChatAssistant.jsx";

export default function BahanKajian() {
    const { authToken,user } = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [referensiOptions, setReferensiOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);


    const isAdmin = user.user_type === "Admin";

    const fetchData = async () => {
        const res = await bahanKajianKelulusanGetAll({ token: authToken, page, size });
        const body = await res.json();

        if (res.ok) {
            const mapped = body.data.map((item) => ({
                kodeBK: item.kodeBK,
                nama: item.namaBahanKajian,
                referensi: item.kodeReferensi,
                ...data
            }));

            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data bahan kajian");
        }
    };


    const fetchReferensi = async () => {
        const res = await referensiAll({ token: authToken, page: 1, size: 100 });
        const body = await res.json();
        if (res.ok) {
            const options = body.data.map((ref) => ({
                value: ref.kodeReferensi,
                label: ref.namaReferensi,
            }));
            setReferensiOptions(options);
        }
    };

    useEffect(() => {
        fetchData();
        fetchReferensi();
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


        const res = await bahanKajianKelulusanDelete({ token: authToken, kodeBK: row.kodeBK });
        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Data berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus data");
        }
    };

    const handleSubmit = async (formData) => {
        const payload = {
            token: authToken,
            kodeBK: formData.kodeBK,
            namaBahanKajian: formData.nama,
            kodeReferensi: formData.referensi,
        };

        let res;

        if (selectedRow) {
            res = await bahanKajianKelulusanUpdate(payload);
        } else {
            res = await bahanKajianCreate(payload);
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

    const columns = [
        { key: "kodeBK", label: "Kode BK" },
        { key: "nama", label: "Nama Bahan Kajian" },
        { key: "referensi", label: "Kode Referensi" },
    ];

    const formFields = [
        {
            name: "kodeBK",
            label: "Kode BK",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "nama",
            label: "Nama Bahan Kajian",
            type: "text",
            required: true,
        },
        {
            name: "referensi",
            label: "Referensi",
            type: "select",
            required: true,
            options: referensiOptions,
        },
    ];

    const handleAIResponse = async (result)=>{
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }
        for (const item of result.items) {
            const payload = {
                token:authToken,
                kodeBK: item.kodeBK,
                namaBahanKajian: item.namaBahanKajian || item.nama,
                kodeReferensi: item.kodeReferensi || item.referensi,
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

    return (
        <>
            {isAdmin?
                <ChatAssistant
                    fields={["kodeBK", "namaBahanKajian", "kodeReferensi"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }

            <DataTable
                title="Bahan Kajian"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd :undefined }
                onEdit={isAdmin ? handleEdit :undefined }
                onDelete={isAdmin ? handleDelete :undefined }
                searchPlaceholder="Cari bahan kajian..."
                pagination={{
                    page,
                    size,
                    total: totalItems,
                    onPrev: handlePrev,
                    onNext: handleNext,
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
