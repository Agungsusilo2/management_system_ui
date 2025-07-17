export const cplCpmkMkCreate = async ({ token, kodeCPL, kodeCPMK,idmk }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-cpmk-mk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodeCPMK,
            idmk
        })
    });
};


export const cplCpmkMkDelete = async ({token,kodeCPL,kodeCPMK,idmk})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-cpmk-mk`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPL,
            kodeCPMK,
            idmk
        })
    });
}


export const cplCpmkMkGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-cpmk-mk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

