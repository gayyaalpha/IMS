<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    protected $fillable = [

        'role_id',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function role()
    {
        return $this ->belongsTo('App\Models\Role');
    }
}
