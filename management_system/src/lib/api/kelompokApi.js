export const kelompokMkAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/kelompok-mk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const kelompokMkAdd = async ({ token, namaKelompokMk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/kelompok-mk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaKelompokMk
        })
    });
};

export const kelompokMkUpdate = async ({ token, idKelompokMk, namaKelompokMk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/kelompok-mk/${idKelompokMk}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaKelompokMk,
        }),
    });
};

export const kelompokMkDelete = async ({ token, idKelompokMk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/kelompok-mk/${idKelompokMk}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};
