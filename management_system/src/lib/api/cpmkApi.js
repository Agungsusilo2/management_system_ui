export const cpmkCreate = async ({ token, kodeCPMK, namaCPMK, subCPMKId }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpmks`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeCPMK,
            namaCPMK,
            subCPMKId
        })
    });
};



export const cpmkUpdate = async ({token,kodeCPMK, namaCPMK,subCPMKId})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpmks/${kodeCPMK}`,{
        method:"PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type":"application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            namaCPMK,
            subCPMKId
        })
    })
}



export const cpmkDelete = async ({token,kodeCPMK})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpmks/${kodeCPMK}`,{
        method:"DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}


export const cpmkGetAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpmks?page=${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}
