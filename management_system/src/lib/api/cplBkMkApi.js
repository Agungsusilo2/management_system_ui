export const cplBkMkCreate = async ({ token, kodeCPL, kodeBK,idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-bkmk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodeBK,
            idmk
        })
    });
};


export const cplBkMkDelete = async ({token,kodeCPL,kodeBK,idmk})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-bkmk`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodeBK,
            idmk
        })
    });
}


export const cplBkMkGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-bkmk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

