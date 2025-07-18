import { Link, Outlet, useLocation } from "react-router";
import { useState } from "react";

const menuGroups = [
    {
        group: "Profile Kelulusan",
        items: [
            { label: "Profile Kelulusan", path: "/dashboard/profil-kelulusan" },
            { label: "Profesi", path: "/dashboard/profesi" },
        ],
    },
    {
        group: "Bahan Kajian",
        items: [
            { label: "Bahan Kajian", path: "/dashboard/bahan-kajian" },
            { label: "Referensi", path: "/dashboard/referensi" },
        ],
    },
    {
        group: "CPMK",
        items: [
            { label: "CPMK", path: "/dashboard/cpmk" },
            { label: "SUB CPMK", path: "/dashboard/sub-cpmk" },
        ],
    },
    {
        group: "CPL Prodi",
        items: [
            { label: "CPL Prodi", path: "/dashboard/cpl-prodi" },
            { label: "Aspek", path: "/dashboard/aspeks" },
        ],
    },
    {
        group: "Mata Kuliah",
        items: [
            { label: "Mata Kuliah", path: "/dashboard/mata-kuliah" },
        ],
    },
    {
        group: "Lainnya",
        items: [
            { label: "BK MK", path: "/dashboard/bk-mk" },
            { label: "CPL PL", path: "/dashboard/cpl-pl" },
            { label: "CPL BK", path: "/dashboard/cpl-bk" },
            { label: "CPL MK", path: "/dashboard/cpl-mk" },
            { label: "CPL BK MK", path: "/dashboard/cpl-bkmk" },
            { label: "CPL CPMK MK", path: "/dashboard/cpl-cpmk-mk" },
            { label: "MK CPMK SUB-CPMK", path: "/dashboard/mk-cpmk-sub-cpmk" },
        ],
    },
];

export default function DashboardLayout() {
    const location = useLocation();
    const [expandedGroup, setExpandedGroup] = useState(null);

    const toggleGroup = (groupName) => {
        setExpandedGroup(expandedGroup === groupName ? null : groupName);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold" to="/dashboard/home">
                        🎓 Dashboard OBE
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/profile-user">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-warning" to="/dashboard/logout">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="d-flex flex-grow-1">
                <aside className="bg-light border-end p-3 d-none d-lg-block" style={{ width: "250px" }}>
                    <h6 className="text-muted fw-bold text-uppercase mb-3">Master Data</h6>
                    <ul className="nav nav-pills flex-column">
                        {menuGroups.map((group, idx) => (
                            <li className="nav-item mb-2" key={idx}>
                                <button
                                    className="btn btn-sm btn-toggle align-items-center fw-semibold text-start w-100 icon-link-hover"
                                    onClick={() => toggleGroup(group.group)}
                                >
                                    {group.group}
                                </button>
                                {expandedGroup === group.group && (
                                    <ul className="nav flex-column ms-3 mt-1">
                                        {group.items.map(({ label, path }, i) => (
                                            <li className="nav-item" key={i}>
                                                <Link
                                                    to={path}
                                                    className={`nav-link px-2 py-1 ${location.pathname === path ? "active" : "text-dark"}`}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="flex-grow-1 p-4 bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
