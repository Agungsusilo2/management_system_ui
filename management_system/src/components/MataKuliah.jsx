import { useEffect, useState } from "react";
import {
    mataKuliahAll,
    mataKuliahAdd,
    mataKuliahUpdate,
    mataKuliahDelete,
} from "../lib/api/mataKuliahApi.js";

import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert.js";

import DataTable from "../components/Table.jsx";
import ModalForm from "../components/ModelForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import ChatAssistant from "./ChatAssistant.jsx";

// Import all API for dropdown options
import { semesterAll } from "../lib/api/semesterApi.js";
import { jenisMkAll } from "../lib/api/jenisMkApi.js";
import { kelompokMkAll } from "../lib/api/kelompokApi.js";
import { lingkupKelasAll } from "../lib/api/lingkupKelasApi.js";
import { modeKuliahAll } from "../lib/api/modeKuliah.js";

export default function MataKuliah() {
    const { authToken, user } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [semesterOption, setSemesterOption] = useState([]);
    const [jenisMKOption, setJenisMKOption] = useState([]);
    const [kelompokMKOption, setKelompokOption] = useState([]);
    const [lingkupKelasOption, setLingkupKelasOption] = useState([]);
    const [modeKuliahOption, setModeKuliahOption] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user.user_type === "Admin";

    const fetchData = async () => {
        const res = await mataKuliahAll({ token: authToken, page: page, size: size });
        const body = await res.json();

        console.log("Data fetched from API:", body);

        if (res.ok) {
            const mapped = body.data.map((item) => ({
                id: item.idmk,
                nama: item.namaMk,
                semester: item.semesterInt,
                jenis: item.jenisMkNama,
                kelompok: item.kelompokMkNama,
                lingkup: item.lingkupKelasNama,
                mode: item.modeKuliahNama,
            }));
            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            await alertFailed(body.errors || "Gagal mengambil data");
        }
    };

    const fetchOptions = async () => {
        try {
            const [
                resSms,
                resJenis,
                resKelompok,
                resLingkup,
                resModeKuliah,
            ] = await Promise.all([
                semesterAll({ token: authToken, page: 1, size: 100 }),
                jenisMkAll({ token: authToken, page: 1, size: 100 }),
                kelompokMkAll({ token: authToken, page: 1, size: 100 }),
                lingkupKelasAll({ token: authToken, page: 1, size: 100 }),
                modeKuliahAll({ token: authToken, page: 1, size: 100 }),
            ]);

            const [
                bodySms,
                bodyJenis,
                bodyKelompok,
                bodyLingkup,
                bodyModeKuliah,
            ] = await Promise.all([
                resSms.json(),
                resJenis.json(),
                resKelompok.json(),
                resLingkup.json(),
                resModeKuliah.json(),
            ]);

            if (!resSms.ok || !resJenis.ok || !resKelompok.ok || !resLingkup.ok || !resModeKuliah.ok) {
                await alertFailed("❌ Salah satu permintaan opsi gagal. Pastikan API dan Token benar.");
                return;
            }

            setSemesterOption((bodySms.data || []).map(item => ({
                label: `${item.kodeSemester} - ${item.semesterInt}`,
                value: item.kodeSemester
            })));

            setJenisMKOption((bodyJenis.data || []).map(item => ({
                label: `${item.namaJenisMk}`,
                value: item.idJenisMk
            })));

            setKelompokOption((bodyKelompok.data || []).map(item => ({
                label: `${item.namaKelompokMk}`,
                value: item.idKelompokMk
            })));

            setLingkupKelasOption((bodyLingkup.data || []).map(item => ({
                label: `${item.namaLingkupKelas}`,
                value: item.idLingkupKelas
            })));

            setModeKuliahOption((bodyModeKuliah.data || []).map(item => ({
                label: `${item.namaModeKuliah}`,
                value: item.idModeKuliah
            })));

        } catch (error) {
            console.error("Error fetching options:", error);
            await alertFailed("Terjadi kesalahan saat mengambil opsi dropdown.");
        }
    };

    useEffect(() => {
        fetchData();
        fetchOptions();
    }, [page, authToken]);

    const prevHandle = () => {
        if (page > 1) setPage(page - 1);
    };

    const nextHandle = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage(page + 1);
    };

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    const handleEdit = (row) => {
        setSelectedRow({
            id: row.id,
            nama: row.nama,
            semester: row.semester || '',
            jenis: row.jenis || '',
            kelompok: row.kelompok || '',
            lingkup: row.lingkup || '',
            mode: row.mode || '',
        });
        setModalVisible(true);
    };

    const handleDelete = async (row) => {
        const confirm = await alertConfirm("Yakin ingin menghapus data?");
        if (!confirm) return;

        const res = await mataKuliahDelete({ token: authToken, idmk: row.id });
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
            idmk: selectedRow ? selectedRow.id : formData.id,
            namaMk: formData.nama,
            kodeSemester: formData.semester === "" ? null : formData.semester,
            jenisMKId: formData.jenis === "" ? null : formData.jenis,
            kelompokMKId: formData.kelompok === "" ? null : formData.kelompok,
            lingkupKelasId: formData.lingkup === "" ? null : formData.lingkup,
            modeKuliahId: formData.mode === "" ? null : formData.mode,
        };

        console.log("Payload to API:", payload);

        let res;
        if (selectedRow) {
            res = await mataKuliahUpdate(payload);
        } else {
            res = await mataKuliahAdd(payload);
        }

        const body = await res.json();
        console.log("API Response:", body);
        if (res.ok) {
            await alertSuccess("Data berhasil disimpan");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Gagal menyimpan data");
        }
    };

    const columns = [
        { key: "id", label: "ID Mata Kuliah" },
        { key: "nama", label: "Nama Mata Kuliah" },
        { key: "semester", label: "Semester" },
        { key: "jenis", label: "Jenis MK" },
        { key: "kelompok", label: "Kelompok MK" },
        { key: "lingkup", label: "Lingkup Kelas" },
        { key: "mode", label: "Mode Kuliah" },
    ];

    const formFields = [
        {
            name: "id",
            label: "ID Mata Kuliah",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "nama",
            label: "Nama Mata Kuliah",
            type: "text",
            required: true,
        },
        {
            name: "semester",
            label: "Semester",
            type: "select",
            options: semesterOption,
            required: false,
        },
        {
            name: "jenis",
            label: "Jenis MK",
            type: "select",
            options: jenisMKOption,
            required: false,
        },
        {
            name: "kelompok",
            label: "Kelompok MK",
            type: "select",
            options: kelompokMKOption,
            required: false,
        },
        {
            name: "lingkup",
            label: "Lingkup Kelas",
            type: "select",
            options: lingkupKelasOption,
            required: false,
        },
        {
            name: "mode",
            label: "Mode Kuliah",
            type: "select",
            options: modeKuliahOption,
            required: false,
        },
    ];

    const handleAIResponse = async (result) => {
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ Format AI tidak sesuai. Harus ada `action: add` dan `items[]`.");
            return;
        }
        for (const item of result.items) {
            const payload = {
                token: authToken,
                idmk: item.idmk,
                namaMk: item.namaMk,
                kodeSemester: item.kodeSemester === "" ? null : item.kodeSemester,
                jenisMKId: item.jenisMKId === "" ? null : item.jenisMKId,
                kelompokMKId: item.kelompokMKId === "" ? null : item.kelompokMKId,
                lingkupKelasId: item.lingkupKelasId === "" ? null : item.lingkupKelasId,
                modeKuliahId: item.modeKuliahId === "" ? null : item.modeKuliahId,
            };

            try {
                const res = await mataKuliahAdd(payload);
                const body = await res.json();

                if (!res.ok) {
                    console.error("Gagal:", body);
                    await alertFailed(`❌ Gagal menambahkan: ${payload.namaMk} - ${body.errors || 'Unknown error'}`);
                }
            } catch (err) {
                console.error(err);
                await alertFailed(`❌ Error saat koneksi: ${err.message}`);
            }
        }

        await alertSuccess("✅ Semua data berhasil ditambahkan!");
        fetchData();
    };

    return (
        <>
            {isAdmin && (
                <ChatAssistant
                    fields={[
                        "idmk", "namaMk", "kodeSemester", "jenisMKId",
                        "kelompokMKId", "lingkupKelasId", "modeKuliahId"
                    ]}
                    onAIResponse={handleAIResponse}
                />
            )}

            <DataTable
                title="Daftar Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd : undefined}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                searchPlaceholder="Cari mata kuliah..."
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
                    onClick={prevHandle}
                    disabled={page <= 1}
                    className={`btn btn-secondary px-4 py-2 rounded-md text-white ${
                        page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    ← Prev
                </button>

                <span className="text-gray-700 font-medium">Halaman {page}</span>

                <button
                    onClick={nextHandle}
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
