export const subCPMKAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/sub-cpmk?page=${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    })
}

export const subCPMKAdd = async ({token,subCPMKId,uraianSubCPMK})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/sub-cpmk`,{
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            subCPMKId,
            uraianSubCPMK
        })
    })
}

export const subCPMKUpdate = async ({ token, subCPMKId, uraianSubCPMK }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/sub-cpmk/${subCPMKId}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            uraianSubCPMK,
        }),
    });
};


export const subCPMKDelete = async ({ token, subCPMKId }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/sub-cpmk/${subCPMKId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};




