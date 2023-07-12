<?php

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
         $testUser = User::create([
             'name' => 'Shanuka Gayashan',
             'email' => 'demo@example.com',
             'password' => bcrypt('12345'),
             'api_token' => Str::random(80)
         ]);

        DB::table('roles')->insert([
            [ 'id'=>1,'name' => 'Admin'],
            [ 'id'=>2,'name' => 'Student'],
            [ 'id'=>3,'name' => 'External Supervisor'],
            [ 'id'=>4,'name' => 'Internal Supervisor'],
            [ 'id'=>5,'name' => 'Coordinator'],
            [ 'id'=>6,'name' => 'Guest'],
        ]);

        DB::table('user_roles')->insert([
            [ 'id'=>1,'user_id' => '1','role_id' => '1'],
        ]);

        DB::table('training_diary_statuses')->insert([
            [ 'id'=>1, 'name' => 'Reviewed by the Internal Supervisor'],
            [ 'id'=>2,'name' => 'External Supervisor Authorized'],
            [ 'id'=>3,'name' => 'Pending Authorization of the External Supervisor'],
            [ 'id'=>4,'name' => 'Completed'],
            [ 'id'=>5, 'name' => 'Incomplete'],
        ]);

        DB::table('departments')->insert([
           [ 'id'=>1, 'name' => 'Agricultural Technology'],
           [ 'id'=>2,'name' => 'Environmental Technology'],
           [ 'id'=>3,'name' => 'Instrumentation and Automation Technology'],
           [ 'id'=>4, 'name' => 'Information and Communication Technology'],
        ]);
        DB::table('designations')->insert([
           [ 'id'=>1,'designation' => 'software Engineer'],
           [ 'id'=>2,'designation' => 'Account Executive'],
           [ 'id'=>3,'designation' => 'Project Manager'],
        ]);
        DB::table('qualifications')->insert([
           [ 'id'=>1,'qualification' => 'Professional Qualification'],
           [ 'id'=>2,'qualification' => 'MPhil'],
           [ 'id'=>3,'qualification' => 'MSc'],
           [ 'id'=>4,'qualification' => 'MBA'],
           [ 'id'=>5,'qualification' => 'B.Sc'],
           [ 'id'=>6,'qualification' => 'Higher Diploma'],
           [ 'id'=>7,'qualification' => 'A/L'],
        ]);

        DB::table('clusters')->insert([
            [ 'id'=>1, 'name' => '2017'],
            [ 'id'=>2,'name' => '2018'],
            [ 'id'=>3,'name' => '2019'],
            [ 'id'=>4, 'name' => '2020'],
         ]);

         DB::table('organizations')->insert([
            [ 'id'=>1, 'name' => 'mickiesoft','registration_number' => 's11111'],
            [ 'id'=>2,'name' => 'virtusa','registration_number' => 's11112'],
            [ 'id'=>3,'name' => 'dialog','registration_number' => 's11113'],
            [ 'id'=>4, 'name' => 'singer','registration_number' => 's11114'],
         ]);

    }
}
