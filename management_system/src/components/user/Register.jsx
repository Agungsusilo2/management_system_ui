import {Link, useNavigate} from "react-router";
import { useState} from "react";
import {alertFailed, alertSuccess} from "../../lib/alert.js";
import {userRegister} from "../../lib/api/userApi.js";

export default function Register() {
    const [username,setUsername] = useState("")
    const [full_name,setFullName] = useState("")
    const [email,setEmail] = useState("")
    const [password_hash,setPassword] = useState("")
    const [tryPassword,setTryPassword] = useState("")
    const [user_type,setUserType] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if(password_hash !== tryPassword){
            await alertFailed("password don't match")
            return
        }

        const response = await userRegister(
            {
                username,
                full_name,
                email,
                password_hash,
                user_type
            }
        )

        const responseBody = await response.json()

        if(response.status === 200){
            await alertSuccess("User created Successfully")
            navigate({
                pathname:"/login"
            })
        }else{
            await alertFailed(responseBody.errors)
        }
    }

    return (
        <>
            <div className={"container"}>
                <div className={"row justify-content-center"}>
                    <div className={"col-md-8 col-lg-6"}>
                        <div className={"bg-light rounded p-5"}>
                            <div className={"card border-0 shadow-lg"}>
                                <div className={"card-header bg-primary text-white text-center py-4"}>
                                    <h2>Daftar Akun</h2>
                                </div>
                            </div>
                            <div className={"card-body py-4"}>
                                <form onSubmit={handleSubmit}>
                                    <div className={"row g-3"}>
                                        <div className={"col-md-6"}>
                                            <label htmlFor={"username"} className={"form-label"}>Username</label>
                                            <input id={"username"} type={"text"}
                                                   className={"form-control form-control-lg"} required value={username}
                                                   onChange={(e) => setUsername(e.target.value)}/>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <label htmlFor={"full_name"} className={"form-label"}>Full Name</label>
                                            <input id={"full_name"} type={"text"}
                                                   className={"form-control form-control-lg"} required value={full_name}
                                                   onChange={(e) => setFullName(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className={"mt-3 mb-3"}>
                                        <label htmlFor={"email"} className={"form-label"}>Email</label>
                                        <input id={"email"} type={"email"} className={"form-control form-control-lg"}
                                               required value={email} onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div className={"mt-3 mb-3"}>
                                        <label htmlFor={"password"} className={"form-label"}>Password</label>
                                        <input id={"password"} type={"password"}
                                               className={"form-control form-control-lg"}
                                               required value={password_hash}
                                               onChange={(e) => setPassword(e.target.value)}/>
                                        <div className={"form-text"}>Minimal 8 karakter dengan kombinasi huruf dan
                                            angka
                                        </div>
                                    </div>
                                    <div className={"mt-3 mb-3"}>
                                        <label htmlFor={"try_password"} className={"form-label"}>Try Password</label>
                                        <input id={"try_password"} type={"password"}
                                               className={"form-control form-control-lg"}
                                               required value={tryPassword}
                                               onChange={(e) => setTryPassword(e.target.value)}/>
                                    </div>
                                    <div className={"mt-3 mb-3"}>
                                        <label htmlFor={"user_type"} className={"form-label"}>User Type</label>
                                        <select
                                            id={"user_type"}
                                            className={"form-select"}
                                            name={"user_type"}
                                            value={user_type}
                                            onChange={(e) => setUserType(e.target.value)}
                                        >
                                            <option value="" disabled>Pilih Tipe Pengguna</option>
                                            <option value={"Admin"}>Admin</option>
                                            <option value={"Dosen"}>Dosen</option>
                                            <option value={"Mahasiswa"}>Mahasiswa</option>
                                        </select>
                                    </div>
                                    <button type={"submit"} className={"btn btn-primary btn-lg w-100 mb-3"}>
                                        Daftar Sekarang
                                    </button>
                                </form>
                                <div className={"text-center mt-4"}>
                                    <p>
                                        Sudah punya akun ?{" "}
                                        <Link to={"/login"} className={"text-primary text-decoration-none fw-bold"}>
                                            Masuk disini
                                        </Link>
                                    </p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}