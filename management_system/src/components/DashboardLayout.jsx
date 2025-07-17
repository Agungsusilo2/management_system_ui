import { Link, Outlet, useLocation } from "react-router";

const dataMaster = [
    { label: "Profile Kelulusan", path: "/dashboard/profil-kelulusan" },
    { label: "Profesi", path: "/dashboard/profesi" },
    { label: "Aspek", path: "/dashboard/aspeks" },
    { label: "Referensi", path: "/dashboard/referensi" },
    { label: "Bahan Kajian", path: "/dashboard/bahan-kajian" },
    { label: "Mata Kuliah", path: "/dashboard/mata-kuliah" },
    { label: "SUB CPMK", path: "/dashboard/sub-cpmk" },
    { label: "BK MK", path: "/dashboard/bk-mk" },
    { label: "CPMK", path: "/dashboard/cpmk" },
    { label: "CPL Prodi", path: "/dashboard/cpl-prodi" },
    { label: "CPL PL", path: "/dashboard/cpl-pl" },
    { label: "CPL BK", path: "/dashboard/cpl-bk" },
    { label: "CPL MK", path: "/dashboard/cpl-mk" },
    { label: "CPL BK MK", path: "/dashboard/cpl-bkmk" },
    { label: "MK CPMK SUB-CPMK", path: "/dashboard/mk-cpmk-sub-cpmk" },
    { label: "CPL CPMK MK", path: "/dashboard/cpl-cpmk-mk" },
];

export default function DashboardLayout() {
    const location = useLocation();

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

            {/* Content Area */}
            <div className="d-flex flex-grow-1">
                {/* Sidebar */}
                <aside className="bg-light border-end p-3 d-none d-lg-block" style={{ width: "250px" }}>
                    <h6 className="text-muted fw-bold text-uppercase mb-3">Master Data</h6>
                    <ul className="nav nav-pills flex-column">
                        {dataMaster.map(({ label, path }, index) => (
                            <li className="nav-item mb-1" key={index}>
                                <Link
                                    to={path}
                                    className={`nav-link ${location.pathname === path ? "active" : "text-dark"}`}
                                >
                                    {label}
                                </Link>
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
