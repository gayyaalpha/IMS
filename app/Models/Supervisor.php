<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supervisor extends Model
{
    use SoftDeletes;
    //
     protected $fillable = [
            'title',
            'name',
            'contact_no_home',
            'contact_no_office',
            'email',
            'email_work',
            'designation_id',
            'department_id',
            'qualification_id',
            'is_internal',
            'status',
            'user_id',
        ];

    public function organizationsSupervisors()
    {
        return $this->hasOne('App\Models\OrganizationsSupervisors');
    }

    public function studentOrganizationSupervisors()
    {
        return $this->hasOne('App\Models\StudentOrganizationsSupervisors');
    }

    public function student()
    {
        return $this->hasOne('App\Models\Student');
    }
}
