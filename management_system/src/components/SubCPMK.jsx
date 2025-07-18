import { useEffect, useState } from "react";
import {
    subCPMKAll,
    subCPMKAdd,
    subCPMKUpdate,
    subCPMKDelete,
} from "../lib/api/subcpmkApi";
import { useAuth } from "../auth/AuthContext";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import {bahanKajianCreate} from "../lib/api/bahanKajianApi.js";
import ChatAssistant from "./ChatAssistant.jsx";

export default function SubCPMKPage() {
    const { authToken ,user} = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin"
    const fetchData = async () => {
        const res = await subCPMKAll({ token: authToken, page, size });
        const body = await res.json();
        if (res.ok) {
            const mappedData = (body.data || []).map((item) => ({
                id: item.subCPMKId,
                uraian: item.uraianSubCPMK,
            }));

            setData(mappedData);
            setTotalItems(body.paging?.total_item || mappedData.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data SubCPMK");
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
        const confirm = await alertConfirm("Yakin ingin menghapus SubCPMK?");
        if (!confirm) return;

        const res = await subCPMKDelete({ token: authToken, subCPMKId: row.id });
        const body = await res.json();

        if (res.ok) {
            await alertSuccess("SubCPMK berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus SubCPMK");
        }
    };

    const handleSubmit = async (formData) => {
        const isUpdate = !!selectedRow;
        const res = isUpdate
            ? await subCPMKUpdate({
                token: authToken,
                subCPMKId: selectedRow.id,
                uraianSubCPMK: formData.uraian,
            })
            : await subCPMKAdd({
                token: authToken,
                subCPMKId: formData.id,
                uraianSubCPMK: formData.uraian,
            });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess(`SubCPMK berhasil ${isUpdate ? "diperbarui" : "ditambahkan"}`);
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menyimpan SubCPMK");
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
        { key: "id", label: "ID SubCPMK" },
        { key: "uraian", label: "Uraian SubCPMK" },
    ];

    const formFields = [
        {
            name: "id",
            label: "ID SubCPMK",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "uraian",
            label: "Uraian SubCPMK",
            type: "text",
            required: true,
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
                subCPMKId: item.subCPMKId,
                uraianSubCPMK: item.uraianSubCPMK,
            };

            try {
                const res = await subCPMKAdd(payload);
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
                    fields={["subCPMKId", "uraianSubCPMK"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }
            <DataTable
                title="Daftar SubCPMK"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onEdit={isAdmin ? handleEdit: undefined}
                onDelete={isAdmin ? handleDelete: undefined}
                searchPlaceholder="Cari SubCPMK..."
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
