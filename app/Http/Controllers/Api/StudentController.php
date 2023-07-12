<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendEmailToStudent;
use App\Models\Cluster;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Qualification;
use App\Models\Organizations;
use App\Models\OrganizationsSupervisors;
use App\Models\StudentSupervisors;
use App\Models\Supervisor;
use App\Models\Student;
use App\Models\StudentTrainingDiary;
use App\Models\StudentOrganization;
use App\Models\StudentOrganizationsSupervisors;
use App\Models\TrainingDiaryCode;
use App\Models\TrainingDiaryReview;
use App\Models\TrainingDiaryStatus;
use App\Models\TrainingDiaryType;
use App\Models\TrainingDiaryWeekReview;
use App\Models\User;
use App\Models\UserRole;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use phpDocumentor\Reflection\Types\Null_;
use PHPUnit\Util\Json;
use Validator;
use Illuminate\Database\Eloquent\Builder;
/**
 * @OA\Info(title="My First API", version="0.1")
 */
class StudentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/",
     *     description="Home page",
     *     @OA\Response(response="default", description="Welcome page")
     * )
     */
    public function getList(Request $request)
    {
        //$students = Student::first();
        $user = User::where('api_token',$request['api_token'])->first();

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


        $students = Student::query();

        if ($request['name'] != '') {
            $students->where('name_with_initials', 'like', '%' . $request['name'] . '%');
        }
        if ($request['query'] != '') {
            $students->where('name_with_initials', 'like', '%' . $request['query'] . '%');
        }
        $students->select('*','name_with_initials as name');
        $request=$students->get();

        return response()->json([
            'result' => $request,
            'message' =>'Ok',
            'status' => 'success'
        ]);
    }

    public function create(Request $request)
    {
    try {

      $user = User::where('api_token',$request['api_token'])->first();

              $validate = Validator::make($request->all(), [
                   'name_with_initials'        => 'required|string',
                   'department'        => 'required|string',
                   'cluster'        => 'required|string',
                   'full_name'                 => 'required|string',
                   'email'       => 'required|email|unique:students,email',
                   'contact_number_mobile'       => 'required|unique:students,contact_number_mobile',
                   'registration_number' => 'required|unique:students,registration_number'
              ]);

              if ($validate->fails()) {
                  return response()->json([
                      'message' => $validate->errors(),
                      'status' => 'validation-error'
                  ], 401);
              }

            $newPassword=Str::random(8);
            $user = User::create([
                'name' => $request->full_name,
                'email' => $request->email,
                'password' => bcrypt($newPassword),
                'api_token' => Str::random(80),
            ]);

              $newStudent = Student::create([
                  'registration_number'    => $request['registration_number'],
                  'name_with_initials'     => $request['name_with_initials'],
                  'full_name'              => $request['full_name'],
                  'address'                => $request['address'],
                  'city'                   => $request['city'],
                  'contact_number_home'    => $request['contact_number_home'],
                  'contact_number_mobile'  => $request['contact_number_mobile'],
                  'email'                  => $request['email'],
                  'department'             => $request['department'],
                  'cluster'                => $request['cluster'],
                  'user_id'                => $user->id,
                  'supervisor_id'          => $request['supervisor_id'],
                  'status'                 => 1
              ]);

              $user_role = UserRole::create([
                  'user_id' => $user->id,
                  'role_id' => "2"
              ]);

              if ($newStudent) {

                  $details = [
                      'userName' => $request->email,
                      'password' => $newPassword,
                      'name'=>$request['name_with_initials'],
                  ];

                  Mail::to($request->email)->send(new \App\Mail\StudentInvitationMail($details));

                  return response()->json([
                      'message' => 'Student successfully saved',
                      'status' => 'success',
                      'result' => $newStudent

                  ]);
              }
              else {
                  return response()->json([
                      'message' => 'Something went wrong',
                      'status' => 'error'
                  ]);
              }

    }
    catch (\Exception $e) {

        return response()->json([
              'message' =>  $e->getMessage(),
              'status' => 'false'
          ],400);
}

    }


    public function update(Request $request)
    {
    try {

         $user = User::where('api_token',$request['api_token'])->first();

              $student = Student::where('id',$request['id'])
                              //->where('user_id', $user->id)
                              ->first();


              if (empty($student)) {
                  return response()->json([
                      'message' => 'Student Not Found',
                      'status' => 'error'
                  ]);
              }


              $validate = Validator::make($request->all(), [
            'name_with_initials'        => 'required|string',
//            'email'                     => 'required|email|unique:students,email,'.$student->id.',id',
            'full_name'                 => 'required|string'
      //             'phone'       => 'required|unique:leads,phone,'.$lead->id.',id',
      //             'address'     => '',
      //             'description' => '',
      //             'progress'    => 'numeric',
      //             'status'      => 'numeric',
      //             'earnings'    => 'numeric',
      //             'expenses'    => 'numeric',
      //             'net'         => 'numeric',
              ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 400);
        }

              $updateStudent = $student->update([
                  'registration_number'    => $request['registration_number'],
                  'name_with_initials'     => $request['name_with_initials'],
                  'full_name'              => $request['full_name'],
                  'address'                => $request['address'],
                  'city'                   => $request['city'],
                  'contact_number_home'    => $request['contact_number_home'],
                  'contact_number_mobile'  => $request['contact_number_mobile'],
//                  'email'                  => $request['email'],
                  'department'             => $request['department'],
                  'cluster'                => $request['cluster'],
                  'supervisor_id'          => $request['supervisor_id'],
              ]);

              if($updateStudent){

              $user = User::Where('id',$student->user_id)->first();

               $updateUser = $user->update([
                   'name' => $request['full_name'],
               ]);

        }

              return response()->json([
                  'message' => 'Student successfully updated',
                  'status' => 'success'
              ]);

    } catch (\Exception $e) {


         return response()->json([
                          'message' =>  $e->getMessage(),
                          'status' => 'false'
                      ],400);
    }

    }

    public function destroy(Request $request)
    {

    try {
          $user = User::where('api_token',$request['api_token'])->first();
          $student = Student::where('id',$request['id'])
                        //  ->where('id', $user->id)
                          ->first();

          if (empty($student)) {
              return response()->json([
                  'message' => 'Student Not Found',
                  'status' => 'error'
              ]);
          }

          $deleteStudent = $student->delete();

          if ($deleteStudent) {
              return response()->json([
                  'message' => 'Student successfully deleted',
                  'status' => 'success'
              ]);
          } else {
              return response()->json([
                  'message' => 'Something went wrong',
                  'status' => 'error'
              ]);
          }

    } catch (\Exception $e) {

        return response()->json([
                      'message' =>  $e->getMessage(),
                      'status' => 'false'
                  ],400);
    }

    }

    public function dropdown(Request $request)
    {

        $departments = Department::get();
        $clusters = Cluster::get();
        $trainingTypes = TrainingDiaryType::get();
        $trainingDiaryStatus = TrainingDiaryStatus::get();
        $trainingDiaryCodes = TrainingDiaryCode::get();

        $obj = (object) array(
            'department' => $departments,
            'cluster' => $clusters,
            'trainingDiaryStatus' => $trainingDiaryStatus,
            'trainingTypes' => $trainingTypes,
            'trainingDiaryCodes' => $trainingDiaryCodes,

        );

        return response()->json([
            'result' => $obj,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }

    public function getById(Request $request)
    {
        //$students = Student::first();
        $user = User::where('api_token',$request['api_token'])->first();

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


        $student = Student::with('supervisor')->Where('id',$request['id'])->first();

        return response()->json([
            'message' => $student,
            'status' => 'success'
        ]);
    }

    public function getByToken(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $student = Student::Where('user_id',$user->id)->first();

        return response()->json([
            'result' => $student,
            'status' => 'success'
        ]);
    }

    public function getStudentOrganizations(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        if ($request['id'] != '') {

            $studentOrganizations = Student::with('studentOrganization.organization')->where('id',$request['id'])->first();


            //$studentOrganizations = StudentOrganization::query();


            return response()->json([
                'result' => $studentOrganizations,
                'message' => 'ok',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }

    public function deleteStudentOrganization(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $organization = StudentOrganization::where('id',$request['id'])
            ->first();

        if (empty($organization)) {
            return response()->json([
                'message' => 'Organization Not Found',
                'status' => 'error'
            ]);
        }

        $deleteOrganization = $organization->delete();

        if ($deleteOrganization) {
            return response()->json([
                'message' => 'Organization successfully deleted',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }

    public function AddStudentSupervisors(Request $request)
    {

        $validate = Validator::make($request->all(), [

            'student_organization_id'        => 'required|string',
            'supervisor_id' => 'required|string',

        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 400);
        }

        $newSupervisor = StudentOrganizationsSupervisors::create([
            'student_organization_id'       => $request['student_organization_id'],
            'supervisor_id' => $request['supervisor_id'] ,

        ]);


        if ($newSupervisor) {

            return response()->json([
                'message' => 'Successfully added',
                'status' => 'success'
            ]);

        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ],400);
        }
    }

    public function getStudentSupervisors(Request $request)
    {

        if ( $request['student_organization_id'] != '') {

            $studentSupervisors = StudentOrganizationsSupervisors::with('supervisor')
                ->where('student_organization_id',$request['student_organization_id']  )
                ->get();

            return response()->json([
                'result' => $studentSupervisors,
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'result' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }

    public function EditStudentOrganizations(Request $request)
    {

        $validate = Validator::make($request->all(), [
            'registration_number'        => 'required|string',
            'student_organization_id'        => 'required|string',
            'date_of_inception' => 'required|date',
            'supervisor_id' => 'required|string',
            'organization_id'        => 'required|string',


        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 400);
        }

        $organization = Organizations::where('id',$request['organization_id'])->first();

        $updateOrganization = $organization-> update([
            //  'id'                => $user->id,
            //'name'     => $request['name'],
            'registration_number' => $request['registration_number'],

        ]);

        if ($updateOrganization) {
            return response()->json([
                'message' => 'Successfully added',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ],400);
        }

    }


    public function getStudentOrganizationById(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        if ($request['id'] != '') {

            $studentOrganizations = StudentOrganization::with('organization')->with('supervisor')->where('id',$request['id'])
                ->where('student_id',$request['student_id'])
                ->first();

            return response()->json([
                'result' => $studentOrganizations,
                'message' => 'ok',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }

    public function updateTrainingDate(Request $request)
    {

        try {


            $student = Student::where('id',$request['id'])
                //->where('user_id', $user->id)
                ->first();


            if (empty($student)) {
                return response()->json([
                    'message' => 'Student Not Found',
                    'status' => 'error'
                ]);
            }
            $updateStudent = $student->update([
                'training_start_date'          => $request['training_start_date'],
                'training_end_date'          => $request['training_end_date'],
//                  'user_id'                => $request['user_id'],
            ]);

            if($updateStudent){

                $start_date = Carbon::parse($request['training_start_date']);
                $end_date = Carbon::parse($request['training_end_date']);
                $dates = CarbonPeriod::create($start_date, $end_date);

                $existData = StudentTrainingDiary::where('student_id',$student->id)->delete();

                foreach ($dates as $date) {
                    // Insert data into table for current date

                        $newSupervisor = StudentTrainingDiary::create([
                            'date'       => $date,
                            'status'       => 5, //Incomplete Status
                            'student_id' => $student->id ,
                    ]);
                }
            }

            return response()->json([
                'result' => $student,
                'message' => 'Successfully updated',
                'status' => 'success',
            ]);

        } catch (\Exception $e) {

        return response()->json([
        'message' =>  $e->getMessage(),
        'status' => 'false'
        ],400);
        }



    }

    public function getStudentTrainingDiariesList(Request $request)
    {

        if ($request['id'] != '') {

            $studentTrainingDiaries = StudentTrainingDiary::with('status')->where('student_id',$request['id'])
                ->get();

            return response()->json([
                'result' => $studentTrainingDiaries,
                'message' => 'ok',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }

    public function getStudentTrainingDiariesById(Request $request)
    {

        if ($request['id'] != '') {

            $studentTrainingDiaries = StudentTrainingDiary::with('status')->with('code')->with('type')
                ->where('id',$request['id'])
                ->first();

            return response()->json([
                'result' => $studentTrainingDiaries,
                'message' => 'ok',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }


    public function updateTrainingDiaryById(Request $request)
    {

        if ($request['id'] != '') {

            $studentTrainingDiaries = StudentTrainingDiary::with('status')->with('code')->with('type')
                ->where('id',$request['id'])
                ->first();


            $studentTrainingDiaries-> update([
                'status'       => 4, //Incomplete Status
                'training_type'       => $request['training_type'],
                'code'       => $request['code'],
                'comments'       => $request['comments'],
                'day_type'       => $request['day_type'],
                'actual_hours'       => $request['actual_hours'],
                'standard_hours'       => $request['standard_hours'],
                'additional_hours'       => $request['additional_hours'],
            ]);

            return response()->json([
                'result' => $studentTrainingDiaries,
                'message' => 'Successfully Updated',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }

    public function submitForReview(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        if ($request['ids'] != '') {

            $studentTrainingDiaries = StudentTrainingDiary::whereIn('id',$request['ids'])
                -> update([
                    'status'       => 3, //Pending Authorization of the External Supervisor
                ]);

            $supervisors=DB::table('supervisors')
                ->join('student_organizations', 'student_organizations.supervisor_id', '=', 'supervisors.id')
                ->where('student_organizations.student_id', $student->id)
                ->where('student_organizations.is_active', 1)
                ->select('supervisors.*')
                ->first();
            if($supervisors){

//                foreach ($supervisors as $supervisor){
//
//                }
                $details = [
                    'name'=>$supervisors->name,
                ];

                Mail::to($supervisors->email)->send(new \App\Mail\ReviewReminder($details));

            }

            return response()->json([
                'result' => $studentTrainingDiaries,
                'message' => 'Successfully Updated',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }
    public function getStudentOrganization(Request $request){

        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::where('user_id',$user->id)->first();
        if ($student && $student->id!='') {
            $organizations = DB::table('organizations')
                ->join('student_organizations', 'student_organizations.organization_id', '=', 'organizations.id')
                ->where('student_organizations.student_id', $student->id)
                ->whereNull('student_organizations.deleted_at')
                ->select('organizations.*','student_organizations.is_active','student_organizations.id as student_organizations_id')
                ->get();

            return response()->json([
                'result' => $organizations,
                'message' => 'ok',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }

    }

    public function organizationCreate(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $organization = Organizations::where('id',$request['organization_id'])
            //->where('user_id', $user->id)
            ->first();

        $updateOrganization = $organization->update([
            'registration_number' => $request['registration_number'],
        ]);


        $studentOrganization = StudentOrganization::where('organization_id',$request['organization_id'])->where('student_id',$student->id)
            ->first();

        if($studentOrganization){
            $updateOrganization = $studentOrganization->update([
                'date_of_inception' => $request['date'],
            ]);
        }else{
            $studentOrganization = StudentOrganization::create([
                'student_id'        => $student->id,
                'organization_id'       => $request['organization_id'],
                'status'       => 0,
                'date_of_inception'     => $request['date_of_inception'],
                'supervisor_id'     => null,
                'records' => 0,
                'is_active'        => false,
            ]);

        }

        return response()->json([
            'result' => $studentOrganization,
            'message' => 'Organization successfully created',
            'status' => 'success'
        ]);
    }

    public function organizationUpdate(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $organization = Organizations::where('id',$request['organization_id'])
            //->where('user_id', $user->id)
            ->first();

        $updateOrganization = $organization->update([
            'registration_number' => $request['registration_number'],
        ]);


        $studentOrganization = StudentOrganization::where('organization_id',$request['organization_id'])->where('student_id',$student->id)
            ->first();

        if($studentOrganization){
            $updateOrganization = $studentOrganization->update([
                'date_of_inception' => $request['date_of_inception'],
            ]);
        }

        return response()->json([
            'result' => $studentOrganization,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }
    public function studentCreateSupervisor(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

//
//        if (empty($student)) {
//            return response()->json([
//                'message' => 'Student Not Found',
//                'status' => 'error'
//            ]);
//        }

        if(!$request['supervisor_id']){
            $validate = Validator::make($request->all(), [
                'name'                  => 'required|string',
                'contact_no_home'       => 'required|unique:supervisors,contact_no_home',
                'email'                 => 'required|email|unique:supervisors,email',
                'organization_id'       => 'string',
            ]);
        }else{
            $validate = Validator::make($request->all(), [
                'name'                  => 'required|string',
            ]);
        }

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 400);
        }

        $supervisor = Supervisor::Where('id',$request['supervisor_id'])->first();

        if($supervisor){
            $studentOrganization = StudentOrganization::where('organization_id',$request['organization'])->where('student_id',$student->id)
                ->first();


            $updateOrganization = $studentOrganization->update([
                'supervisor_id' => $request['supervisor_id'],
            ]);

            $organizationSupervisors = OrganizationsSupervisors::where('organization_id',$request['organization'])
                ->get();

            $supervisorIds=array();
            foreach ($organizationSupervisors as $organizationSupervisor){
                $supervisorIds[] = $organizationSupervisor->supervisor_id;
            }
            if($supervisorIds){
                StudentSupervisors::whereIn('supervisor_id',$supervisorIds)->where('student_id',$student->id)
                    -> update([
                        'is_active'       => 0,
                    ]);
            }

            $studentSupervisor = StudentSupervisors::where('supervisor_id',$request['supervisor_id'])->where('student_id',$student->id)
                ->first();

            if(!$studentSupervisor){
                $newSupervisor = StudentSupervisors::create([
                    'is_active'           => 1,
                    'status'              => 0,
                    'supervisor_id'       => $supervisor->id,
                    'student_id'          => $student->id,

                ]);
            }
            return response()->json([
                'result' => $supervisor,
                'message' => 'Successfully updated',
                'status' => 'success'
            ]);
        }else{
            $newPassword=Str::random(8);
            $user = User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'password' => bcrypt($newPassword),
                'api_token' => Str::random(80),
            ]);

            if ($user){

                $userRole = UserRole::create([
                    'user_id' => $user->id,
                    'role_id' => 3,

                ]);

                $newSupervisor = Supervisor::create([
                    'name'                  => $request['name'],
                    'contact_no_home'       => $request['contact_no_home'],
                    'email'                 => $request['email'],
                    'designation_id'        => $request['designation_id'],
                    'qualification_id'        => $request['qualification'],
                    'is_internal'           => 0,
                    'status'                => 0,
                    'user_id'               => $user->id,

                ]);

                $organizationSupervisors = OrganizationsSupervisors::where('organization_id',$request['organization_id'])
                    ->get();

                $supervisorIds=array();
                foreach ($organizationSupervisors as $organizationSupervisor){
                    $supervisorIds[] = $organizationSupervisor->supervisor_id;
                }
                if($supervisorIds){
                    StudentSupervisors::whereIn('supervisor_id',$supervisorIds)->where('student_id',$student->id)
                        -> update([
                            'is_active'       => 0,
                        ]);
                }

                  StudentSupervisors::create([
                    'is_active'           => 1,
                    'status'              => 0,
                    'supervisor_id'       => $newSupervisor->id,
                    'student_id'          => $student->id,

                ]);

                if ($newSupervisor) {


                    $studentOrganization = StudentOrganization::where('organization_id',$request['organization_id'])->where('student_id',$student->id)
                        ->first();


                    $updateOrganization = $studentOrganization->update([
                        'supervisor_id' => $newSupervisor->id,
                    ]);

                    $supervisorOrganization = OrganizationsSupervisors::where('organization_id',$request['organization_id'])->where('supervisor_id',$newSupervisor)
                        ->first();
                    if(!$supervisorOrganization){
                        OrganizationsSupervisors::create([
                            'supervisor_id'                  => $newSupervisor->id,
                            'organization_id'       => $request['organization_id'],
                            'student_id'                 => 0,

                        ]);
                    }

                    $details = [
                        'userName' => $request['email'],
                        'password' => $newPassword,
                        'name'=>$request['name'],
                    ];

                    Mail::to($user->email)->send(new \App\Mail\SupervisorInvitation($details));
                    return response()->json([
                        'message' => 'Supervisor successfully saved',
                        'status' => 'success',
                         'result' => $newSupervisor
                    ]);


                } else {
                    return response()->json([
                        'message' => 'Something went wrong',
                        'status' => 'error'
                    ],400);
                }


            } else {
                return response()->json([
                    'message' => 'Something went wrong',
                    'status' => 'error'
                ],400);
            }
        }
    }

    public function getExternalSupervisorList(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $supervisors=DB::table('supervisors')
            ->join('organizations_supervisors', 'supervisors.id', '=', 'organizations_supervisors.supervisor_id')
            ->join('student_organizations', 'student_organizations.organization_id', '=', 'organizations_supervisors.organization_id')
            ->join('organizations', 'organizations.id', '=', 'organizations_supervisors.organization_id')
            ->where('student_organizations.student_id', $student->id)
            ->when($request['name'], function($query) use ($request){
                return $query->where('supervisors.name','like','%'.$request['name'].'%');
            })
            ->when($request['query'], function($query) use ($request){
                return $query->where('supervisors.name','like','%'.$request['query'].'%');
            })
            ->select('supervisors.*','organizations.name as organization_name','organizations.id as organization_id')
            ->get();
        if ($supervisors) {


            return response()->json([
                'result' => $supervisors,
                'message' => 'ok',
                'status' => 'success'
            ]);

        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ],400);
        }

    }


    public function getStudentExternalList(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

//        $supervisors=DB::table('supervisors')
//            ->join('student_organizations', 'supervisors.id', '=', 'student_organizations.supervisor_id')
//            ->join('organizations', 'organizations.id', '=', 'student_organizations.organization_id')
//            ->where('student_organizations.student_id', $student->id)
//            ->when($request['name'], function($query) use ($request){
//                return $query->where('supervisors.name','like','%'.$request['name'].'%');
//            })
//            ->select('supervisors.*','organizations.name as organization_name','organizations.id as organization_id','student_organizations.is_active as active_org')
//            ->get();
        $supervisors=DB::table('supervisors')
            ->join('student_supervisors', 'supervisors.id', '=', 'student_supervisors.supervisor_id')
            ->join('organizations_supervisors', 'supervisors.id', '=', 'organizations_supervisors.supervisor_id')
            ->join('organizations', 'organizations.id', '=', 'organizations_supervisors.organization_id')
            ->where('student_supervisors.student_id', $student->id)
            ->when($request['name'], function($query) use ($request){
                return $query->where('supervisors.name','like','%'.$request['name'].'%');
            })
            ->select('supervisors.*','organizations.name as organization_name','organizations.id as organization_id','student_supervisors.is_active as is_supervisor_active')
            ->get();

        $active_org=DB::table('student_organizations')
            ->join('organizations', 'organizations.id', '=', 'student_organizations.organization_id')
            ->where('student_organizations.student_id', $student->id)
            ->where('student_organizations.is_active', 1)
            ->select('organizations.*')
            ->first();
        if ($supervisors) {


            return response()->json([
                'result' => $supervisors,
                'active_org' => $active_org,
                'message' => 'ok',
                'status' => 'success'
            ]);

        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ],400);
        }

    }

    public function supervisorDropdown(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $designations = Designation::select('designation as name','designations.*')->get();
        $departments = Department::get();
        $clusters = Cluster::get();
        $qualifications = Qualification::select('qualification as name','qualifications.*')->get();;


        $organizations = DB::table('organizations')
            ->join('student_organizations', 'student_organizations.organization_id', '=', 'organizations.id')
            ->where('student_organizations.student_id', $student->id)
            ->select('organizations.*')
            ->get();


        $obj = (object) array('designation' => $designations,'department' => $departments,'cluster' => $clusters,'organization' => $organizations,'qualification' => $qualifications);

        return response()->json([
            'result' => $obj,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }

    public function getTrainingDiariesReviews(Request $request)
    {

        if ($request['student_id'] && $request['ids'] && $request['week_no']){

            $weekReviewInternal=TrainingDiaryWeekReview::with('supervisors')->whereHas('supervisors',function (Builder $query) {
                $query->where('is_internal', 'like', '1');
            })->where('student_id',$request['student_id'])
                ->where('week_no',$request['week_no'])
                ->get();

            $weekReviewExternal=TrainingDiaryWeekReview::with('supervisors')->whereHas('supervisors',function (Builder $query) use ($request) {
                $query->where('is_internal','like', '0');
            })->where('student_id',$request['student_id'])
                ->where('week_no',$request['week_no'])
                ->get();

            $dayReviewsInternal=TrainingDiaryReview::with('trainingDiary')->with('supervisors')->whereHas('supervisors',function (Builder $query) use ($request) {
                $query->where('is_internal','like', '1');
            })->where('student_id',$request['student_id'])
                ->whereIn('training_diary_id',$request['ids'])
                ->get();
            $dayReviewsExternal=TrainingDiaryReview::with('trainingDiary')->with('supervisors')->whereHas('supervisors',function (Builder $query) use ($request) {
                $query->where('is_internal','like', '0');
            })->where('student_id',$request['student_id'])
                ->whereIn('training_diary_id',$request['ids'])
                ->get();

            $reviews = (object) array('weekReviewInternal' => $weekReviewInternal,'weekReviewExternal' => $weekReviewExternal,'dayReviewsInternal' => $dayReviewsInternal,'dayReviewsExternal' => $dayReviewsExternal);

            return response()->json([
                'result' => $reviews,
                'message' => 'ok',
                'status' => 'success'
            ]);

        }else{

            return response()->json([
                'message' => 'Something went wrong',
                'status'  => 'error'
            ],400);
        }
    }

    public function setStudentOrganizationActive(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $studentOrganizations = StudentOrganization::where('student_id',$student->id)
            ->update([
                'is_active' => 0,
            ]);


        $studentOrganization = StudentOrganization::where('organization_id',$request['id'])->where('student_id',$student->id)
            ->first();

        if($studentOrganization){
             $studentOrganization->update([
                'is_active' => 1,
            ]);
        }

        return response()->json([
            'result' => $studentOrganization,
            'message' => 'Successfully Updated',
            'status' => 'success'
        ]);

    }

    public function setStudentSupervisorActive(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $OrganizationSupervisor = OrganizationsSupervisors::where('supervisor_id', $request['id'])
            ->first();

        $organizationSupervisors = OrganizationsSupervisors::where('organization_id',$OrganizationSupervisor->organization_id)
            ->get();

        $supervisorIds=array();
        foreach ($organizationSupervisors as $orgSupervisor){
            $supervisorIds[] = $orgSupervisor->supervisor_id;
        }

        if($supervisorIds){
            StudentSupervisors::whereIn('supervisor_id',$supervisorIds)
                -> update([
                    'is_active'       => 0,
                ]);
        }

        $studentOrganization = StudentOrganization::where('student_id',$student->id)->where('is_active',1)
            ->first();

        if($studentOrganization){
             $studentOrganization->update([
                'supervisor_id' => $request['id'],
            ]);
        }

         StudentSupervisors::where('supervisor_id',$request['id'])->where('student_id',$student->id)
            -> update([
                'is_active'       => 1,
            ]);


        return response()->json([
            'result' => $studentOrganization,
            'message' => 'Successfully Updated',
            'status' => 'success'
        ]);

    }

    public function deleteStudentSupervisor(Request $request){
        $user = User::where('api_token',$request['api_token'])->first();
        $student = Student::Where('user_id',$user->id)->first();

        $studentOrganization = StudentOrganization::where('student_id',$student->id)->first();

        if($studentOrganization){
            $updateStudentOrganization = $studentOrganization->update([
                'supervisor_id' => Null,
            ]);
        }

        return response()->json([
            'result' => $studentOrganization,
            'message' => 'Successfully Deleted',
            'status' => 'success'
        ]);


    }

    public function bulkUpload(Request $request){
        // Validate the request
        try {
            $validate = Validator::make($request->all(), [
                'file' => 'required|max:2048'
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'message' => $validate->errors(),
                    'status' => 'validation-error'
                ], 401);
            }
            // Get the uploaded file from the request
            $file = $request->file('file');

            // Generate a new file name
            $fileName = time() . '.' . $file->getClientOriginalExtension();

            // Move the uploaded file to a permanent location
            if($this->isValidExcelFile($file)){
                $file->move(public_path('uploads/studentBulkUploads'), $fileName);
                if($request->studentBulkData){
                    foreach (json_decode($request->studentBulkData) as $student){
                        if(isset($student->registration_number) && isset($student->name_with_initials) && isset($student->email)){
                            $newPassword=Str::random(8);
                            $user = User::create([
                                'name' => $student->full_name,
                                'email' => $student->email,
                                'password' => bcrypt($newPassword),
                                'api_token' => Str::random(80),
                            ]);

                            $newStudent = Student::create([
                                'registration_number'    => $student->registration_number,
                                'name_with_initials'     => $student->name_with_initials,
                                'full_name'              => (isset($student->full_name))?$student->full_name:'',
                                'address'                => (isset($student->address))?$student->address:'',
                                'city'                   => (isset($student->city))?$student->city:'',
                                'contact_number_home'    => (isset($student->contact_number_home))?$student->contact_number_home:'',
                                'contact_number_mobile'  => (isset($student->contact_number_mobile))? $student->contact_number_mobile:'',
                                'email'                  => $student->email,
                                'user_id'                => $user->id,
                                'status'                 => 1
                            ]);

                            $user_role = UserRole::create([
                                'user_id' => $user->id,
                                'role_id' => "2"
                            ]);

                            $details = [
                                'userName' => $student->email,
                                'password' => $newPassword,
                                'name'=>$student->name_with_initials,
                            ];

                            SendEmailToStudent::dispatch($details);
                        }
                    }

                }

            }else{
                return response()->json([
                    'result' => [],
                    'message' => 'File Type Not Valid',
                    'status' => 'error'
                ]);
            }


            // Do something with the file, for example, store the file name in the database
            // ...

            // Redirect the user back with a success message
            return response()->json([
                'result' => [],
                'message' => 'Successfully Uploaded',
                'status' => 'success'
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'message' => $e->getMessage(),
                'status' => 'error'
            ], 400);
        }
    }
    function isValidExcelFile($file)
    {
        //.xls, .xlsx, .xlsm, .xltx, .xltm,.csv
        $validExcelMimes = [
            'xls',
            'xlsx',
            'xlsm',
            'xltx',
            'xltm',
            'csv',
        ];

        return in_array($file->getClientOriginalExtension(), $validExcelMimes);
    }
}
