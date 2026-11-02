<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

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

