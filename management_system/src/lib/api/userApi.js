export const userRegister = async ({username,full_name,email,password_hash,user_type})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/users`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify(
            {
                username,
                password_hash,
                email,
                full_name,
                user_type
            }
        )
    })
}

export const userLogin = async ({username,password_hash})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify(
            {
                username,
                password_hash
            }
        )
    })
}

export const userDetail = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/current`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};



export const userLogout = async (token) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/current`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const userUpdatePassword = async ({token,password_hash})=>{
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/current`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json",
            "X-API-KEY": token,
        },
        body:JSON.stringify(
            {
                password_hash
            }
        )
    })
}
