<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Student;
use Faker\Generator as Faker;

$factory->define(Student::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'registration_number' => $faker->randomNumber(),
        'user_id' => $faker->randomNumber(),
        'status' => $faker->state,
        'date' => $faker->date(),
    ];
});
