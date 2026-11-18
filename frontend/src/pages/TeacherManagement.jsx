
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function TeacherManagement() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const token = localStorage.getItem("cms_token");

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/teachers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTeachers(response.data.teachers || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to retrieve teacher accounts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
        setEditingTeacher(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            if (editingTeacher) {
                const response = await api.put(
                    `/admin/teachers/${editingTeacher.id}`,
                    {
                        name: formData.name,
                        email: formData.email,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSuccess(response.data.message);
            } else {
                const response = await api.post(
                    "/admin/teachers",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSuccess(response.data.message);
            }

            resetForm();
            await fetchTeachers();
        } catch (err) {
            const errors = err.response?.data?.errors;

            if (errors) {
                setError(Object.values(errors).flat().join(" "));
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to save teacher details."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (id) => {
        setError("");
        setSuccess("");

        try {
            const response = await api.get(
                `/admin/teachers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const teacher = response.data.teacher;

            setFormData({
                name: teacher.name,
                email: teacher.email,
                password: "",
                password_confirmation: "",
            });

            setEditingTeacher(teacher);
            setShowForm(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to retrieve teacher details."
            );
        }
    };


    const handleDelete = async (teacher) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${teacher.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await api.delete(
                `/admin/teachers/${teacher.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(response.data.message);

            await fetchTeachers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete teacher account."
            );
        }
    };


    return (
        <div className="container-fluid admin-page min-vh-100">
            <nav className="navbar navbar-dark admin-navbar">
                <span className="navbar-brand">CMS Admin Panel</span>

                <Link to="/admin/dashboard" className="btn btn-light">
                    Back to Dashboard
                </Link>
            </nav>

            <div className="container mt-5">

                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                    <h2>Teacher Management</h2>

                    <div>
                        <button
                            className="btn cms-primary-btn mr-2"
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            Add New Teacher
                        </button>

                        <button
                            className="btn cms-primary-btn"
                            onClick={fetchTeachers}
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {showForm && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="mb-4">
                                {editingTeacher
                                    ? "Edit Teacher Details"
                                    : "Register New Teacher"}
                            </h5>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {!editingTeacher && (
                                    <>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                value={formData.password}
                                                onChange={handleChange}
                                                minLength="6"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Confirm Password</label>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                className="form-control"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                minLength="6"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="btn cms-primary-btn mr-2"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingTeacher
                                            ? "Update Teacher"
                                            : "Create Teacher Account"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="alert alert-info">
                        Loading teacher accounts...
                    </div>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">Registered Teachers</h5>

                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {teachers.length > 0 ? (
                                            teachers.map((teacher) => (
                                                <tr key={teacher.id}>
                                                    <td>{teacher.id}</td>
                                                    <td>{teacher.name}</td>
                                                    <td>{teacher.email}</td>
                                                    <td>
                                                        <span className="badge cms-role-badge">
                                                            {teacher.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        
                                                        <button
                                                            className="btn btn-sm cms-primary-btn mr-2"
                                                            onClick={() => handleEdit(teacher.id)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(teacher)}
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    No teachers found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-muted mb-0">
                                Total Teachers: {teachers.length}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherManagement;
