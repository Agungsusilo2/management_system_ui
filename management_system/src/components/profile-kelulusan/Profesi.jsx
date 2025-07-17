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

export default function Profesi() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const formFields = [
        {
            name: "kode",
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

    const fetchData = async () => {
        const response = await profileAll({ token: authToken, page:page, size:size });
        const result = await response.json();

        if (response.ok) {
            const formatted = result.data.map((item) => ({
                id: item.kodeProfesi,
                nama: item.namaProfesi,
            }));
            setData(formatted);
            setTotalItems(result.total || formatted.length);
        } else {
            await alertFailed(result.errors || "Gagal memuat data");
        }
    };

    useEffectOnce(() => {
        fetchData();
    });

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
                Profesi: formData.nama,
            });
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
        { key: "nama", label: "Nama Profesi" },
    ];

    return (
        <>
            <DataTable
                title="Daftar Profesi"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
        </>
    );
}
