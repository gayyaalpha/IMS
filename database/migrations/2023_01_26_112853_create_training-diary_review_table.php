<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingDiaryReviewTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_Diary_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('supervisor_id');
            $table->string('student_id');
            $table->string('training_diary_id');
            $table->text('review')->nullable();;
            $table->decimal('mark')->nullable();;
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_Diary_reviews');
    }
}
