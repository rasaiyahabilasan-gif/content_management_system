<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Content extends Model
{
    protected $fillable = [
        'title',
        'body',
        'status',
        'user_id',
    ];

    // Content belongs to a user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}