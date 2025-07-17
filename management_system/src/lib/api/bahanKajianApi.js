export const bahanKajianCreate = async ({ token, kodeBK, namaBahanKajian, kodeReferensi }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/bahan-kajian`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            kodeBK,
            namaBahanKajian,
            kodeReferensi
        })
    });
};



export const bahanKajianKelulusanUpdate = async ({token,kodeBK, namaBahanKajian,kodeReferensi})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/bahan-kajian/${kodeBK}`,{
        method:"PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type":"application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify({
            namaBahanKajian,
            kodeReferensi
        })
    })
}



export const bahanKajianKelulusanDelete = async ({token,kodeBK})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/bahan-kajian/${kodeBK}`,{
        method:"delete",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}


export const bahanKajianKelulusanGetPageAll = async ({token,page,size})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/bahan-kajian?page=${page}&size=${size}`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        }
    })
}


export const bahanKajianKelulusanGetAll = async (token)=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/bahan-kajian`,{
        method:"GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    })
}