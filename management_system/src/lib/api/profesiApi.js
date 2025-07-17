export const profileAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profesi?page${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    })
}

export const profileAdd = async ({token,KodeProfesi,Profesi})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profesi`,{
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            KodeProfesi,
            Profesi
        })
    })
}

export const profileUpdate = async ({token,Profesi,KodeProfesi})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profesi/${KodeProfesi}`,{
        method:"patch",
        headers: {
            "Accept": "application/json",
            "Content-Type":"application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            Profesi
        })
    })
}


export const profileDelete = async ({token,KodeProfesi})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profesi/${KodeProfesi}`,{
        method:"delete",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}


