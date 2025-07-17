export const cplBkCreate = async ({ token, kodeCPL, kodeBK }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-bk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodeBK,
        })
    });
};


export const cplBkDelete = async ({token,kodeCPL,kodeBK})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-bk`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodeBK,
        })
    });
}


export const cplBkGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-bk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

