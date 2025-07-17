import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
    bahanKajianCreate,
    bahanKajianKelulusanUpdate,
    bahanKajianKelulusanDelete,
    bahanKajianKelulusanGetPageAll
} from "../../lib/api/bahanKajianApi.js";
import { referensiAll } from "../../lib/api/referensiApi.js";
import { alertSuccess, alertFailed, alertConfirm } from "../../lib/alert.js";
import DataTable from "../Table.jsx";
import ModalForm from "../ModelForm.jsx";

export default function BahanKajian() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [referensiOptions, setReferensiOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await bahanKajianKelulusanGetPageAll({ token: authToken, page, size });
        const body = await res.json();

        if (res.ok) {
            const mapped = body.data.map((item) => ({
                id: item.kodeBK,
                nama: item.namaBahanKajian,
                referensi: item.kodeReferensi,
            }));

            setData(mapped);
            setTotalItems(body.total || mapped.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data bahan kajian");
        }
    };

    const fetchReferensi = async () => {
        const res = await referensiAll({ token: authToken, page: 1, size: 100 });
        const body = await res.json();
        if (res.ok) {
            const options = body.data.map((ref) => ({
                value: ref.kodeReferensi,
                label: ref.namaReferensi,
            }));
            setReferensiOptions(options);
        }
    };

    useEffect(() => {
        fetchData();
        fetchReferensi();
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

        const res = await bahanKajianKelulusanDelete({ token: authToken, kodeBK: row.id });
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
            kodeBK: selectedRow ? selectedRow.id : formData.kodeBK,
            namaBahanKajian: formData.nama,
            kodeReferensi: formData.referensi,
        };

        let res;
        if (selectedRow) {
            res = await bahanKajianKelulusanUpdate(payload);
        } else {
            res = await bahanKajianCreate(payload);
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
        { key: "id", label: "Kode BK" },
        { key: "nama", label: "Nama Bahan Kajian" },
        { key: "referensi", label: "Kode Referensi" },
    ];

    const formFields = [
        {
            name: "kodeBK",
            label: "Kode BK",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "nama",
            label: "Nama Bahan Kajian",
            type: "text",
            required: true,
        },
        {
            name: "referensi",
            label: "Referensi",
            type: "select",
            required: true,
            options: referensiOptions,
        },
    ];

    return (
        <>
            <DataTable
                title="Bahan Kajian"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Cari bahan kajian..."
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
