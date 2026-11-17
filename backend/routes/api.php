<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ContentController;

Route::post('/register', [AuthController::class, 'register']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/dashboard', function () {
    return response()->json([
        'message' => 'Welcome to Admin Dashboard'
    ]);
});

Route::middleware(['auth:sanctum', 'role:teacher'])->get('/teacher/dashboard', function () {
    return response()->json([
        'message' => 'Welcome to Teacher Dashboard'
    ]);
});

Route::middleware(['auth:sanctum', 'role:student'])->get('/student/dashboard', function () {
    return response()->json([
        'message' => 'Welcome to Student Dashboard'
    ]);
});

Route::get('/test', [App\Http\Controllers\Api\TestController::class, 'index']);

Route::get('/posts', [App\Http\Controllers\Api\PostController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/users', [UserController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:admin'])->post('/admin/teachers', [UserController::class, 'store']);

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/teachers', [UserController::class, 'teachers']);

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/teachers/{id}', [UserController::class, 'showTeacher']);

Route::middleware(['auth:sanctum', 'role:admin'])->put('/admin/teachers/{id}', [UserController::class, 'updateTeacher']);

Route::middleware(['auth:sanctum', 'role:admin'])->delete('/admin/teachers/{id}', [UserController::class, 'destroyTeacher']);

Route::middleware(['auth:sanctum', 'role:admin'])->post('/admin/admins', [UserController::class, 'createAdmin']);

Route::middleware(['auth:sanctum', 'role:admin'])->put('/admin/users/{id}', [UserController::class, 'update']);

Route::middleware(['auth:sanctum', 'role:admin'])->put('/admin/users/{id}/role', [UserController::class, 'updateRole']);

Route::middleware(['auth:sanctum', 'role:admin'])->delete('/admin/users/{id}', [UserController::class, 'destroy']);

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/students', [UserController::class, 'students']);

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/students/{id}', [UserController::class, 'showStudent']);

Route::middleware(['auth:sanctum', 'role:admin'])->put('/admin/students/{id}', [UserController::class, 'updateStudent']);

Route::middleware(['auth:sanctum', 'role:admin'])->delete('/admin/students/{id}', [UserController::class, 'destroyStudent']);

Route::middleware(['auth:sanctum', 'role:admin,teacher'])->group(function () {

    Route::post('/contents', [ContentController::class, 'store']);

    Route::get('/contents', [ContentController::class, 'index']);

    Route::get('/contents/{id}', [ContentController::class, 'show']);

    Route::put('/contents/{id}', [ContentController::class, 'update']);

    Route::delete('/contents/{id}', [ContentController::class, 'destroy']);

});