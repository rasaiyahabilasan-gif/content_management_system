<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    // Create new content
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'status' => 'sometimes|in:draft,published',
        ]);

        $content = Content::create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'status' => $validated['status'] ?? 'draft',
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Content created successfully',
            'content' => $content
        ], 201);
    }

        public function index()
    {
        $contents = Content::with('user:id,name')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Content retrieved successfully',
            'contents' => $contents
        ], 200);
    }

        public function show($id)
    {
        $content = Content::with('user:id,name')->find($id);

        if (!$content) {
            return response()->json([
                'message' => 'Content not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Content retrieved successfully',
            'content' => $content
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $content = Content::find($id);

        if (!$content) {
            return response()->json([
                'message' => 'Content not found'
            ], 404);
        }

        if (
            $request->user()->role === 'teacher' &&
            $content->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'You can only update your own content.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
            'status' => 'sometimes|in:draft,published',
        ]);

        $content->update($validated);

        return response()->json([
            'message' => 'Content updated successfully',
            'content' => $content
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $content = Content::find($id);

        if (!$content) {
            return response()->json([
                'message' => 'Content not found'
            ], 404);
        }

        if (
            $request->user()->role === 'teacher' &&
            $content->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'You can only delete your own content.'
            ], 403);
        }

        $content->delete();

        return response()->json([
            'message' => 'Content deleted successfully'
        ], 200);
    }
}