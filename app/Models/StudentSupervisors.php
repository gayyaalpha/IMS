<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSupervisors extends Model
{
    protected $fillable = [
        'student_id',
        'supervisor_id',
        'is_active',
        'status',

    ];

    public function student()
    {
        return $this->hasOne('App\Models\Student');
    }

    public function supervisor()
    {
        return $this->belongsTo('App\Models\Supervisor');
    }
}
