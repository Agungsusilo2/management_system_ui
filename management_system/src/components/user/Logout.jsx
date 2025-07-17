import {useEffectOnce, useLocalStorage} from "react-use";
import {useNavigate} from "react-router";
import {userLogout} from "../../lib/api/userApi.js";
import {useAuth} from "../../auth/AuthContext.jsx";
import {alertFailed} from "../../lib/alert.js";

export default function Logout() {
    const {authToken,logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = async ()=>{
        const response = await userLogout(authToken);

        const responseBody = await response.json()
        if(response.status === 200) {
            logout();
            await navigate({
                pathname: "/login"
            })
        }
    }

    useEffectOnce(()=>{
        handleLogout().then(()=>console.log("User logged out successsfully"))
    })

    return <></>
}