import { useEffect, useState } from "react";
import {
    cplPlCreate,
    cplPlDelete,
    cplPlGetAll,
} from "../lib/api/cplPlApi";
import { cplProdiAll } from "../lib/api/cplProdiApi";
import { profileKelulusanGetAll } from "../lib/api/profileKelulusanApi";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import { useAuth } from "../auth/AuthContext";

export default function CPLPLPage() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [cplOptions, setCplOptions] = useState([]);
    const [plOptions, setPlOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await cplPlGetAll({ token: authToken, page, size });
        const body = await res.json();

        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.kodeCPL}-${item.kodePL}-${index}`,
                ...item,
            }));
            setData(mapped);
            setTotalItems(body.total || mapped.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data CPL-PL");
        }
    };

    const fetchOptions = async () => {
        const [cplRes, plRes] = await Promise.all([
            cplProdiAll({ token: authToken, page: 1, size: 100 }),
            profileKelulusanGetAll({ token: authToken, page: 1, size: 100 }),
        ]);

        const cplBody = await cplRes.json();
        const plBody = await plRes.json();

        if (cplRes.ok && plRes.ok) {
            setCplOptions(
                (cplBody.data || []).map((item) => ({
                    value: item.kodeCPL,
                    label: `${item.kodeCPL} - ${item.deskripsiCPL}`,
                }))
            );
            setPlOptions(
                (plBody.data || []).map((item) => ({
                    value: item.kodePL,
                    label: `${item.kodePL} - ${item.deskripsi}`,
                }))
            );
        } else {
            alertFailed("Gagal memuat opsi CPL/PL");
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
        const confirm = await alertConfirm("Yakin ingin menghapus relasi CPL-PL ini?");
        if (!confirm) return;

        const res = await cplPlDelete({
            token: authToken,
            kodeCPL: row.kodeCPL,
            kodePL: row.kodePL,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-PL berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus relasi CPL-PL");
        }
    };

    const handleSubmit = async (formData) => {
        const res = await cplPlCreate({
            token: authToken,
            kodeCPL: formData.kodeCPL,
            kodePL: formData.kodePL,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-PL berhasil ditambahkan");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menambahkan relasi CPL-PL");
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
        { key: "kodePL", label: "Kode PL" },
    ];

    const formFields = [
        {
            name: "kodeCPL",
            label: "CPL Prodi",
            type: "select",
            required: true,
            options: cplOptions,
        },
        {
            name: "kodePL",
            label: "Profil Lulusan",
            type: "select",
            required: true,
            options: plOptions,
        },
    ];

    return (
        <>
            <DataTable
                title="Relasi CPL - PL"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onDelete={handleDelete}
                searchPlaceholder="Cari CPL atau PL..."
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
