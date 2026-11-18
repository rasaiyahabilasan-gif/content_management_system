
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/login", formData);

            const { token, user } = response.data;

            localStorage.setItem("cms_token", token);
            localStorage.setItem("cms_user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "teacher") {
                navigate("/teacher/dashboard");
            } else if (user.role === "student") {
                navigate("/student/dashboard");
            } else {
                setError("Your account has an unsupported role.");
            }
        } catch (err) {
            if (err.response?.status === 422) {
                setError("Please enter a valid email and password.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to login. Please check your connection."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">

                    <div className="card login-card shadow-lg border-0">
                        <div className="card-body p-4 p-md-5">

                            <div className="text-center mb-4">
                                <h2 className="font-weight-bold text-primary">
                                    CMS Portal
                                </h2>
                                <p className="text-muted">
                                    Content Management System
                                </p>
                            </div>

                            <h4 className="text-center mb-2">
                                Welcome Back
                            </h4>

                            <p className="text-center text-muted mb-4">
                                Sign in to continue
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="form-group mb-3">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label>Password</label>

                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />

                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={loading}
                                >
                                    {loading ? "Signing in..." : "Login"}
                                </button>

                            </form>

                            <hr />

                            <p className="text-center text-muted mb-0">
                                Secure CMS Access
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
