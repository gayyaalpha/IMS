<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingDiaryStatus extends Model
{
    //
    public function trainingDiary()
    {
        return $this ->hasOne('App\Models\student_training_diary');
    }
}


