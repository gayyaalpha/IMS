<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{

//    use SoftDeletes;
    //
     protected $fillable = [

        'registration_number',
        'name_with_initials',
        'full_name',
        'address',
        'city',
        'contact_number_home',
        'contact_number_mobile',
        'email',
        'department',
        'cluster',
       // 'status' ,
        'user_id' ,
        'supervisor_id',
        'status',
        'training_start_date',
        'training_end_date',
        ];

//    public function studentOrganization()
//    {
//        return $this ->hasMany('App\Models\StudentOrganization', 'student_id', 'id');
//    }

    public function organizationsSupervisors()
    {
        return $this ->belongsTo('App\Models\OrganizationsSupervisors', 'student_id', 'organization_id');
    }

    public function studentOrganization()
    {
        return $this ->hasMany('App\Models\StudentOrganization');
    }

    public function supervisor()
    {
        return $this ->belongsTo('App\Models\Supervisor');
    }
}
