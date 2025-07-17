import { useEffect, useState } from "react";
import {
    cplCpmkMkCreate,
    cplCpmkMkDelete,
    cplCpmkMkGetAll,
} from "../lib/api/cplCpmkMkApi";
import { cplProdiAll } from "../lib/api/cplProdiApi";
import { cpmkGetAll } from "../lib/api/cpmkApi";
import { mataKuliahAll } from "../lib/api/mataKuliahApi";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import { useAuth } from "../auth/AuthContext";

export default function CplCpmkMk() {
    const { authToken } = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [cplOptions, setCplOptions] = useState([]);
    const [cpmkOptions, setCpmkOptions] = useState([]);
    const [mkOptions, setMkOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await cplCpmkMkGetAll({
            token: authToken,
            page,
            size,
        });
        const body = await res.json();
        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.kodeCPL}-${item.kodeCPMK}-${item.idmk}-${index}`,
                ...item,
            }));
            setData(mapped);
            setTotalItems(body.total || mapped.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data CPL-CPMK-MK");
        }
    };

    const fetchOptions = async () => {
        const [cplRes, cpmkRes, mkRes] = await Promise.all([
            cplProdiAll({ token: authToken, page: 1, size: 100 }),
            cpmkGetAll({ token: authToken, page: 1, size: 100 }),
            mataKuliahAll(authToken),
        ]);

        const cplBody = await cplRes.json();
        const cpmkBody = await cpmkRes.json();
        const mkBody = await mkRes.json();

        if (cplRes.ok && cpmkRes.ok && mkRes.ok) {
            setCplOptions(
                (cplBody.data || []).map((item) => ({
                    value: item.kodeCPL,
                    label: `${item.kodeCPL} - ${item.deskripsiCPL}`,
                }))
            );

            setCpmkOptions(
                (cpmkBody.data || []).map((item) => ({
                    value: item.kodeCPMK,
                    label: `${item.kodeCPMK} - ${item.namaCPMK}`,
                }))
            );

            setMkOptions(
                (mkBody.data || []).map((item) => ({
                    value: item.idmk,
                    label: `${item.idmk} - ${item.namaMk}`,
                }))
            );
        } else {
            alertFailed("Gagal memuat opsi CPL / CPMK / MK");
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

        const res = await cplCpmkMkDelete({
            token: authToken,
            kodeCPL: row.kodeCPL,
            kodeCPMK: row.kodeCPMK,
            idmk: row.idmk,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-CPMK-MK berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus relasi");
        }
    };

    const handleSubmit = async (formData) => {
        const res = await cplCpmkMkCreate({
            token: authToken,
            kodeCPL: formData.kodeCPL,
            kodeCPMK: formData.kodeCPMK,
            idmk: formData.idmk,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-CPMK-MK berhasil ditambahkan");
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
        {
            key: "kodeCPL",
            label: "CPL Prodi",
            render: (row) =>
                row.cpl ? `${row.cpl.kodeCPL} - ${row.cpl.deskripsiCPL}` : row.kodeCPL,
        },
        {
            key: "kodeCPMK",
            label: "CPMK",
            render: (row) =>
                row.cpmk ? `${row.cpmk.kodeCPMK} - ${row.cpmk.namaCPMK}` : row.kodeCPMK,
        },
        {
            key: "idmk",
            label: "Mata Kuliah",
            render: (row) =>
                row.matkul ? `${row.matkul.idmk} - ${row.matkul.namaMk}` : row.idmk,
        },
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
            name: "kodeCPMK",
            label: "CPMK",
            type: "select",
            required: true,
            options: cpmkOptions,
        },
        {
            name: "idmk",
            label: "Mata Kuliah",
            type: "select",
            required: true,
            options: mkOptions,
        },
    ];

    return (
        <>
            <DataTable
                title="Relasi CPL - CPMK - MK"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onDelete={handleDelete}
                searchPlaceholder="Cari CPL, CPMK, atau MK..."
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
