import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    semesterAll,
    semesterAdd,
    semesterUpdate,
    semesterDelete,
} from "../lib/api/semesterApi.js";
import DataTable from "./Table.jsx";
import ModalForm from "./ModelForm.jsx";
import ChatAssistant from "./ChatAssistant.jsx";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert.js";

export default function Semester() {
    const { authToken, user } = useAuth();
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin";

    const formFields = [
        { name: "semesterInt", label: "Semester (Angka)", type: "number", required: true },
    ];


    const fetchData = async () => {
        const res = await semesterAll({ token: authToken, page, size });
        const result = await res.json();

        console.log(result)
        if (res.ok) {
            setData(result.data);
            setTotalItems(result.paging?.total_item || result.data.length);
        } else {
            await alertFailed(result.errors || "Gagal memuat data semester");
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

    const handleSubmit = async (formData) => {
        const payload = {
            semesterInt: parseInt(formData.semesterInt),
            token: authToken,
        };

        let res;
        if (selectedRow) {
            res = await semesterUpdate({
                ...payload,
                kodeSemester: selectedRow.kodeSemester,
            });
        } else {
            res = await semesterAdd(payload);
        }

        const result = await res.json();

        if (res.ok) {
            await alertSuccess("Berhasil menyimpan data semester");
            setModalVisible(false);
            fetchData();
        } else {
            await alertFailed(result.errors || "Gagal menyimpan data semester");
        }
    };

    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus semester ini?");
        if (!confirmed) return;

        const res = await semesterDelete({
            token: authToken,
            kodeSemester: row.kodeSemester,
        });

        const result = await res.json();

        if (res.ok) {
            await alertSuccess("Berhasil menghapus semester");
            fetchData();
        } else {
            await alertFailed(result.errors || "Gagal menghapus semester");
        }
    };

    const handleAIResponse = async (result) => {
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("Format tidak valid. Gunakan `action: add` dan `items[]`");
            return;
        }

        for (const item of result.items) {
            try {
                const res = await semesterAdd({
                    token: authToken,
                    semesterInt: parseInt(item.semesterInt),
                });

                if (!res.ok) {
                    const err = await res.json();
                    await alertFailed(err.errors || `Gagal tambah semester ${item.semesterInt}`);
                }
            } catch (e) {
                console.error(e);
            }
        }

        await alertSuccess("✅ Semua data semester berhasil ditambahkan!");
        fetchData();
    };

    const columns = [
        { key: "kodeSemester", label: "Kode" },
        { key: "semesterInt", label: "Semester" },
    ];




    function nextHandle() {
        var totalPages = Math.ceil(totalItems / size);
        if(totalPages > page) setPage(page + 1)
    }

    function prevHandle() {
        if(page > 1) setPage(page -1)
    }

    return (
        <>
            {isAdmin && (
                <ChatAssistant
                    fields={["semesterInt"]}
                    onAIResponse={handleAIResponse}
                />
            )}

            <DataTable
                title="Daftar Semester"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd : undefined}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                searchPlaceholder="Cari Semester..."
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
                    onClick={prevHandle}
                    disabled={page <= 1}
                    className={`btn btn-secondary px-4 py-2 rounded-md text-white ${
                        page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    ← Prev
                </button>

                <span className="text-gray-700 font-medium">Halaman {page}</span>

                <button
                    onClick={nextHandle}
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
