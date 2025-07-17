import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
    profileKelulusanCreate,
    profileKelulusanDelete,
    profileKelulusanGetAll,
    profileKelulusanUpdate,
} from "../../lib/api/profileKelulusanApi.js";
import { profileAll } from "../../lib/api/profesiApi.js";
import { alertFailed, alertSuccess, alertConfirm } from "../../lib/alert.js";
import DataTable from "../Table.jsx";
import ModalForm from "../ModelForm.jsx";

export default function ProfilKelulusan() {
    const { authToken } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [profesiOptions, setProfesiOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await profileKelulusanGetAll({ token: authToken, page, size });
        const body = await res.json();
        if (res.status === 200) {
            const formatted = body.data.map((item) => ({
                id: item.kodePL,
                deskripsi: item.deskripsi,
                kodeProfesi: item.kodeProfesi,
            }));
            setData(formatted);
            setTotalItems(body.total || formatted.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data");
        }
    };

    const fetchProfesi = async () => {
        const res = await profileAll({token:authToken,page:1,size:100});
        const body = await res.json();
        if (res.status === 200) {
            const options = body.data.map((item) => ({
                value: item.kodeProfesi,
                label: item.namaProfesi,
            }));
            setProfesiOptions(options);
        }
    };

    useEffectOnce(() => {
        fetchProfesi();
    });

    useEffect(() => {
        fetchData();
    }, [page]);

    const formFields = [
        {
            name: "kodePL",
            label: "Kode Profil",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "deskripsi",
            label: "Deskripsi",
            type: "textarea",
            required: true,
        },
        {
            name: "kodeProfesi",
            label: "Profesi",
            type: "select",
            options: profesiOptions,
            required: true,
        },
    ];

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    const handleEdit = (row) => {
        setSelectedRow({
            kodePL: row.id,
            deskripsi: row.deskripsi,
            kodeProfesi: row.kodeProfesi,
        });
        setModalVisible(true);
    };

    const handleDelete = async (row) => {
        const confirmed = await alertConfirm("Yakin ingin menghapus data ini?");
        if (!confirmed) return;

        const res = await profileKelulusanDelete({ token: authToken, kodePL: row.id });
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
            kodePL: formData.kodePL,
            deskripsi: formData.deskripsi,
            kodeProfesi: formData.kodeProfesi,
        };

        let res;
        if (selectedRow) {
            res = await profileKelulusanUpdate(payload);
        } else {
            res = await profileKelulusanCreate(payload);
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

    const columns = [
        { key: "id", label: "Kode PL" },
        { key: "deskripsi", label: "Deskripsi" },
        { key: "kodeProfesi", label: "Kode Profesi" },
    ];

    return (
        <>
            <DataTable
                title="Profil Kelulusan"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Cari profil kelulusan..."
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
