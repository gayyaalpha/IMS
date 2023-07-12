<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organizations extends Model
{
    use SoftDeletes;

    protected $fillable = [


        'name',
        'registration_number',

    ];

    public function organizationsStudents()
    {
        return $this ->hasMany('App\Models\StudentOrganization');
    }

    public function organizationsSupervisors()
    {
        return $this ->hasMany('App\Models\OrganizationsSupervisors','organization_id');
    }
}
