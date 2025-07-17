import {useAuth} from "./AuthContext.jsx";
import {Navigate} from "react-router";
import { userDetail} from "../lib/api/userApi.js";
import {useEffect, useState} from "react";
import {useLocalStorage} from "react-use";

const PrivateRoute = ({children}) => {
    const [token,_] = useLocalStorage("token","")
    const {login,logout,isAuthenticated} = useAuth()
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await userDetail(token);
                const responseBody = await response.json()
                if (response.status === 200) {
                    login(token,responseBody.data)
                } else {
                    logout();
                }
            } catch (error) {
                logout();
            } finally {
                setChecking(false);
            }
        };

        checkUser();
    }, []);

    if (checking) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
