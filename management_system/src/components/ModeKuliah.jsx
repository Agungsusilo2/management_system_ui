import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    modeKuliahAll,
    modeKuliahAdd,
    modeKuliahUpdate,
    modeKuliahDelete
} from "../lib/api/modeKuliah.js";
import DataTable from "./Table.jsx";
import { alertFailed, alertSuccess, alertConfirm } from "../lib/alert.js";
import ModalForm from "./ModelForm.jsx";
import ChatAssistant from "./ChatAssistant.jsx";

export default function ModeKuliah() {
    const { authToken, user } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin";

    const getFormFields = () => {
        const fields = [
            {
                name: "nama",
                label: "Nama Jenis MK",
                type: "text",
                required: true,
            },
        ];

        if (selectedRow) {
            fields.unshift({
                name: "id",
                label: "ID Jenis MK",
                type: "text",
                required: true,
                disabled: true,
            });
        }

        return fields;
    };


    const fetchData = async () => {
        const response = await modeKuliahAll({ token: authToken, page, size });
        const result = await response.json();

        if (response.ok) {
            const formatted = result.data.map((item) => ({
                id: item.idModeKuliah,
                nama: item.namaModeKuliah,
            }));
            setData(formatted);
            setTotalItems(result.paging?.total_item || formatted.length);
        } else {
            await alertFailed(result.errors || "Gagal memuat data");
        }
    };

    useEffectOnce(() => {
        fetchData();
    });

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

    const handleSubmit = async (formData) => {
        let res;
        if (selectedRow) {
            res = await modeKuliahUpdate({
                token: authToken,
                idModeKuliah: selectedRow.id,
                namaModeKuliah: formData.nama,
            });
        } else {
            res = await modeKuliahAdd({
                token: authToken,
                namaModeKuliah: formData.nama,
            });
        }

        const resBody = await res.json();
        if (res.ok) {
            await alertSuccess("Data berhasil disimpan");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(resBody.errors || "Gagal menyimpan data");
        }
    };

    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus data ini?");
        if (!confirmed) return;

        const res = await modeKuliahDelete({
            token: authToken,
            idModeKuliah: row.id,
        })

        const resBody = await res.json();
        if (res.ok) {
            await alertSuccess("Data berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(resBody.errors || "Gagal menghapus data");
        }
    };

    const handleAIResponse = async (result) => {
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }

        for (const item of result.items) {
            try {
                const res = await modeKuliahAdd({
                    token: authToken,
                    namaModeKuliah: item.namaModeKuliah,
                });
                if (!res.ok) {
                    const err = await res.json();
                    await alertFailed(err.errors || `❌ Gagal menambahkan ${item.namaModeKuliah}`);
                }
            } catch (err) {
                console.error(err);
            }
        }

        await alertSuccess("✅ Semua data berhasil ditambahkan!");
        fetchData();
    };

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "nama", label: "Nama Mode Kuliah" },
    ];

    return (
        <>
            {isAdmin && (
                <ChatAssistant
                    fields={["namaModeKuliah"]}
                    onAIResponse={handleAIResponse}
                />
            )}

            <DataTable
                title="Daftar Mode Kuliah"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd : undefined}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                searchPlaceholder="Cari mode kuliah..."
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
                fields={getFormFields()}
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
