export const metodePembelajaranAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/metode-pembelajaran?page=${page}&size=${size}`
        , {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const metodePembelajaranAdd = async ({ token, namaMetodePembelajaran }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/metode-pembelajaran`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaMetodePembelajaran
        })
    });
};

export const metodePembelajaranUpdate = async ({ token, idMetodePembelajaran, namaMetodePembelajaran }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/metode-pembelajaran/${idMetodePembelajaran}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaMetodePembelajaran,
        }),
    });
};

export const metodePembelajaranDelete = async ({ token, idMetodePembelajaran }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/metode-pembelajaran/${idMetodePembelajaran}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};
