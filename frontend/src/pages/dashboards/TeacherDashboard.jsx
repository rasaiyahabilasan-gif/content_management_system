
function TeacherDashboard() {
    const user = JSON.parse(localStorage.getItem("cms_user") || "{}");

    const logout = () => {
        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_user");
        window.location.href = "/";
    };

    return (
        <div className="container-fluid teacher-page min-vh-100">
            <nav className="navbar navbar-dark teacher-navbar">
                <span className="navbar-brand">CMS Teacher Panel</span>
                <button className="btn btn-light" onClick={logout}>
                    Logout
                </button>
            </nav>

            <div className="container mt-5">
                <h2>Welcome, {user.name}</h2>
                <p className="text-muted">Teacher Dashboard</p>

                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <h5>My Content</h5>
                        <p>Create and manage your own content.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
