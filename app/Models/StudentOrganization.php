<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentOrganization extends Model
{
    use SoftDeletes;

    protected $fillable = [


        'registration_number',
        'student_id',
        'organization_id',
        'supervisor_id',
        'organization_name',
        'status',
        'date_of_inception',
        'records',
        'is_active',

    ];

    public function student()
    {
        return $this->belongsTo('App\Models\Student');
    }

    public function organization()
    {
        return $this->belongsTo('App\Models\Organizations');
    }
    public function supervisor()
    {
        return $this->belongsTo('App\Models\Supervisor');
    }

    public function studentOrganizationSupervisors()
    {
        return $this->belongsTo('App\Models\StudentOrganizationsSupervisors');
    }
}
