<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationsSupervisors extends Model
{
    use SoftDeletes;

    protected $fillable = [


        'student_id',
        'organization_id',
        'supervisor_id',

    ];

    public function supervisor()
    {
        return $this->belongsTo('App\Models\Supervisor');
    }

    public function organizations()
    {
        return $this->belongsTo('App\Models\Organizations');
    }
}
