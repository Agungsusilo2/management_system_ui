import {useEffect, useState} from "react";
import { useEffectOnce } from "react-use";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
    profileAll,
    profileAdd,
    profileUpdate,
    profileDelete
} from "../../lib/api/profesiApi.js";
import DataTable from "../Table.jsx";
import { alertFailed, alertSuccess, alertConfirm } from "../../lib/alert.js";
import ModalForm from "../ModelForm.jsx";
import ChatAssistant from "../ChatAssistant.jsx";

export default function Profesi() {
    const { authToken,user } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const formFields = [
        {
            name: "id",
            label: "Kode Profesi",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "nama",
            label: "Nama Profesi",
            type: "text",
            required: true,
        },
    ];

    const isAdmin = user.user_type === "Admin"

    const fetchData = async () => {
        const response = await profileAll({ token: authToken, page:page, size:size });
        const result = await response.json();

        if (response.ok) {
            const formatted = result.data.map((item) => ({
                id: item.kodeProfesi,
                nama: item.namaProfesi,
            }));
            setData(formatted);
            setTotalItems(result.paging?.total_item || formatted.length);
        } else {
            await alertFailed(result.errors || "Gagal memuat data");
        }
    };

    useEffectOnce(() => {
        fetchData();
    },[page]);

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
            res = await profileUpdate({
                token: authToken,
                KodeProfesi: selectedRow.id,
                namaProfesi: formData.nama,
            });

            const body = await res
        } else {
            res = await profileAdd({
                token: authToken,
                KodeProfesi: formData.kode,
                Profesi: formData.nama,
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

    const handleAIResponse = async (result)=>{
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }
        for (const item of result.items) {
            const payload = {
                token:authToken,
                KodeProfesi: item.KodeProfesi,
                Profesi: item.Profesi,
            };

            try {
                const res = await profileAdd(payload);
                const body = await res.json();

                if (!res.ok) {
                    await alertFailed(`❌ Gagal menambahkan: ${payload.KodeProfesi} - ${payload.Profesi}`);
                }
            } catch (err) {
                console.error(err);
            }
        }

        await alertSuccess("✅ Semua data berhasil ditambahkan!");
        fetchData();
    }


    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus data ini?");
        if (!confirmed) return;

        const res = await profileDelete({
            token: authToken,
            KodeProfesi: row.id,
        });

        const resBody = await res.json();
        if (res.ok) {
            await alertSuccess("Data berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(resBody.errors || "Gagal menghapus data");
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const columns = [
        { key: "id", label: "Kode Profesi" },
        { key: "nama", label: "Nama Profesi" },
    ];

    return (
        <>

            {isAdmin?
                <ChatAssistant
                    fields={["KodeProfesi", "Profesi"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }


            <DataTable
                title="Daftar Profesi"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onEdit={isAdmin ? handleEdit: undefined}
                onDelete={isAdmin ? handleDelete: undefined}
                searchPlaceholder="Cari profesi..."
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
