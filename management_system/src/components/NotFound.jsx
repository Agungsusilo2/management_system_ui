import { Link } from "react-router";

export default function NotFound() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center py-5">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <p className="fs-3">🙁 Halaman tidak ditemukan</p>
            <p className="lead">URL yang kamu tuju tidak tersedia di sistem ini.</p>
            <Link to="/" className="btn btn-primary mt-3">
                🔙 Kembali ke Beranda
            </Link>
        </div>
    );
}
