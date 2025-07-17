import { useEffect, useState } from "react";
import {
    cplProdiAll,
    cplProdiAdd,
    cplProdiUpdate,
    cplProdiDelete,
} from "../lib/api/cplProdiApi";
import { aspekAll } from "../lib/api/aspekApi";
import {
    alertFailed,
    alertSuccess,
    alertConfirm,
} from "../lib/alert";
import { useAuth } from "../auth/AuthContext";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";

export default function CPLProdiPage() {
    const { authToken } = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [aspekOptions, setAspekOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await cplProdiAll({ token: authToken, page, size });
        const body = await res.json();

        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.kodeCPL}-${index}`,
                ...item,
            }));
            setData(mapped);
            setTotalItems(body.total || mapped.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data CPL Prodi");
        }
    };

    const fetchAspekOptions = async () => {
        const res = await aspekAll({ token: authToken, page: 1, size: 100 });
        const body = await res.json();

        if (res.ok) {
            const options = (body.data || []).map((item) => ({
                value: item.kodeAspek,
                label: `${item.kodeAspek} - ${item.namaAspek}`,
            }));
            setAspekOptions(options);
        } else {
            await alertFailed("Gagal memuat aspek CPL");
        }
    };

    useEffect(() => {
        fetchData();
        fetchAspekOptions();
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
        const confirm = await alertConfirm("Yakin ingin menghapus CPL ini?");
        if (!confirm) return;

        const res = await cplProdiDelete({
            token: authToken,
            kodeCPL: row.kodeCPL,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("CPL Prodi berhasil dihapus");
            await fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus CPL Prodi");
        }
    };

    const handleSubmit = async (formData) => {
        const isUpdate = !!selectedRow;

        const res = isUpdate
            ? await cplProdiUpdate({
                token: authToken,
                kodeCPL: selectedRow.kodeCPL,
                deskripsiCPL: formData.deskripsiCPL,
                kodeAspek: formData.kodeAspek,
            })
            : await cplProdiAdd({
                token: authToken,
                kodeCPL: formData.kodeCPL,
                deskripsiCPL: formData.deskripsiCPL,
                kodeAspek: formData.kodeAspek,
            });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess(`CPL Prodi berhasil ${isUpdate ? "diperbarui" : "ditambahkan"}`);
            await fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menyimpan CPL Prodi");
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
        { key: "kodeCPL", label: "Kode CPL" },
        { key: "deskripsiCPL", label: "Deskripsi CPL" },
        { key: "kodeAspek", label: "Kode Aspek CPL" },
    ];

    const formFields = [
        {
            name: "kodeCPL",
            label: "Kode CPL",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "deskripsiCPL",
            label: "Deskripsi CPL",
            type: "text",
            required: true,
        },
        {
            name: "kodeAspek",
            label: "Aspek CPL",
            type: "select",
            required: true,
            options: aspekOptions,
        },
    ];

    return (
        <>
            <DataTable
                title="Daftar CPL Prodi"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Cari CPL..."
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
