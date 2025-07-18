import { useEffect, useState } from "react";
import {
    bkMkCreate,
    bkMkDelete,
    bkMkGetAll,
} from "../lib/api/bkMkApi.js";
import { mataKuliahAll } from "../lib/api/mataKuliahApi.js";
import {
    alertSuccess,
    alertFailed,
    alertConfirm
} from "../lib/alert.js";
import DataTable from "../components/Table.jsx";
import ModalForm from "../components/ModelForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import ChatAssistant from "./ChatAssistant.jsx";
import {bahanKajianKelulusanGetAll} from "../lib/api/bahanKajianApi.js";

export default function BKMK() {
    const { authToken ,user} = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [bahanKajianOptions, setBahanKajianOptions] = useState([]);
    const [mataKuliahOptions, setMataKuliahOptions] = useState([]);

    const isAdmin = user.user_type === "Admin"
    const fetchData = async () => {
        try {
            const res = await bkMkGetAll({
                token: authToken,
                page,
                size,
            });
            const body = await res.json();
            if (res.ok) {
                const mappedData = (body.data || []).map((item, index) => ({
                    id: `${item.kodeBK}-${item.idmk}-${index}`,
                    kodeBK: item.kodeBK,
                    kodeReferensi: item.namaBahanKajian.kodeReferensi,
                    namaBahanKajian: item.namaBahanKajian.namaBahanKajian,
                    idmk: item.mataKuliah.idmk,
                    namaMK: item.mataKuliah.namaMk,
                }));

                setData(mappedData);
                setTotalItems(body.paging?.total_item || mappedData.length);
            } else {
                alertFailed(body.errors || "Gagal mengambil data relasi");
            }
        } catch (err) {
            alertFailed("Terjadi kesalahan saat mengambil data relasi");
        }
    };

    const fetchOptions = async () => {
        try {
            const [bkRes, mkRes] = await Promise.all([
                bahanKajianKelulusanGetAll({token:authToken,page:1,size:100}),
                mataKuliahAll({token:authToken,page:1,size:100}),
            ]);

            const bkBody = await bkRes.json();
            const mkBody = await mkRes.json();

            if (bkRes.ok) {
                setBahanKajianOptions(
                    (bkBody.data || []).map((item) => ({
                        value: item.kodeBK,
                        label: `${item.kodeBK} - ${item.namaBahanKajian || ""}`,
                    }))
                );
            }

            if (mkRes.ok) {
                setMataKuliahOptions(
                    (mkBody.data || []).map((item) => ({
                        value: item.idmk,
                        label: `${item.idmk} - ${item.namaMk || ""}`,
                    }))
                );
            }
        } catch (err) {
            await alertFailed("Gagal memuat opsi bahan kajian atau mata kuliah");
        }
    };

    useEffect(() => {
        fetchData();
        fetchOptions();
    }, [page]);

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    const handleDelete = async (row) => {
        const confirm = await alertConfirm("Yakin ingin menghapus relasi ini?");
        if (!confirm) return;

        const res = await bkMkDelete({
            token: authToken,
            kodeBK: row.kodeBK,
            idmk: row.idmk,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi BK-MK berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus relasi");
        }
    };

    const handleSubmit = async (formData) => {
        const res = await bkMkCreate({
            token: authToken,
            kodeBK: formData.kodeBK,
            idmk: formData.idmk,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi BK-MK berhasil ditambahkan");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menambahkan relasi");
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage(page + 1);
    };

    const handleAIResponse = async (result)=>{
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }

        for (const item of result.items) {
            const payload = {
                token:authToken,
                kodeBK: item.kodeBK,
                idmk: item.idmk,
            };


            try {
                const res = await bkMkCreate(payload);
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


    const columns = [
        { key: "kodeBK", label: "Kode Bahan Kajian" },
        { key: "namaBahanKajian", label: "Nama Bahan Kajian" },
        { key: "kodeReferensi", label: "Kode Referensi" },
        { key: "idmk", label: "ID Mata Kuliah" },
        { key: "namaMK", label: "Nama Mata Kuliah" },
    ];

    const formFields = [
        {
            name: "kodeBK",
            label: "Kode Bahan Kajian",
            type: "select",
            required: true,
            options: bahanKajianOptions,
        },
        {
            name: "idmk",
            label: "ID Mata Kuliah",
            type: "select",
            required: true,
            options: mataKuliahOptions,
        },
    ];

    return (
        <>
            {isAdmin?
                <ChatAssistant
                    fields={["kodeBK", "idmk"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }
            <DataTable
                title="Relasi Bahan Kajian - Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onDelete={isAdmin ? handleDelete: undefined}
                searchPlaceholder="Cari relasi BK - MK..."
                disableEdit={true}
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
