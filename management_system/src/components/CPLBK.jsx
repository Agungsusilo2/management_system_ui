import { useEffect, useState } from "react";
import {
    cplBkCreate,
    cplBkDelete,
    cplBkGetAll,
} from "../lib/api/cplBkApi";
import { cplProdiAll } from "../lib/api/cplProdiApi";
import {bahanKajianKelulusanGetAll} from "../lib/api/bahanKajianApi";
import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert";
import DataTable from "../components/Table";
import ModalForm from "../components/ModelForm";
import { useAuth } from "../auth/AuthContext";
import ChatAssistant from "./ChatAssistant.jsx";

export default function CPLBK() {
    const { authToken,user} = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [cplOptions, setCplOptions] = useState([]);
    const [bkOptions, setBkOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin"
    const fetchData = async () => {
        const res = await cplBkGetAll({ token: authToken, page, size });
        const body = await res.json();

        if (res.ok) {
            const mapped = (body.data || []).map((item, index) => ({
                id: `${item.kodeCPL}-${item.kodeBK}-${index}`,
                ...item,
                deskripsiCPL:item.cplProdi.deskripsiCPL,
                namaBahanKajian:item.bahanKajian.namaBahanKajian,
                kodeReferensi:item.bahanKajian.kodeReferensi
            }));

            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            alertFailed(body.errors || "Gagal mengambil data CPL-BK");
        }
    };

    const fetchOptions = async () => {
        const [cplRes, bkRes] = await Promise.all([
            cplProdiAll({ token: authToken, page: 1, size: 100 }),
            bahanKajianKelulusanGetAll({token:authToken,page:1,size:100}),
        ]);

        const cplBody = await cplRes.json();
        const bkBody = await bkRes.json();

        if (cplRes.ok && bkRes.ok) {
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
        } else {
            alertFailed("Gagal memuat opsi CPL/BK");
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
        const confirm = await alertConfirm("Yakin ingin menghapus relasi CPL-BK ini?");
        if (!confirm) return;

        const res = await cplBkDelete({
            token: authToken,
            kodeCPL: row.kodeCPL,
            kodeBK: row.kodeBK,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-BK berhasil dihapus");
            fetchData();
        } else {
            await alertFailed(body.errors || "Gagal menghapus relasi CPL-BK");
        }
    };

    const handleSubmit = async (formData) => {
        const res = await cplBkCreate({
            token: authToken,
            kodeCPL: formData.kodeCPL,
            kodeBK: formData.kodeBK,
        });

        const body = await res.json();

        if (res.ok) {
            await alertSuccess("Relasi CPL-BK berhasil ditambahkan");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menambahkan relasi CPL-BK");
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage(page + 1);
    };

    const handleAIResponse = async (result)=>{
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }
        console.log(result)
        for (const item of result.items) {
            const payload = {
                token:authToken,
                kodeCPL: item.kodeCPL,
                kodeBK: item.kodeBK,
            };

            try {
                const res = await cplBkCreate(payload);
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
        fetchData();
    }


    const columns = [
        { key: "kodeCPL", label: "Kode CPL" },
        { key: "deskripsiCPL", label: "Deskripsi CPL" },
        { key: "kodeBK", label: "Kode Bahan Kajian" },
        { key: "namaBahanKajian", label: "Nama Bahan Kajian" },
        { key: "kodeReferensi", label: "Kode Referensi" },
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
    ];

    return (
        <>
            {isAdmin?
                <ChatAssistant
                    fields={["kodeCPL", "kodeBK"]}
                    onAIResponse={handleAIResponse}
                />
                :undefined
            }

            <DataTable
                title="Relasi CPL - BK"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd: undefined}
                onDelete={isAdmin ? handleDelete: undefined}
                searchPlaceholder="Cari CPL atau BK..."
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
