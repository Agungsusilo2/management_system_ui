export const mataKuliahAll = async ({ token, page, size }) => {

    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const mataKuliahAdd = async ({ token, idmk, namaMk, kodeSemester, jenisMKId, kelompokMKId, lingkupKelasId, modeKuliahId, metodePembelajaranId }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            idmk,
            namaMk,
            kodeSemester,
            jenisMKId,
            kelompokMKId,
            lingkupKelasId,
            modeKuliahId,
            metodePembelajaranId
        })
    });
};

export const mataKuliahUpdate = async ({ token, idmk, namaMk, kodeSemester, jenisMKId, kelompokMKId, lingkupKelasId, modeKuliahId, metodePembelajaranId }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah/${idmk}`, { // Ensure /api prefix
        method: "PATCH", // PATCH is correct for partial updates
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaMk,
            kodeSemester,
            jenisMKId,
            kelompokMKId,
            lingkupKelasId,
            modeKuliahId,
            metodePembelajaranId
        }),
    });
};

export const mataKuliahDelete = async ({ token, idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah/${idmk}`, { // Ensure /api prefix
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}