export const semesterAll = async ({ token, page, size }) => {

    return await fetch(`${import.meta.env.VITE_API_PATH}/semester?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};

export const semesterAdd = async ({ token, semesterInt }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/semester`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            semesterInt
        })
    });
};

export const semesterUpdate = async ({ token, kodeSemester, semesterInt }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/semester/${kodeSemester}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": token,
        },
        body: JSON.stringify({
            semesterInt,
        }),
    });
};

export const semesterDelete = async ({ token, kodeSemester }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/semester/${kodeSemester}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-API-KEY": token,
        },
    });
};
