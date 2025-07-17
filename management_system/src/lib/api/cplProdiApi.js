export const cplProdiAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-prodi?page=${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    })
}

export const cplProdiAdd = async ({token,kodeCPL,deskripsiCPL,kodeAspek})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-prodi`,{
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            kodeCPL,
            deskripsiCPL,
            kodeAspek
        })
    })
}

export const cplProdiUpdate = async ({ token, kodeCPL, deskripsiCPL,kodeAspek }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-prodi/${kodeCPL}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            deskripsiCPL,
            kodeAspek
        }),
    });
};


export const cplProdiDelete = async ({ token, kodeCPL }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/cpl-prodi/${kodeCPL}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};



