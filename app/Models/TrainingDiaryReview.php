<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingDiaryReview extends Model
{
    //

    protected $fillable = [
        'supervisor_id',
        'student_id',
        'training_diary_id',
        'review',
        'mark',
    ];
    public function supervisors()
    {
        return $this ->belongsTo('App\Models\Supervisor','supervisor_id');
    }
    public function trainingDiary()
    {
        return $this ->belongsTo('App\Models\student_training_diary');
    }
}
