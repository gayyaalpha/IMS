<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentTrainingDiary extends Model
{
    use SoftDeletes;

    protected $fillable = [

        'date',
        'status',
        'training_type',
        'code',
        'comments',
        'day_type',
        'actual_hours',
        'standard_hours',
        'additional_hours',
        'student_id',

    ];

    public function status()
    {
        return $this ->belongsTo('App\Models\TrainingDiaryStatus','status');
    }

    public function code()
    {
        return $this ->belongsTo('App\Models\TrainingDiaryCode','code');
    }

    public function type()
    {
        return $this ->belongsTo('App\Models\TrainingDiaryType','training_type');
    }
}
