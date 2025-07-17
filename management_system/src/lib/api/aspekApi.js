export const aspekAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/aspeks?page=${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    })
}

export const aspekAdd = async ({token,kodeAspek,namaAspek})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/aspeks`,{
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            kodeAspek,
            namaAspek
        })
    })
}

export const aspekUpdate = async ({ token, kodeAspek, namaAspek }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/aspeks/${kodeAspek}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            namaAspek,
        }),
    });
};


export const aspekDelete = async ({ token, kodeAspek }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/aspeks/${kodeAspek}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};



