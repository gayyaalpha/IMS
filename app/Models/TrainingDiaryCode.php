<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainingDiaryCode extends Model
{
    //
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    public function trainingDiary()
    {
        return $this ->hasOne('App\Models\student_training_diary');
    }
}
