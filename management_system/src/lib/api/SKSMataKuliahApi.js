export const sksMataKuliahAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/sks-mata-kuliah?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const sksMataKuliahAdd = async ({ token, bobotTatapMuka, bobotPraktikum, bobotPraktekLapangan, bobotSimulasi, idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/sks-mata-kuliah`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            bobotTatapMuka,
            bobotPraktikum,
            bobotPraktekLapangan,
            bobotSimulasi,
            idmk
        })
    });
};

export const sksMataKuliahUpdate = async ({ token, kodeSKS, bobotTatapMuka, bobotPraktikum, bobotPraktekLapangan, bobotSimulasi, idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/sks-mata-kuliah/${kodeSKS}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            bobotTatapMuka,
            bobotPraktikum,
            bobotPraktekLapangan,
            bobotSimulasi,
            idmk // IDMK hanya bisa di-update jika memang ada logika bisnis yang mengizinkan perubahan relasi 1-ke-1
        }),
    });
};

export const sksMataKuliahDelete = async ({ token, kodeSKS }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/api/sks-mata-kuliah/${kodeSKS}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};
