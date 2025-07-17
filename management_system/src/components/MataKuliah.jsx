import { useEffect, useState } from "react";
import {
    mataKuliahAll,
    mataKuliahAdd,
    mataKuliahUpdate,
    mataKuliahDelete,
} from "../lib/api/mataKuliahApi.js";

import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert.js";

import DataTable from "../components/Table.jsx";
import ModalForm from "../components/ModelForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function MataKuliah() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await mataKuliahAll(authToken, page, size);
        const body = await res.json();

        if (res.ok) {
            const mapped = body.data.map((item) => ({
                id: item.idmk,
                nama: item.namaMk,
            }));
            setData(mapped);
            setTotalItems(body.total || mapped.length); // fallback kalau backend belum support `total`
        } else {
            await alertFailed(body.errors || "Gagal mengambil data");
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
        const confirm = await alertConfirm("Yakin ingin menghapus data?");
        if (!confirm) return;

        const res = await mataKuliahDelete({ token: authToken, idmk: row.id });
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
            idmk: selectedRow ? selectedRow.id : formData.id,
            namaMk: formData.nama,
        };

        let res;
        if (selectedRow) {
            res = await mataKuliahUpdate(payload);
        } else {
            res = await mataKuliahAdd(payload);
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
        { key: "id", label: "ID Mata Kuliah" },
        { key: "nama", label: "Nama Mata Kuliah" },
    ];

    const formFields = [
        {
            name: "id",
            label: "ID Mata Kuliah",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "nama",
            label: "Nama Mata Kuliah",
            type: "text",
            required: true,
        },
    ];

    return (
        <>
            <DataTable
                title="Daftar Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Cari mata kuliah..."
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
        </>
    );
}
