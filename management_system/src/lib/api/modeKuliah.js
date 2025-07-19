export const modeKuliahAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mode-kuliah?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const modeKuliahAdd = async ({ token, namaModeKuliah }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mode-kuliah`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaModeKuliah
        })
    });
};

export const modeKuliahUpdate = async ({ token, idModeKuliah, namaModeKuliah }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mode-kuliah/${idModeKuliah}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaModeKuliah,
        }),
    });
};

export const modeKuliahDelete = async ({ token, idModeKuliah }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mode-kuliah/${idModeKuliah}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};