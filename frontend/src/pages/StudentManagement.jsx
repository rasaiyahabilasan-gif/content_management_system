
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin/students";

function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const token = localStorage.getItem("cms_token");

    // Common request headers
    const getHeaders = () => ({
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    // 1. Fetch all students
    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_URL, getHeaders());

            setStudents(response.data.students || []);
        } catch (err) {
            console.error("Fetch students error:", err);
            setError("Unable to load students.");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // 2. Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 3. Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

        setEditingId(null);
        setShowForm(false);
    };

    // 4. Add or Update student
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            if (editingId) {
                await axios.put(
                    `${API_URL}/${editingId}`,
                    {
                        name: formData.name,
                        email: formData.email,
                    },
                    getHeaders()
                );

                setMessage("Student updated successfully!");
            } else {
                await axios.post(
                    API_URL,
                    formData,
                    getHeaders()
                );

                setMessage("Student added successfully!");
            }

            resetForm();
            await fetchStudents();

        } catch (err) {
            console.error("Save student error:", err);

            const errors = err.response?.data?.errors;

            if (errors) {
                setError(Object.values(errors).flat().join(" "));
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to save student."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // 5. Edit student
    const handleEdit = async (id) => {
        setMessage("");
        setError("");

        try {
            const response = await axios.get(
                `${API_URL}/${id}`,
                getHeaders()
            );

            const student = response.data.student;

            setFormData({
                name: student.name,
                email: student.email,
                password: "",
                password_confirmation: "",
            });

            setEditingId(id);
            setShowForm(true);

        } catch (err) {
            console.error("Edit student error:", err);
            setError("Unable to load student details.");
        }
    };

    // 6. Delete student
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await axios.delete(
                `${API_URL}/${id}`,
                getHeaders()
            );

            // Immediately remove deleted student from React state
            setStudents((previousStudents) =>
                previousStudents.filter(
                    (student) => student.id !== id
                )
            );

            setMessage("Student deleted successfully!");

        } catch (err) {
            console.error("Delete student error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete student."
            );
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Student Management
            </h2>

            <p>
                Manage student accounts: add, view, edit and delete students.
            </p>

            {/* Success Message */}
            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Add Student Button */}
            {!showForm && (
                <button
                    className="cms-primary-btn mb-3"
                    onClick={() => {
                        setMessage("");
                        setError("");
                        setShowForm(true);
                    }}
                >
                    + Add New Student
                </button>
            )}

            {/* Student Form */}
            {showForm && (
                <div className="card p-4 mb-4">

                    <h4 className="mb-3">
                        {editingId ? "Edit Student" : "Add New Student"}
                    </h4>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group mb-3">
                            <label>Student Name</label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter student name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!editingId && (
                            <>
                                <div className="form-group mb-3">
                                    <label>Password</label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label>Confirm Password</label>

                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        className="form-control"
                                        placeholder="Confirm password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="cms-primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Please wait..."
                                : editingId
                                    ? "Update Student"
                                    : "Add Student"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            )}

            {/* Students Table */}
            <div className="card p-3">

                <h4 className="mb-3">
                    Registered Students
                </h4>

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id}>

                                        <td>{student.id}</td>

                                        <td>{student.name}</td>

                                        <td>{student.email}</td>

                                        <td>
                                            <span className="cms-role-badge">
                                                {student.role}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="cms-primary-btn"
                                                onClick={() =>
                                                    handleEdit(student.id)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(student.id)
                                                }
                                                style={{
                                                    marginLeft: "8px",
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "7px 14px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No students found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
}

export default StudentManagement;
