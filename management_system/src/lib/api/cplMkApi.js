export const cplMKCreate = async ({ token, kodeCPL, idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-mk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            idmk,
        })
    });
};


export const cplMkDelete = async ({token,kodeCPL,idmk})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-mk`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            idmk,
        })
    });
}


export const cplMkGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-mk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

