<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'created_at'
        )->get();

        return response()->json([
            'message' => 'Users retrieved successfully',
            'users' => $users
        ], 200);
    }

        public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher',
        ]);

        return response()->json([
            'message' => 'Teacher account created successfully',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role'
            ]),
        ], 201);
    }

            public function createAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        return response()->json([
            'message' => 'Admin account created successfully',
            'user' => $admin->only([
                'id',
                'name',
                'email',
                'role'
            ]),
        ], 201);
    }

                public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'User details updated successfully',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role'
            ]),
        ], 200);
    }

        public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'role' => 'required|in:admin,teacher,student',
        ]);

        $user->update([
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role'
            ]),
        ], 200);
    }

        public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);
    }


    public function teachers()
    {
        $teachers = User::where('role', 'teacher')
            ->select(
                'id',
                'name',
                'email',
                'role',
                'created_at'
            )
            ->get();

        return response()->json([
            'message' => 'Teachers retrieved successfully',
            'teachers' => $teachers
        ], 200);
    }


    public function showTeacher($id)
    {
        $teacher = User::where('role', 'teacher')
            ->where('id', $id)
            ->select(
                'id',
                'name',
                'email',
                'role',
                'created_at'
            )
            ->firstOrFail();

        return response()->json([
            'message' => 'Teacher details retrieved successfully',
            'teacher' => $teacher
        ], 200);
    }


    public function updateTeacher(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')
            ->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $teacher->id,
        ]);

        $teacher->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Teacher details updated successfully',
            'teacher' => $teacher->only([
                'id',
                'name',
                'email',
                'role'
            ]),
        ], 200);
    }

    
    public function destroyTeacher($id)
    {
        $teacher = User::where('role', 'teacher')
            ->findOrFail($id);

        $teacher->delete();

        return response()->json([
            'message' => 'Teacher account deleted successfully'
        ], 200);
    }

    public function students()
    {
        $students = User::where('role', 'student')
            ->select(
                'id',
                'name',
                'email',
                'role',
                'created_at'
            )
            ->get();

        return response()->json([
            'message' => 'Students retrieved successfully',
            'students' => $students
        ], 200);
    }

    public function showStudent($id)
    {
        $student = User::where('role', 'student')
            ->where('id', $id)
            ->select(
                'id',
                'name',
                'email',
                'role',
                'created_at'
            )
            ->first();

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Student retrieved successfully',
            'student' => $student
        ], 200);
    }

    public function updateStudent(Request $request, $id)
    {
        $student = User::where('role', 'student')
            ->where('id', $id)
            ->first();

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        $student->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student
        ], 200);
    }

    public function destroyStudent($id)
    {
        $student = User::where('role', 'student')
            ->where('id', $id)
            ->first();

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully'
        ], 200);
    }
}
