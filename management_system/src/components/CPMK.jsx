import { useEffect, useState } from "react";
import {
    cpmkCreate,
    cpmkDelete,
    cpmkGetAll,
    cpmkUpdate,
} from "../lib/api/cpmkApi";
import { subCPMKAll } from "../lib/api/subcpmkApi";
import {
    alertFailed,
    alertSuccess,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import { useAuth } from "../auth/AuthContext";
import ChatAssistant from "./ChatAssistant.jsx";

export default function CPMKPage() {
    const { authToken,user } = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [subCPMKOptions, setSubCPMKOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin"
    const fetchData = async () => {
        const res = await cpmkGetAll({ token: authToken, page, size });
        const body = await res.json();

        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.kodeCPMK}-${index}`,
                ...item,
                uraianSubCPMK: item.subCPMK?.uraianSubCPMK || "-",
            }));
            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data CPMK");
        }
    };

    const fetchSubCPMKOptions = async () => {
        const res = await subCPMKAll({ token: authToken, page: 1, size: 100 });
        const body = await res.json();

        if (res.ok) {
            const options = (body.data || []).map((item) => ({
                value: item.subCPMKId,
                label: `${item.subCPMKId} - ${item.uraianSubCPMK}`,
            }));
            setSubCPMKOptions(options);
        } else {
            await alertFailed("Gagal memuat opsi Sub CPMK");
        }
    };

    useEffect(() => {
        fetchData();
        fetchSubCPMKOptions();
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
        const confirm = await alertConfirm("Yakin ingin menghapus CPMK ini?");
        if (!confirm) return;

        const res = await cpmkDelete({
            token: authToken,
            kodeCPMK: row.kodeCPMK,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("CPMK berhasil dihapus");
            await fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus CPMK");
        }
    };

    const handleSubmit = async (formData) => {
        const isUpdate = !!selectedRow;

        const res = isUpdate
            ? await cpmkUpdate({
                token: authToken,
                kodeCPMK: selectedRow.kodeCPMK,
                namaCPMK: formData.namaCPMK,
                subCPMKId: formData.subCPMKId,
            })
            : await cpmkCreate({
                token: authToken,
                kodeCPMK: formData.kodeCPMK,
                namaCPMK: formData.namaCPMK,
                subCPMKId: formData.subCPMKId,
            });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess(`CPMK berhasil ${isUpdate ? "diperbarui" : "ditambahkan"}`);
            await fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menyimpan CPMK");
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
        { key: "kodeCPMK", label: "Kode CPMK" },
        { key: "namaCPMK", label: "Nama CPMK" },
        { key: "subCPMKId", label: "Sub CPMK ID" },
        { key: "uraianSubCPMK", label: "Uraian Sub CPMK" },
    ];

    const formFields = [
        {
            name: "kodeCPMK",
            label: "Kode CPMK",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "namaCPMK",
            label: "Nama CPMK",
            type: "text",
            required: true,
        },
        {
            name: "subCPMKId",
            label: "Sub CPMK",
            type: "select",
            required: true,
            options: subCPMKOptions,
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
                kodeCPMK: item.kodeCPMK,
                namaCPMK: item.namaCPMK,
                subCPMKId: item.subCPMKId,
            };

            try {
                const res = await cpmkCreate(payload);
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
                    fields={["kodeCPMK", "namaCPMK", "subCPMKId"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }

            <DataTable
                title="Daftar CPMK"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onEdit={isAdmin ? handleEdit: undefined}
                onDelete={isAdmin ? handleDelete: undefined}
                searchPlaceholder="Cari CPMK..."
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
