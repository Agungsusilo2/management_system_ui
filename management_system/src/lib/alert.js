import Swal from "sweetalert2";

export const alertSuccess = async (message) =>{
    return Swal.fire({
        title:"Success",
        icon:"success",
        text:message
    })
}

export const alertFailed = async (message)=>{
    return Swal.fire({
        title:"Ups",
        icon:"error",
        text:message
    })
}

export const alertConfirm = async (message) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        icon: "question",
        text: message,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    });

    return result.isConfirmed;
};
