import { useAuth } from "../auth/AuthContext.jsx";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="container py-5">
            <div className="card shadow-sm mb-4 border-0 rounded-4">
                <div className="card-body d-flex align-items-center">
                    <img
                        src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                        alt="avatar"
                        className="rounded-circle me-4"
                        width="80"
                        height="80"
                    />
                    <div>
                        <h4 className="fw-bold mb-0">Selamat Datang 👋</h4>
                        <p className="text-muted mb-0">{user?.full_name || "Administrator"}</p>
                        <small className="text-secondary">Role: {user?.user_type}</small>
                    </div>
                </div>
            </div>

        </div>
    );
}
