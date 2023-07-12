<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
          //factory(App\Models\User::class, 50)->create();
          //factory(App\Models\Student::class, 10)->create();
          //factory(App\Models\designation::class, 5)->create();
         //factory(App\Models\supervisor_qualification::class, 7)->create();
//
//        DB::table('departments')->insert([
//           [ 'id'=>1, 'name' => 'Agricultural Technology'],
//           [ 'id'=>2,'name' => 'Environmental Technology'],
//           [ 'id'=>3,'name' => 'Instrumentation and Automation Technology'],
//           [ 'id'=>4, 'name' => 'Information and Communication Technology'],
//        ]);
//        DB::table('designations')->insert([
//           [ 'id'=>1,'designation' => 'software Engineer'],
//           [ 'id'=>2,'designation' => 'Account Executive'],
//           [ 'id'=>3,'designation' => 'Project Manager'],
//        ]);
//        DB::table('qualifications')->insert([
//           [ 'id'=>1,'qualification' => 'Professional Qualification'],
//           [ 'id'=>2,'qualification' => 'MPhil'],
//           [ 'id'=>3,'qualification' => 'MSc'],
//           [ 'id'=>4,'qualification' => 'MBA'],
//           [ 'id'=>5,'qualification' => 'B.Sc'],
//           [ 'id'=>6,'qualification' => 'Higher Diploma'],
//           [ 'id'=>7,'qualification' => 'A/L'],
//        ]);
//        DB::table('roles')->insert([
//            [ 'id'=>1,'name' => 'Admin'],
//        ]);
//        DB::table('user_roles')->insert([
//            [ 'id'=>1,'user_id' => '1','role_id' => '1'],
//        ]);

//        DB::table('users')->insert([
//            [ 'id'=>2,'name' => 'Pradeep','email' => 'demo1@example.com','password' => bcrypt('123456'),'api_token' => Str::random(80)],
//            [ 'id'=>3,'name' => 'Supun','email' => 'demo3@example.com','password' => bcrypt('1234567'),'api_token' => Str::random(80)],
//            [ 'id'=>4,'name' => 'Dasun','email' => 'demo4@example.com','password' => bcrypt('12345678'),'api_token' => Str::random(80)],
//        ]);
//
//        DB::table('roles')->insert([
//            [ 'id'=>2,'name' => 'Student'],
//            [ 'id'=>3,'name' => 'External Supervisor'],
//            [ 'id'=>4,'name' => 'Internal Supervisor'],
//        ]);
//        DB::table('user_roles')->insert([
//            [ 'id'=>2,'user_id' => '2','role_id' => '2'],
//            [ 'id'=>3,'user_id' => '3','role_id' => '3'],
//            [ 'id'=>4,'user_id' => '4','role_id' => '4'],
//        ]);

//         DB::table('clusters')->insert([
//            [ 'id'=>1, 'name' => '2017'],
//            [ 'id'=>2,'name' => '2018'],
//            [ 'id'=>3,'name' => '2019'],
//            [ 'id'=>4, 'name' => '2020'],
//         ]);
//        DB::table('clusters')->insert([
//           [ 'id'=>1, 'name' => '2017'],
//           [ 'id'=>2,'name' => '2018'],
//           [ 'id'=>3,'name' => '2019'],
//           [ 'id'=>4, 'name' => '2020'],
//        ]);

  //      factory(App\Models\Student::class, 20)->create();

//         DB::table('organizations')->insert([
//            [ 'id'=>1, 'name' => 'mickiesoft','registration_number' => 's11111'],
//            [ 'id'=>2,'name' => 'virtusa','registration_number' => 's11112'],
//            [ 'id'=>3,'name' => 'dialog','registration_number' => 's11113'],
//            [ 'id'=>4, 'name' => 'singer','registration_number' => 's11114'],
//         ]);

//        DB::table('training_diary_statuses')->insert([
//            [ 'id'=>1, 'name' => 'Reviewed by the Internal Supervisor'],
//            [ 'id'=>2,'name' => 'External Supervisor Authorized'],
//            [ 'id'=>3,'name' => 'Pending Authorization of the External Supervisor'],
//
//        ]);
//
//        DB::table('roles')->insert([
//            [ 'id'=>5,'name' => 'coordinator'],
//        ]);
//
//        DB::table('training_diary_statuses')->insert([
//            [ 'id'=>4,'name' => 'Completed'],
//            [ 'id'=>5, 'name' => 'Incomplete'],
//        ]);
//
//        DB::table('roles')->insert([
//            [ 'id'=>6,'name' => 'guest'],
//        ]);

    }
}
