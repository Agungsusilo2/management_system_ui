import {Link, useNavigate, useNavigation} from "react-router";
import {use, useState} from "react";
import {userLogin} from "../../lib/api/userApi.js";
import {alertFailed, alertSuccess} from "../../lib/alert.js";
import {useLocalStorage} from "react-use";
import {useAuth} from "../../auth/AuthContext.jsx";

export default function Login() {
    const [username,setUsername] = useState("")
    const [password_hash,setPassword] = useState("")

    const { login ,authToken} = useAuth();
    const [_, setToken] = useLocalStorage("token", "");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await userLogin({ username, password_hash });
        const responseBody = await response.json();

        if (response.status === 200) {
            const tokenFromApi = responseBody.data.token;
            setToken(tokenFromApi);
            login(tokenFromApi, responseBody.data);
            navigate("/dashboard/home");
        } else {
            await alertFailed(responseBody.errors);
        }
    }


    return(
        <>
            <div className={"container"}>
                <div className={"row justify-content-center"}>
                    <div className={"col-md-8 col-lg-6"}>
                        <div className={"bg-light rounded p-5"}>
                            <div className={"card border-0 shadow-lg"}>
                                <div className={"card-header bg-primary text-white text-center"}>
                                    <h2>Login</h2>
                                </div>
                                <div className={"card-body py-4"}>
                                    <form onSubmit={handleSubmit}>
                                        <div className={"mt-3 mb-3"}>
                                            <label htmlFor={"username"} className={"form-label"}>Username</label>
                                            <input id={"username"} type={"text"}
                                                   className={"form-control form-control-lg"} required value={username} onChange={(e)=>setUsername(e.target.value)}/>
                                        </div>
                                        <div className={"mt-3 mb-3"}>
                                            <label htmlFor={"password"} className={"form-label"}>Password</label>
                                            <input id={"password"} type={"password"}
                                                   className={"form-control form-control-lg"} required value={password_hash} onChange={(e)=>setPassword(e.target.value)}/>
                                        </div>
                                        <button type={"submit"} className={"btn btn-primary btn-lg w-100 mb-3"}>
                                            Login Sekarang
                                        </button>
                                    </form>
                                    <div className={"text-center mt-4"}>
                                        <p>
                                            Belum punya akun ?{" "}
                                            <Link to={"/register"} className={"text-primary text-decoration-none fw-bold"}>
                                                Masuk disini
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}