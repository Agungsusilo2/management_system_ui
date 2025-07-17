import { useEffect, useState } from "react";
import {
    bkMkCreate,
    bkMkDelete,
    bkMkGetAll,
} from "../lib/api/bkMkApi.js";
import { bahanKajianKelulusanGetAll } from "../lib/api/bahanKajianApi.js";
import { mataKuliahAll } from "../lib/api/mataKuliahApi.js";
import {
    alertSuccess,
    alertFailed,
    alertConfirm
} from "../lib/alert.js";
import DataTable from "../components/Table.jsx";
import ModalForm from "../components/ModelForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function BKMK() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [bahanKajianOptions, setBahanKajianOptions] = useState([]);
    const [mataKuliahOptions, setMataKuliahOptions] = useState([]);

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
                    idmk: item.idmk,
                }));

                setData(mappedData);
                setTotalItems(body.total || mappedData.length);
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
                bahanKajianKelulusanGetAll(authToken),
                mataKuliahAll(authToken),
            ]);

            const bkBody = await bkRes.json();
            const mkBody = await mkRes.json();

            if (bkRes.ok) {
                setBahanKajianOptions(
                    (bkBody.data || []).map((item) => ({
                        value: item.kodeBK,
                        label: `${item.kodeBK} - ${item.bahanKajian || ""}`,
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

    const columns = [
        { key: "kodeBK", label: "Kode Bahan Kajian" },
        { key: "idmk", label: "ID Mata Kuliah" },
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
            <DataTable
                title="Relasi Bahan Kajian - Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onDelete={handleDelete}
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
        </>
    );
}
