export const cplPlCreate = async ({ token, kodeCPL, kodePL }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-pl`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodePL,
        })
    });
};


export const cplPlDelete = async ({token,kodeCPL,kodePL})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-pl`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodePL,
        })
    });
}


export const cplPlGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-pl?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

