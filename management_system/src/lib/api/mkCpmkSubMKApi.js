export const mkCpmkSubMKCreate = async ({ token, idmk, kodeCPMK,subCPMKId }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/ml-cpmk-submk`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            idmk,
            kodeCPMK,
            subCPMKId
        })
    });
};


export const mkCpmkSubMKDelete = async ({token,idmk,kodeCPMK,subCPMKId})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/ml-cpmk-submk`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            idmk,
            kodeCPMK,
            subCPMKId
        })
    });
}


export const mkCpmkSubMKGetAll = async ({ token, page, size }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/ml-cpmk-submk?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    });
}

