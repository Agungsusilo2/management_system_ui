export const mataKuliahAll = async (token)=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    })
}

export const mataKuliahAdd = async ({token,idmk,namaMk})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah`,{
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            idmk,
            namaMk
        })
    })
}

export const mataKuliahUpdate = async ({ token, idmk, namaMk }) => {
    try {
        return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah/${idmk}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-API-KEY": token,
            },
            body: JSON.stringify({ namaMk }),
        });
    } catch (err) {
        console.error("Update error:", err);
        throw err;
    }
};


export const mataKuliahDelete = async ({token,idmk})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/mata-kuliah/${idmk}`,{
        method:"delete",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}


