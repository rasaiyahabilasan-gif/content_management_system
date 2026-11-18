
import { Link } from "react-router-dom";

function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem("cms_user") || "{}");

    const logout = () => {
        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_user");
        window.location.href = "/";
    };

    return (
        <div className="container-fluid admin-page min-vh-100">
            <nav className="navbar navbar-dark admin-navbar">
                <span className="navbar-brand">CMS Admin Panel</span>

                <button className="btn btn-light" onClick={logout}>
                    Logout
                </button>
            </nav>

            <div className="container mt-5">
                <h2>Welcome, {user.name}</h2>
                <p className="text-muted">Administrator Dashboard</p>

                <div className="row mt-4">

                    {/* Teacher Management */}
                    <div className="col-md-4 mb-3">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Teacher Management</h5>
                                <p>Manage teacher accounts.</p>

                                <Link
                                    to="/admin/teachers"
                                    className="btn cms-primary-btn"
                                >
                                    Manage Teachers
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Student Management */}
                    <div className="col-md-4 mb-3">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Student Management</h5>
                                <p>Manage student accounts.</p>

                                <Link
                                    to="/admin/students"
                                    className="btn cms-primary-btn"
                                >
                                    Manage Students
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Management */}
                    <div className="col-md-4 mb-3">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5>Content Management</h5>
                                <p>Manage CMS content.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
