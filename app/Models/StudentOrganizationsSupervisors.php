<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentOrganizationsSupervisors extends Model
{
    protected $fillable = [


        'student_organization_id',
        'supervisor_id',

    ];

    public function studentOrganization()
    {
        return $this->hasOne('App\Models\StudentOrganization');
    }

    public function supervisor()
    {
        return $this->belongsTo('App\Models\Supervisor');
    }
}
