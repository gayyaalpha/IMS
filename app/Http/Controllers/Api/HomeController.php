<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\Coordinator;
use App\Models\Department;
use App\Models\News;
use App\Models\Type;
use App\Models\Designation;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\TrainingDiaryCode;
use App\Models\TrainingDiaryType;
use App\Models\Lead;
use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Validator;

class HomeController extends Controller
{
    public function getData(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->role->first();

        $allLead = Lead::where('user_id', $user->id);

        $weeklyLeadCount = (clone $allLead)->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
        $monthlyLeadCount = (clone $allLead)->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->count();
        $totalLeadsCount = (clone $allLead)->count();
        $recentLeads = (clone $allLead)->orderby('created_at', 'desc')->limit(5)->get();

        $data['totalLeads'] = $totalLeadsCount;
        $data['weeklyLeads'] = $weeklyLeadCount;
        $data['monthlyLeads'] = $monthlyLeadCount;
        $data['recentLeads'] = $recentLeads;

        return response()->json([
            'message' => $data,
            'status' => 'success'
        ]);
    }

    public function dropdown(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $departments = Department::get();
        $clusters = Cluster::get();
        $roles = Role::get();

        $obj = (object)array('department' => $departments, 'cluster' => $clusters, 'roles' => $roles);

        return response()->json([
            'result' => $obj,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }

    public function getUserByToken(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        return response()->json([
            'result' => $user,
            'status' => 'success'
        ]);
    }

    public function updatePassword(Request $request)
    {

        $user = User::where('api_token', $request['api_token'])->first();

        $user = User::where('id', $request['id'])
            ->first();

        if (empty($user)) {
            return response()->json([
                'message' => 'User Not Found',
                'status' => 'error'
            ]);
        }

        $validate = Validator::make($request->all(), [

            'password' => 'required|min:8|confirmed|string',

        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $updatePasword = $user->update([
            'password' => bcrypt($request['password']),
        ]);

        return response()->json([
            'message' => 'Password successfully changed',
            'status' => 'success'
        ]);

    }

    public function getUsers(Request $request)
    {
//        $Users = User::whare()->when($request['name'], function($query) use ($request){
//            return $query->where('name','like','%'.$request['name'].'%');
//        })->get();
        $Users = DB::table('users')
            ->join('user_roles', 'user_roles.user_id', '=', 'users.id')
            ->join('roles', 'roles.id', '=', 'user_roles.role_id')
            ->whereIn('user_roles.role_id', [1, 6])
            ->when($request['name'], function ($query) use ($request) {
                return $query->where('users.name', 'like', '%' . $request['name'] . '%');
            })
            ->select('users.*', 'roles.name as role_name')
            ->get();

        return response()->json([
            'result' => $Users,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }

    public function userGetById(Request $request){
        $Users = User::with('userRole')->where('id','=',$request['id'])->first();

        return response()->json([
            'result' => $Users,
            'message' => 'ok',
            'status' => 'success'
        ]);
    }
    public function userUpdate(Request $request){

        $user = User::with('userRole')->where('id','=',$request['id'])->first();
        $UserRole = UserRole::where('user_id','=',$user->id)->first();
        $validate = Validator::make($request->all(), [
            'name'                  => 'required|string',
            'email'                     => 'required|email|unique:users,email,'.$user->id.',id',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $user->update([
            //  'id'                => $user->id,
            'name' => $request['name'],
            'email' => $request['email'],

        ]);
        $msg="";
        $role_id_change=null;
        if($UserRole && $UserRole->role_id!=$request['role_id']){
            if($request['role_id']=='1'){
                $role_id_change=1;
                $msg= 'and User make as admin';
            }else if($request['role_id']=='2'){
                $role_id_change=2;
                $this->createStudent($user);
                $msg= 'and User make as Student';
            }else if($request['role_id']=='3'){
                $role_id_change=3;
                $this->createSupervisor($user,0);
                $msg= 'and User make as External Supervisor';
            }else if($request['role_id']=='4'){
                $role_id_change=4;
                $this->createSupervisor($user,1);
                $msg= 'and User make as Internal Supervisor';

            }else if($request['role_id']=='5'){
                $role_id_change=5;
                $this->createCoordinator($user);
                $msg= 'and User make as Coordinator';
            }else if($request['role_id']=='6'){
                $role_id_change=6;
                $msg= 'and User make as Guest';
            }
        }

        if($role_id_change){
            $UserRole-> update([
                'role_id' => $role_id_change
                ,
            ]);
        }


        return response()->json([
            'result' => $UserRole,
            'message' => 'successfully Updated,'.$msg,
            'status' => 'success'
        ]);
    }

    public function deleteUser(Request $request){

        $user = User::where('id','=',$request['id'])->first();

        if (empty($user)) {
            return response()->json([
                'message' => 'User Not Found',
                'status' => 'error'
            ]);
        }

        $deleteUser = $user->delete();

        if ($deleteUser) {
            return response()->json([
                'message' => 'User successfully deleted',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }

    public function createSupervisor($user,$isInternal){
        $newSupervisor = Supervisor::create([
            'name'                  => $user->name,
            'email'                 => $user->email,
            'is_internal'           => $isInternal,
            'status'                => 1,
            'user_id'               => $user->id,

        ]);
    }
    public function createCoordinator($user){
        $newCoordinator = Coordinator::create([
            'name' => $user->name,
            'email' => $user->email,
            'user_id' => $user->id
        ]);
    }

    public function userCreate(Request $request){
        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
        $newPassword = Str::random(8);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($newPassword),
            'api_token' => Str::random(80),
        ]);
        $user->save();

        $token = Str::random(80);

        $user->forceFill([
            'api_token' => hash('sha256', $token),
        ])->save();

        $user_role = UserRole::create([
            'user_id' => $user->id,
            'role_id' => "1"
        ]);
        $details = [
            'userName' => $request['email'],
            'password' => $newPassword,
            'name' => $request['name'],
        ];

        Mail::to($user->email)->send(new \App\Mail\SupervisorInvitation($details));

        return response()->json([
            'result' => $user,
            'message' => 'User is successfully Created',
            'status' => 'success'
        ]);
    }

    public function getDepartmentList(Request $request)
    {
        $departments = Department::query();


        $request = $departments->get();
        return response()->json([
            'result' => $request,
            'message' => 'Ok',
            'status' => 'success'
        ]);
    }

    public function createDepartment(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $departments = Department::create([
            'name' => $request['name'],
        ]);


        return response()->json([
            'result' => $departments,
            'message' => 'Department has Successfully Created',
            'status' => 'success'
        ]);
    }

    public function destroyDepartment(Request $request)
    {

        try {
            $user = User::where('api_token',$request['api_token'])->first();
            $departments = Department::where('id',$request['id'])
                //  ->where('id', $user->id)
                ->first();

            if (empty($departments)) {
                return response()->json([
                    'message' => 'Department Not Found',
                    'status' => 'error'
                ]);
            }

            $deleteDepartments = $departments->delete();

            if ($deleteDepartments) {
                return response()->json([
                    'message' => 'Department successfully deleted',
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

    public function getDesignationList(Request $request)
    {
        $designations = Designation::query();


        $request = $designations->get();
        return response()->json([
            'result' => $request,
            'message' => 'Ok',
            'status' => 'success'
        ]);
    }

    public function createDesignation(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'designation' => 'required|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $designations = Designation::create([
            'designation' => $request['designation'],
        ]);


        return response()->json([
            'result' => $designations,
            'message' => 'Designation has Successfully Created',
            'status' => 'success'
        ]);
    }
    public function destroyDesignation(Request $request)
    {

        try {
            $user = User::where('api_token',$request['api_token'])->first();
            $designations = Designation::where('id',$request['id'])
                //  ->where('id', $user->id)
                ->first();

            if (empty($designations)) {
                return response()->json([
                    'message' => 'Designation Not Found',
                    'status' => 'error'
                ]);
            }

            $deletedesignations = $designations->delete();

            if ($deletedesignations) {
                return response()->json([
                    'message' => 'Designation successfully deleted',
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

    public function getCodeList(Request $request)
    {
        $codes = TrainingDiaryCode::query();


        $request = $codes->get();
        return response()->json([
            'result' => $request,
            'message' => 'Ok',
            'status' => 'success'
        ]);
    }

    public function CreateCode(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $codes = TrainingDiaryCode::create([
            'name' => $request['name'],
        ]);


        return response()->json([
            'result' => $codes,
            'message' => 'Code has Successfully Created',
            'status' => 'success'
        ]);
    }

    public function destroyCode(Request $request)
    {

        try {
            $user = User::where('api_token',$request['api_token'])->first();
            $codes = TrainingDiaryCode::where('id',$request['id'])
                //  ->where('id', $user->id)
                ->first();

            if (empty($codes)) {
                return response()->json([
                    'message' => 'Code Not Found',
                    'status' => 'error'
                ]);
            }

            $deleteCode = $codes->delete();

            if ($deleteCode) {
                return response()->json([
                    'message' => 'Code successfully deleted',
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

    public function getTypeList(Request $request)
    {
        $types = TrainingDiaryType::query();


        $request = $types->get();
        return response()->json([
            'result' => $request,
            'message' => 'Ok',
            'status' => 'success'
        ]);
    }

    public function createType(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $types = TrainingDiaryType::create([
            'name' => $request['name'],
        ]);


        return response()->json([
            'result' => $types,
            'message' => 'Type has Successfully Created',
            'status' => 'success'
        ]);
    }
    public function destroyType(Request $request)
    {

        try {
            $user = User::where('api_token',$request['api_token'])->first();
            $types = TrainingDiaryType::where('id',$request['id'])
                //  ->where('id', $user->id)
                ->first();

            if (empty($types)) {
                return response()->json([
                    'message' => 'Type Not Found',
                    'status' => 'error'
                ]);
            }

            $deleteType = $types->delete();

            if ($deleteType) {
                return response()->json([
                    'message' => 'Type successfully deleted',
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


    public function ProfileImageUpload(Request $request){
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
            if($this->isValidImageFile($file)){
                $file->move(public_path('uploads/profile'), $fileName);
                if($request->api_token){
                    $user = User::where('api_token',$request['api_token'])->first();
                    $user->update([
                        'img' => '/uploads/profile/'.$fileName,
                    ]);
                    return response()->json([
                        'result' => $user,
                        'message' => 'Successfully Uploaded',
                        'status' => 'success'
                    ]);
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

    function isValidImageFile($file)
    {
        //.xls, .xlsx, .xlsm, .xltx, .xltm,.csv
        $validExcelMimes = [
            'png',
            'jpeg',
            'jpg',
        ];

        return in_array($file->getClientOriginalExtension(), $validExcelMimes);
    }
}
