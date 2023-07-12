<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\Designation;
use App\Models\Department;
use App\Models\Organizations;
use App\Models\Qualification;
use App\Models\OrganizationsSupervisors;
use App\Models\StudentTrainingDiary;
use App\Models\Supervisor;
use App\Models\Student;
use App\Models\TrainingDiaryReview;
use App\Models\TrainingDiaryWeekReview;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Mail;
use UsingRefs\Model;
use Validator;


class SupervisorController extends Controller
{
    public function getList(Request $request)
        {
            $user = User::where('api_token',$request['api_token'])->first();
            $perPage = $request['per_page'];
            $sortBy = $request['sort_by'];
            $sortType = $request['sort_type'];


            $supervisors = Supervisor::get();

            if ($request['query'] != '') {
                $supervisors->where('name', 'like', '%' . $request['query'] . '%');
            }

            return response()->json([
                'result' => $supervisors->get(),
                'status' => 'success'
            ]);
        }

    public function getInternalList(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


//        $supervisors = Supervisor::where('is_internal', 1 )->get();
        $supervisors = Supervisor::query();

        if ($request['name'] != '') {
            $supervisors->where('name', 'like', '%' . $request['name'] . '%');
        }

            $supervisors->where('is_internal', true );

        return response()->json([
            'result' => $supervisors->get(),
            'status' => 'success'
        ]);
    }

    public function getExternalList(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


        //$supervisors = Supervisor::where('is_internal', 0 );
        $supervisors = Supervisor::query();

        if ($request['name'] != '') {
            $supervisors->where('name', 'like', '%' . $request['name'] . '%');
        }

        $supervisors->where('is_internal', false );

        return response()->json([
            'result' => $supervisors->get(),
            'status' => 'success'
        ]);
    }

        public function create(Request $request)
        {
            $user = User::where('api_token',$request['api_token'])->first();

            $validate = Validator::make($request->all(), [
                'title'                 => 'string',
                'name'                  => 'required|string',
                'contact_no_home'       => 'required|unique:supervisors,contact_no_home',
                'contact_no_office'     => 'string',
                'email'                 => 'required|email|unique:supervisors,email',
                'designation_id'        => 'required|string',
                'department_id'         => 'string',
                'is_internal'           => 'boolean',
                'organization_id'       => 'string',
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'message' => $validate->errors(),
                    'status' => 'validation-error'
                ], 401);
            }

            $newPassword=Str::random(8);
            $user = User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'password' =>bcrypt($newPassword),
                'api_token' => Str::random(80),
            ]);

            if ($user){


                $userRole = UserRole::create([
                    'user_id' => $user->id,
                    'role_id' => 4,

                ]);

                $newSupervisor = Supervisor::create([
                    'title'                 => $request['title'],
                    'name'                  => $request['name'],
                    'contact_no_home'       => $request['contact_no_home'],
                    'contact_no_office'     => $request['contact_no_office'],
                    'email'                 => $request['email'],
                    'designation_id'        => $request['designation_id'],
                    'department_id'         => $request['department_id'],
                    'is_internal'           => 1,
                    'status'                => 1,
                    'user_id'               => $user->id,

                ]);

                if ($newSupervisor) {


//                    $newOrganizationSupervisor = OrganizationsSupervisors::create([
//                        'organization_id'        => $request['organization_id'],
//                        'supervisor_id'          => $newSupervisor->id,
//                        'student_id'  => 0,
//                    ]);

                    $details = [
                        'userName' => $request['email'],
                        'password' => $newPassword,
                        'name'=>$request['name'],
                    ];

                    Mail::to($user->email)->send(new \App\Mail\SupervisorInvitation($details));
                    return response()->json([
                        'message' => 'Supervisor successfully saved',
                        'status' => 'success'
                    ]);

                } else {
                    return response()->json([
                        'message' => 'Something went wrong',
                        'status' => 'error'
                    ],400);
                }



                }else{

                return response()->json([
                    'message' => 'Something went wrong',
                    'status'  => 'error'
                ],400);
            }
        }

    public function createExternalSupervisor(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'name'                  => 'required|string',
            'contact_no_home'       => 'required|unique:supervisors,contact_no_home',
            'contact_no_office'     => 'string',
            'email'                 => 'required|email|unique:supervisors,email',
            'designation_id'        => 'string',
            'department_id'         => 'string',
            'is_internal'           => 'boolean',
            'organization_id'       => 'string',
            'qualification_id'      => 'string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }


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
                'contact_no_office'     => $request['contact_no_office'],
                'email'                 => $request['email'],
                'designation_id'        => $request['designation_id'],
                'department_id'         => $request['department_id'],
                'qualification_id'      => $request['qualification_id'],
                'is_internal'           => 0,
                'status'                => 1,
                'user_id'               => $user->id,

            ]);

            if ($newSupervisor) {


                $newOrganizationSupervisor = OrganizationsSupervisors::create([
                    'organization_id'        => $request['organization_id'],
                    'supervisor_id'          => $newSupervisor->id,
                    'student_id'  => 0,
                ]);

                $details = [
                    'userName' => $request['email'],
                    'password' => $newPassword,
                    'name'=>$request['name'],
                ];

                Mail::to($user->email)->send(new \App\Mail\SupervisorInvitation($details));
                return response()->json([
                    'message' => 'Supervisor successfully saved',
                    'status' => 'success'
                ]);

            } else {
                return response()->json([
                    'message' => 'Something went wrong',
                    'status' => 'error'
                ],400);
            }

        }else{

            return response()->json([
                'message' => 'Something went wrong',
                'status'  => 'error'
            ],400);
        }
    }

        public function update(Request $request)
        {
            $user = User::where('api_token',$request['api_token'])->first();

            $supervisor = Supervisor::where('id',$request['id'])
                            ->first();

            if (empty($supervisor)) {
                return response()->json([
                    'message' => 'Supervisor Not Found',
                    'status' => 'error'
                ]);
            }


            $validate = Validator::make($request->all(), [
                'title'        => 'string',
                'name'        => 'required|string',
                'contact_no_home'       => 'required|unique:supervisors,contact_no_home,'.$supervisor->id.',id',
//                'email'                     => 'required|email|unique:supervisors,email,'.$supervisor->id.',id',
                'designation_id'        => 'string',
                'department_id'        => 'string',
                'qualification_id'        => 'string',

            ]);

            if ($validate->fails()) {
                return response()->json([
                    'message' => $validate->errors(),
                    'status' => 'validation-error'
                ], 401);
            }

            $updateSupervisor = $supervisor->update([
                'title'        => $request['title'],
                'name'        => $request['name'],
                'contact_no_home'       => $request['contact_no_home'],
                'contact_no_office'       => $request['contact_no_office'],
//                'email'       => $request['email'],
                'email_work'       => $request['email_work'],
                'designation_id'     => $request['designation_id'],
                'department_id' => $request['department_id'],
                'qualification_id' => $request['qualification_id'],

            ]);

            if($updateSupervisor){

                $user = User::Where('id',$supervisor->user_id)->first();

                $updateUser = $user->update([
                    'name' => $request['name'],
                ]);

            }

            return response()->json([
                'message' => 'Supervisor successfully updated',
                'status' => 'success'
            ]);
        }

        public function destroy(Request $request)
        {
            //$user = User::where('api_token',$request['api_token'])->first();
            $supervisor = Supervisor::where('id',$request['id'])->first();

            if (empty($supervisor)) {
                return response()->json([
                    'message' => 'Supervisor Not Found',
                    'status' => 'error'
                ]);
            }

            $deleteSupervisor = $supervisor->delete();

            if ($deleteSupervisor) {
                return response()->json([
                    'message' => 'Supervisor successfully deleted',
                    'status' => 'success'
                ]);
            } else {
                return response()->json([
                    'message' => 'Something went wrong',
                    'status' => 'error'
                ]);
            }
        }

    public function dropdown(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


        $designations = Designation::select('designation as name','designations.*')->get();
        $departments = Department::get();
        $clusters = Cluster::get();
        $organizations = Organizations::get();
        $qualifications = Qualification::select('qualification as name','qualifications.*')->get();;


        $obj = (object) array('designation' => $designations,'department' => $departments,'cluster' => $clusters,'organization' => $organizations, 'qualification' => $qualifications);

        return response()->json([
            'result' => $obj,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }

    public function getById(Request $request)
        {
            $user = User::where('api_token',$request['api_token'])->first();

            $perPage = $request['per_page'];
            $sortBy = $request['sort_by'];
            $sortType = $request['sort_type'];


            $supervisor = Supervisor::Where('id',$request['id'])->first();

            return response()->json([
                'message' => $supervisor,
                'status' => 'success'
            ]);
        }

    public function searchSupervisor(Request $request)
    {

        try {
            $supervisor = Supervisor::query();
            if ($request['query'] != '') {
                $supervisor->where('name', 'like', '%' . $request['query'] . '%');
            }
            if ($request['is_internal'] != '') {
                $supervisor->where('is_internal', $request['is_internal'] );
            }

            return response()->json([
                    'result' => $supervisor->get(),
                    'status' => 'success'
                ]);


        }
        catch (\Exception $e) {

            return response()->json([
                'result' => $e->getMessage(),
                'status' => 'false'
            ]);
        }

    }

    public function sendMail(Request $request)
    {

        try {

//        $data = array('name'=>"Virat Gandhi");
//        $div="test123";
//        Mail::send($div, $data, function($message) use ($request) {
//            $message->to('supunhasanka1995@gmail.com', $request['id'])->subject
//            ('Your account has been created');
//            $message->from('wmb@ac.lk','Wmb');
//        });

            $details = [
                'title' => 'Mail from ItSolutionStuff.com',
                'body' => 'This is for testing email using smtp'
            ];

            Mail::to('supunhasanka1995@gmail.com')->send(new \App\Mail\SupervisorInvitation($details));

        return response()->json([
            'message' => 'ok',
            'status' => 'success'
        ]);

        }
        catch (\Exception $e) {

            return response()->json([
                'result' => $e->getMessage(),
                'status' => 'false'
            ]);
        }

    }

    public function getByToken(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $supervisor = Supervisor::Where('user_id',$user->id)->first();

        return response()->json([
            'result' => $supervisor,
            'status' => 'success'
        ]);
    }

    public function getStudentSupervisor(Request $request)
    {

        if ($request['id'] != '') {

            $students = Student::with('supervisor')->where('supervisor_id',$request['id'])->get();

            return response()->json([
                'result' => $students,
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

    public function getSupervisorStudentList(Request $request) {
        $user = User::where('api_token',$request['api_token'])->first();

        $students = Student::query();

        if ($request['name'] != '') {
            $students->where('name_with_initials', 'like', '%' . $request['name'] . '%');
        }
        $students->where('supervisor_id', $request['supervisor_id'] );
        $request=$students->get();

        return response()->json([
            'result' => $request,
            'message' =>'Ok',
            'status' => 'success'
        ]);
    }

    public function getExternalSupervisorStudentList(Request $request)
    {

        if ($request['id'] != '') {
//            $students = Student::query();
//            if ($request['name'] != '') {
//                        $students->where('name_with_initials', 'like', '%' . $request['name'] . '%');
//             }
//            $students->with('studentOrganization', function (Builder $query) use ($request) {
//                $query->where('supervisor_id', 'like', $request['id']);
//
//            });
//            $request=$students->get();

            $students = DB::table('students')
                ->join('student_organizations', 'students.id', '=', 'student_organizations.student_id')
                ->where('student_organizations.supervisor_id', $request['id'])
                ->when($request['name'], function($query) use ($request){
                    return $query->where('students.name_with_initials','like','%'.$request['name'].'%');
                })
                ->select('students.id', 'students.name_with_initials', 'students.email', 'student_organizations.supervisor_id')
                ->get();
            return response()->json([
                'result' => $students,
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

    public function externalSupervisorSubmitForReview(Request $request){
        if ($request['ids'] != '') {
            if($request['supervisor_id'] && $request['student_id'] && $request['week_no']){
                $review=TrainingDiaryWeekReview::where('supervisor_id',$request['supervisor_id'])
                    ->where('student_id',$request['student_id'])
                    ->where('week_no',$request['week_no'])
                    ->first();

                if($review){
                    $review->update([
                        'review'       => $request['review']?$request['review']:$review->review,
                        'mark'       => $request['mark']?$request['mark']:$review->mark,
                    ]);
                }else{
                    TrainingDiaryWeekReview::create([
                        'student_id'        => $request['student_id'],
                        'supervisor_id'        => $request['supervisor_id'],
                        'week_no'        => $request['week_no'],
                        'review'        => $request['review'],
                        'mark'        => $request['mark'],
                    ]);

                }
            }

            $studentTrainingDiaries = StudentTrainingDiary::whereIn('id',$request['ids'])
                -> update([
                    'status'       => 2, //External Supervisor Authorized
                ]);

            $supervisors=DB::table('supervisors')
                ->join('students', 'students.supervisor_id', '=', 'supervisors.id')
                ->where('students.id', $request['student_id'])
                ->select('supervisors.*')
                ->first();
            $details = [
                'name'=>$supervisors->name,
            ];

            Mail::to($supervisors->email)->send(new \App\Mail\ReviewReminder($details));
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


    public function internalSupervisorSubmitForReview(Request $request){
        if ($request['ids'] != '') {

            if($request['supervisor_id'] && $request['student_id'] && $request['week_no']){
                $review=TrainingDiaryWeekReview::where('supervisor_id',$request['supervisor_id'])
                    ->where('student_id',$request['student_id'])
                    ->where('week_no',$request['week_no'])
                    ->first();

                if($review){
                    $review->update([
                        'review'       => $request['review']?$request['review']:$review->review,
                        'mark'       => $request['mark']?$request['mark']:$review->mark,
                    ]);
                }else{
                    TrainingDiaryWeekReview::create([
                        'student_id'        => $request['student_id'],
                        'supervisor_id'        => $request['supervisor_id'],
                        'week_no'        => $request['week_no'],
                        'review'        => $request['review'],
                        'mark'        => $request['mark'],
                    ]);

                }
            }

            $studentTrainingDiaries = StudentTrainingDiary::whereIn('id',$request['ids'])
                -> update([
                    'status'       => 1, //Reviewed by the Internal Supervisor
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


    public function externalSupervisorSubmitDayReview(Request $request){

            if($request['supervisor_id'] && $request['student_id'] && $request['training_diary_id']){
                $review=TrainingDiaryReview::where('supervisor_id',$request['supervisor_id'])
                    ->where('student_id',$request['student_id'])
                    ->where('training_diary_id',$request['training_diary_id'])
                    ->first();

                if($review){
                    $review->update([
                        'review'       => $request['review']?$request['review']:$review->review,
                        'mark'       => $request['mark']?$request['mark']:$review->mark,
                    ]);
                }else{
                    TrainingDiaryReview::create([
                        'student_id'        => $request['student_id'],
                        'supervisor_id'        => $request['supervisor_id'],
                        'training_diary_id'        => $request['training_diary_id'],
                        'review'        => $request['review'],
                        'mark'        => $request['mark'],
                    ]);

                }

                return response()->json([
                    'result' => $review,
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


    public function internalSupervisorSubmitDayReview(Request $request){

        if($request['supervisor_id'] && $request['student_id'] && $request['training_diary_id']){
            $review=TrainingDiaryReview::where('supervisor_id',$request['supervisor_id'])
                ->where('student_id',$request['student_id'])
                ->where('training_diary_id',$request['training_diary_id'])
                ->first();

            if($review){
                $review->update([
                    'review'       => $request['review']?$request['review']:$review->review,
                    'mark'       => $request['mark']?$request['mark']:$review->mark,
                ]);
            }else{
                TrainingDiaryReview::create([
                    'student_id'        => $request['student_id'],
                    'supervisor_id'        => $request['supervisor_id'],
                    'training_diary_id'        => $request['training_diary_id'],
                    'review'        => $request['review'],
                    'mark'        => $request['mark'],
                ]);

            }

            return response()->json([
                'result' => $review,
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

        if ($request['ids'] != '') {

            $supervisors = supervisor::whereIn('id',$request['ids'])
                -> update([
                    'status'       => 1, //Active
                ]);

            return response()->json([
                'result' => $supervisors,
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

    public function approveExternalSupervisor(Request $request)
    {

        $supervisor = Supervisor::where('id',$request['id'])
            ->first();

        if (empty($supervisor)) {
            return response()->json([
                'message' => 'Supervisor Not Found',
                'status' => 'error'
            ]);
        }

        $updateSupervisor = $supervisor->update([
            'status'       => $request['is_active']?1:0,
        ]);

        return response()->json([
            'message' => 'Status successfully changed',
            'status' => 'success'
        ]);
    }


    public function AssignStudnetToInternalSupervisor(Request $request){
        if ($request['studentIds'] != '') {

            $supervisors = Student::whereIn('id',$request['studentIds'])
                -> update([
                    'supervisor_id'       => $request['supervisor_id'],
                ]);

            return response()->json([
                'result' => $supervisors,
                'message' => 'Successfully Added',
                'status' => 'success'
            ]);
        }else{
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'success'
            ],400);
        }
    }
}
