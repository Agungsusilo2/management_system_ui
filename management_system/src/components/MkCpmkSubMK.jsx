import { useEffect, useState } from "react";
import {
    mkCpmkSubMKCreate,
    mkCpmkSubMKDelete,
    mkCpmkSubMKGetAll,
} from "../lib/api/mkCpmkSubMKApi";
import { mataKuliahAll } from "../lib/api/mataKuliahApi";
import { cpmkGetAll } from "../lib/api/cpmkApi";
import { subCPMKAll } from "../lib/api/subCpmkApi";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import { useAuth } from "../auth/AuthContext";

export default function MKCpmkSubMK() {
    const { authToken } = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [mkOptions, setMkOptions] = useState([]);
    const [cpmkOptions, setCpmkOptions] = useState([]);
    const [subOptions, setSubOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await mkCpmkSubMKGetAll({
            token: authToken,
            page,
            size,
        });
        const body = await res.json();

        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.idmk}-${item.kodeCPMK}-${item.subCPMKId}-${index}`,
                ...item,
            }));
            setData(mapped);
            setTotalItems(body.total || mapped.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data relasi MK-CPMK-SubCPMK");
        }
    };

    const fetchOptions = async () => {
        const [mkRes, cpmkRes, subRes] = await Promise.all([
            mataKuliahAll(authToken),
            cpmkGetAll({ token: authToken, page: 1, size: 100 }),
            subCPMKAll({ token: authToken, page: 1, size: 100 }),
        ]);

        const mkBody = await mkRes.json();
        const cpmkBody = await cpmkRes.json();
        const subBody = await subRes.json();

        if (mkRes.ok && cpmkRes.ok && subRes.ok) {
            setMkOptions(
                (mkBody.data || []).map((item) => ({
                    value: item.idmk,
                    label: `${item.idmk} - ${item.namaMk}`,
                }))
            );

            setCpmkOptions(
                (cpmkBody.data || []).map((item) => ({
                    value: item.kodeCPMK,
                    label: `${item.kodeCPMK} - ${item.namaCPMK}`,
                }))
            );

            setSubOptions(
                (subBody.data || []).map((item) => ({
                    value: item.subCPMKId,
                    label: `${item.subCPMKId} - ${item.uraianSubCPMK}`,
                }))
            );
        } else {
            alertFailed("Gagal memuat data opsi MK/CPMK/SubCPMK");
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

        const res = await mkCpmkSubMKDelete({
            token: authToken,
            idmk: row.idmk,
            kodeCPMK: row.kodeCPMK,
            subCPMKId: row.subCPMKId,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi MK-CPMK-SubCPMK berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus relasi");
        }
    };

    const handleSubmit = async (formData) => {
        const res = await mkCpmkSubMKCreate({
            token: authToken,
            idmk: formData.idmk,
            kodeCPMK: formData.kodeCPMK,
            subCPMKId: formData.subCPMKId,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi MK-CPMK-SubCPMK berhasil ditambahkan");
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
            key: "idmk",
            label: "Mata Kuliah",
            render: (row) =>
                row.matkul ? `${row.matkul.kodeMK} - ${row.matkul.namaMk}` : row.idmk,
        },
        {
            key: "kodeCPMK",
            label: "CPMK",
        },
        {
            key: "subCPMKId",
            label: "Sub CPMK",
            render: (row) =>
                row.subCpmk ? `${row.subCpmk.subCPMKId} - ${row.subCpmk.uraianSubCPMK}` : row.subCPMKId,
        },
    ];

    const formFields = [
        {
            name: "idmk",
            label: "Mata Kuliah",
            type: "select",
            required: true,
            options: mkOptions,
        },
        {
            name: "kodeCPMK",
            label: "CPMK",
            type: "select",
            required: true,
            options: cpmkOptions,
        },
        {
            name: "subCPMKId",
            label: "Sub CPMK",
            type: "select",
            required: true,
            options: subOptions,
        },
    ];

    return (
        <>
            <DataTable
                title="Relasi MK - CPMK - SubCPMK"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onDelete={handleDelete}
                searchPlaceholder="Cari data MK / CPMK / SubCPMK..."
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
