<?php

namespace App\Models;



use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
 * @mixin Builder
 */
class TrainingDiaryWeekReview extends Model
{
    //
    protected $fillable = [
        'supervisor_id',
        'student_id',
        'week_no',
        'review',
        'mark',
    ];


    public function supervisors()
    {
        return $this ->belongsTo('App\Models\Supervisor','supervisor_id');
    }
}
