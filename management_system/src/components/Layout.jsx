import {Outlet} from "react-router";

export default function Layout() {
    return (
        <>
            <div className={"d-flex justify-content-center align-items-center vh-100"}>
                <Outlet/>
            </div>
        </>
    )
}