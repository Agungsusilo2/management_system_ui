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

export default function Referensi() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await referensiAll({ token: authToken, page, size });
        const body = await res.json();
        if (res.ok) {
            const mapped = body.data.map((item) => ({
                kodeReferensi: item.kodeReferensi,
                namaReferensi: item.namaReferensi,
            }));

            setData(mapped);
            setTotalItems(body.total || mapped.length);
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
            <DataTable
                title="Referensi Profesi"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
        </>
    );
}
