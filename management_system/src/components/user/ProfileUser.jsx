import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { alertSuccess, alertFailed } from "../../lib/alert";
import { userUpdatePassword } from "../../lib/api/userApi.js";

export default function ProfileUser() {
    const { user, authToken } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return alertFailed("Konfirmasi password tidak cocok.");
        }

        setLoading(true);

        const res = await userUpdatePassword({
            token: authToken,
            password_hash:newPassword,
        });

        const body = await res.json();
        setLoading(false);

        if (res.ok) {
            await alertSuccess("Password berhasil diubah.");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            await alertFailed(body.errors || "Gagal mengubah password.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="mb-4">Profil Saya</h3>

                            <div className="row mb-4">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Nama Lengkap</label>
                                    <div className="fw-bold">{user?.full_name || "-"}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Email</label>
                                    <div className="fw-bold">{user?.email || "-"}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Username</label>
                                    <div className="fw-bold">{user?.username || "-"}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Peran</label>
                                    <div className="fw-bold text-capitalize">{user?.user_type || "-"}</div>
                                </div>
                            </div>

                            <hr />

                            <h4 className="mb-3">Ubah Password</h4>
                            <form onSubmit={handleSubmit}>


                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Password Baru</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="d-grid mt-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
