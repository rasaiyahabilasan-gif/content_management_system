
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import TeacherManagement from "./pages/TeacherManagement";
import StudentManagement from "./pages/StudentManagement";

function ProtectedRoute({ allowedRole, children }) {
    const token = localStorage.getItem("cms_token");
    const user = JSON.parse(localStorage.getItem("cms_user") || "null");

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Admin Dashboard */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Teacher Management */}
                <Route
                    path="/admin/teachers"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <TeacherManagement />
                        </ProtectedRoute>
                    }
                />
                {/* Admin Student Management */}
                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <StudentManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Teacher Dashboard */}
                <Route
                    path="/teacher/dashboard"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Student Dashboard */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
