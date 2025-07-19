import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    metodePembelajaranAll,
    metodePembelajaranAdd,
    metodePembelajaranUpdate,
    metodePembelajaranDelete,
} from "../lib/api/metodePembelajaran.js";
import DataTable from "./Table.jsx";
import ModalForm from "./ModelForm.jsx";
import ChatAssistant from "./ChatAssistant.jsx";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert.js";

export default function MetodePembelajaran() {
    const { authToken, user } = useAuth();
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin";

    const fetchData = async () => {
        const res = await metodePembelajaranAll({ token: authToken, page, size });
        const result = await res.json();

        if (res.ok) {
            setData(result.data);
            setTotalItems(result.paging?.total_item || result.data.length);
        } else {
            await alertFailed(result.errors || "Gagal memuat data metode pembelajaran");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const formFields = [
        { name: "namaMetodePembelajaran", label: "Nama Metode", type: "text", required: true },
    ];

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setModalVisible(true);
    };

    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus metode ini?");
        if (!confirmed) return;

        const res = await metodePembelajaranDelete({
            token: authToken,
            idMetodePembelajaran: row.idMetodePembelajaran,
        });

        const result = await res.json();

        if (res.ok) {
            await alertSuccess("Berhasil menghapus");
            fetchData();
        } else {
            await alertFailed(result.errors || "Gagal menghapus data");
        }
    };

    const handleSubmit = async (formData) => {
        const payload = {
            token: authToken,
            namaMetodePembelajaran: formData.namaMetodePembelajaran,
        };

        let res;
        if (selectedRow) {
            res = await metodePembelajaranUpdate({
                ...payload,
                idMetodePembelajaran: selectedRow.idMetodePembelajaran,
            });
        } else {
            res = await metodePembelajaranAdd(payload);
        }

        const result = await res.json();

        if (res.ok) {
            await alertSuccess("Berhasil menyimpan data");
            setModalVisible(false);
            fetchData();
        } else {
            await alertFailed(result.errors || "Gagal menyimpan data");
        }
    };

    const handleAIResponse = async (result) => {
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("Format tidak valid. Gunakan `action: add` dan `items[]`");
            return;
        }

        for (const item of result.items) {
            const res = await metodePembelajaranAdd({
                token: authToken,
                namaMetodePembelajaran: item.namaMetodePembelajaran,
            });

            if (!res.ok) {
                const err = await res.json();
                await alertFailed(err.errors || `Gagal menambahkan ${item.namaMetodePembelajaran}`);
            }
        }

        await alertSuccess("✅ Data berhasil ditambahkan via AI");
        fetchData();
    };

    const columns = [
        { key: "idMetodePembelajaran", label: "ID" },
        { key: "namaMetodePembelajaran", label: "Nama Metode" },
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
                    fields={["namaMetodePembelajaran"]}
                    onAIResponse={handleAIResponse}
                />
            )}

            <DataTable
                title="Metode Pembelajaran"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd : undefined}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                pagination={{
                    page,
                    size,
                    total: totalItems,
                    onNext: handleNext,
                    onPrev: handlePrev,
                }}
                searchPlaceholder="Cari nama metode..."
            />

            <ModalForm
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialData={selectedRow}
                fields={formFields}
            />
        </>
    );
}
