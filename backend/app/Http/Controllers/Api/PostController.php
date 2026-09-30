<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class PostController extends Controller
{
    public function index()
    {
        return response()->json([
            ['id' => 1, 'title' => 'First post'],
            ['id' => 2, 'title' => 'Second post'],
        ]);
    }
}
