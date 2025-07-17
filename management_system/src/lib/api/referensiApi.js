export const referensiAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/referensi?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const referensiAdd = async ({ token, kodeReferensi, namaReferensi }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/referensi`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeReferensi,
            namaReferensi,
        }),
    });
};

export const referensiUpdate = async ({ token, kodeReferensi, namaReferensi }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/referensi/${kodeReferensi}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaReferensi,
        }),
    });
};

export const referensiDelete = async ({ token, kodeReferensi }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/referensi/${kodeReferensi}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};
