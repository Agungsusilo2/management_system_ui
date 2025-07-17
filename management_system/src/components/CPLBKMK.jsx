import { useEffect, useState } from "react";
import {
    cplBkMkCreate,
    cplBkMkDelete,
    cplBkMkGetAll,
} from "../lib/api/cplBkmkApi";
import { cplProdiAll } from "../lib/api/cplProdiApi";
import { bahanKajianKelulusanGetAll } from "../lib/api/bahanKajianApi";
import { mataKuliahAll } from "../lib/api/mataKuliahApi";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import { useAuth } from "../auth/AuthContext";

export default function CPLBKMK() {
    const { authToken } = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [cplOptions, setCplOptions] = useState([]);
    const [bkOptions, setBkOptions] = useState([]);
    const [mkOptions, setMkOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = async () => {
        const res = await cplBkMkGetAll({
            token: authToken,
            page,
            size,
        });
        const body = await res.json();

        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.kodeCPL}-${item.kodeBK}-${item.idmk}-${index}`,
                ...item,
            }));
            setData(mapped);
            setTotalItems(body.total || mapped.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data CPL-BK-MK");
        }
    };

    const fetchOptions = async () => {
        const [cplRes, bkRes, mkRes] = await Promise.all([
            cplProdiAll({ token: authToken, page: 1, size: 100 }),
            bahanKajianKelulusanGetAll(authToken),
            mataKuliahAll(authToken),
        ]);

        const cplBody = await cplRes.json();
        const bkBody = await bkRes.json();
        const mkBody = await mkRes.json();

        if (cplRes.ok && bkRes.ok && mkRes.ok) {
            setCplOptions(
                (cplBody.data || []).map((item) => ({
                    value: item.kodeCPL,
                    label: `${item.kodeCPL} - ${item.deskripsiCPL}`,
                }))
            );

            setBkOptions(
                (bkBody.data || []).map((item) => ({
                    value: item.kodeBK,
                    label: `${item.kodeBK} - ${item.namaBahanKajian}`,
                }))
            );

            setMkOptions(
                (mkBody.data || []).map((item) => ({
                    value: item.idmk,
                    label: `${item.idmk} - ${item.namaMk}`,
                }))
            );
        } else {
            alertFailed("Gagal memuat opsi CPL, BK, atau MK");
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

        const res = await cplBkMkDelete({
            token: authToken,
            kodeCPL: row.kodeCPL,
            kodeBK: row.kodeBK,
            idmk: row.idmk,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-BK-MK berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus relasi");
        }
    };

    const handleSubmit = async (formData) => {
        const res = await cplBkMkCreate({
            token: authToken,
            kodeCPL: formData.kodeCPL,
            kodeBK: formData.kodeBK,
            idmk: formData.idmk,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-BK-MK berhasil ditambahkan");
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
        { key: "kodeCPL", label: "Kode CPL" },
        { key: "kodeBK", label: "Kode BK" },
        { key: "idmk", label: "Kode Mata Kuliah" },
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
            name: "kodeBK",
            label: "Bahan Kajian",
            type: "select",
            required: true,
            options: bkOptions,
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
                title="Relasi CPL - BK - Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={handleAdd}
                onDelete={handleDelete}
                searchPlaceholder="Cari CPL / BK / MK..."
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
