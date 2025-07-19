export const lingkupKelasAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/lingkup-kelas?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const lingkupKelasAdd = async ({ token, namaLingkupKelas }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/lingkup-kelas`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaLingkupKelas
        })
    });
};

export const lingkupKelasUpdate = async ({ token, idLingkupKelas, namaLingkupKelas }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/lingkup-kelas/${idLingkupKelas}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaLingkupKelas,
        }),
    });
};

export const lingkupKelasDelete = async ({ token, idLingkupKelas }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/lingkup-kelas/${idLingkupKelas}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};
