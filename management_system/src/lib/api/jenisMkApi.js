
export const jenisMkAll = async ({ token, page, size }) => {
     return await fetch(`${import.meta.env.VITE_API_PATH}/jenis-mk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const jenisMkAdd = async ({ token, namaJenisMk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/jenis-mk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaJenisMk
        })
    });
};

export const jenisMkUpdate = async ({ token, idJenisMk, namaJenisMk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/jenis-mk/${idJenisMk}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaJenisMk,
        }),
    });
};

export const jenisMkDelete = async ({ token, idJenisMk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/jenis-mk/${idJenisMk}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};