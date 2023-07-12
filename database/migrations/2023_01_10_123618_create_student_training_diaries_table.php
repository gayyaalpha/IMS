<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentTrainingDiariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_training_diaries', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('status')->nullable();
            $table->string('training_type')->nullable();
            $table->string('code')->nullable();
            $table->string('comments')->nullable();
            $table->text('day_type')->nullable();
            $table->bigInteger('actual_hours')->nullable();
            $table->bigInteger('standard_hours')->nullable();
            $table->bigInteger('additional_hours')->nullable();
            $table->string('student_id');
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
        Schema::dropIfExists('student_training_diaries');
    }
}
