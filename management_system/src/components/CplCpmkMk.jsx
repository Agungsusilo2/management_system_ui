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
import ChatAssistant from "./ChatAssistant.jsx";
import {bahanKajianCreate} from "../lib/api/bahanKajianApi.js";

export default function CplCpmkMk() {
    const { authToken,user} = useAuth();

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [cplOptions, setCplOptions] = useState([]);
    const [cpmkOptions, setCpmkOptions] = useState([]);
    const [mkOptions, setMkOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type ==="Admin"
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
                deskripsiCPL:item.cplProdi.deskripsiCPL,
                namaCPMK:item.cpmk.namaCPMK,
                subCPMKId:item.cpmk.subCPMKId,
                namaMk:item.mataKuliah.namaMk
            }));

            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data CPL-CPMK-MK");
        }
    };

    const fetchOptions = async () => {
        const [cplRes, cpmkRes, mkRes] = await Promise.all([
            cplProdiAll({ token: authToken, page: 1, size: 100 }),
            cpmkGetAll({ token: authToken, page: 1, size: 100 }),
            mataKuliahAll({token:authToken,page:1,size:100}),
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
            label: "Kode CPL Prodi",
        },
        {
            key: "deskripsiCPL",
            label: "Deskripsi CPL Prodi",
        },
        {
            key: "kodeCPMK",
            label: "Kode CPMK",
        },
        {
            key: "namaCPMK",
            label: "Nama CPMK",
        },
        {
            key: "subCPMKId",
            label: "Kode Sub CPMK",
        },
        {
            key: "idmk",
            label: "Kode Mata Kuliah",
        },
        {
            key: "namaMk",
            label: "Nama Mata Kuliah",
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

    const handleAIResponse = async (result)=>{
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }
        for (const item of result.items) {
            const payload = {
                token:authToken,
                kodeCPL: item.kodeCPL,
                kodeCPMK: item.kodeCPMK,
                idmk: item.idmk,
            };

            try {
                const res = await cplCpmkMkCreate({
                    token:payload.token,
                    kodeCPL:payload.kodeCPL,
                    kodeCPMK:payload.kodeCPMK,
                    idmk:payload.idmk
                });
                const body = await res.json();

                if (!res.ok) {
                    console.error("Gagal:", body);
                    await alertFailed(`❌ Gagal menambahkan: ${payload.namaBahanKajian}`);
                }
            } catch (err) {
                console.error(err);
            }
        }

        await alertSuccess("✅ Semua data berhasil ditambahkan!");
        await fetchData();
    }


    return (
        <>
            {isAdmin?
                <ChatAssistant
                    fields={["kodeCPL", "kodeCPMK", "idmk"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }
            <DataTable
                title="Relasi CPL - CPMK - MK"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onDelete={isAdmin ? handleDelete: undefined}
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

            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    onClick={handlePrev}
                    disabled={page <= 1}
                    className={`btn btn-secondary px-4 py-2 rounded-md text-white ${
                        page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    ← Prev
                </button>

                <span className="text-gray-700 font-medium">Halaman {page}</span>

                <button
                    onClick={handleNext}
                    disabled={page >= Math.ceil(totalItems / size)}
                    className={`btn btn-primary px-4 py-2 rounded-md text-white ${
                        page >= Math.ceil(totalItems / size)
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    Next →
                </button>
            </div>
        </>
    );
}
