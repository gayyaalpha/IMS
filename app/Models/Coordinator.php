<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coordinator extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name','title','contact_number_home','contact_number_office','email','Designation','Department','user_id',
    ];
}
