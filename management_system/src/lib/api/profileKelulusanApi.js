export const profileKelulusanCreate = async ({ token, kodePL, deskripsi, kodeProfesi }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/profil-lulusan`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodePL,
            deskripsi,
            kodeProfesi
        })
    });
};



export const profileKelulusanUpdate = async ({token,kodePL, deskripsi,kodeProfesi})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profil-lulusan/${kodePL}`,{
        method:"PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type":"application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            deskripsi,
            kodeProfesi
        })
    })
}



export const profileKelulusanDelete = async ({token,kodePL})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profil-lulusan/${kodePL}`,{
        method:"DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}


export const profileKelulusanGetAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/profil-lulusan?page=${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}
