export const bkMkCreate = async ({ token, kodeBK, idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/bkmk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeBK,
            idmk,
        })
    });
};


export const bkMkDelete = async ({token,kodeBK,idmk})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/bkmk`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeBK,
            idmk,
        })
    });
}


export const bkMkGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/bkmk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

