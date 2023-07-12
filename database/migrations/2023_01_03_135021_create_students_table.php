<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name_with_initials');
            $table->string('full_name')->nullable();
            $table->string('registration_number')->unique()->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('contact_number_home')->nullable();
            $table->string('contact_number_mobile')->nullable();
            $table->date('date')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->date('training_start_date')->nullable();
            $table->date('training_end_date')->nullable();
            $table->unsignedBigInteger('department')->nullable();
            $table->unsignedBigInteger('cluster')->nullable();
            $table->boolean('status')->nullable();
            $table->string('records')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('supervisor_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
}
