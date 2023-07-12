<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organizations;
use App\Models\OrganizationsSupervisors;
use App\Models\Student;
use App\Models\StudentOrganization;
use App\Models\StudentSupervisors;
use App\Models\Supervisor;
use Illuminate\Http\Request;
use App\Models\User;
use Validator;
use Illuminate\Database\Eloquent\Builder;

class OrganizationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();



        $newOrganization = Organizations::create([
            //  'id'                => $user->id,
            'name'     => $request['name'],
            'registration_number' => $request['registration_number'],


        ]);


        if ($newOrganization) {
            return response()->json([
                'result' => $newOrganization,
                'message' => 'Organization successfully created ',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ],400);
        }
    }

    public function update(Request $request)
    {
        try {

            $user = User::where('api_token',$request['api_token'])->first();

            $organization = Organizations::where('id',$request['id'])
                //->where('user_id', $user->id)
                ->first();


            if (empty($organization)) {
                return response()->json([
                    'message' => 'Student Not Found',
                    'status' => 'error'
                ]);
            }


            $validate = Validator::make($request->all(), [
//                'name_with_initials'        => 'required|string',
//                'email'                     => 'required|email|unique:students,email,'.$student->id.',id',
//                'full_name'                 => 'required|string'
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

            $updateOrganization = $organization->update([
                'registration_number' => $request['registration_number'],
                'name'                => $request['name'],
            ]);

            return response()->json([
                'message' => 'Organization successfully updated',
                'status' => 'success'
            ]);

        } catch (\Exception $e) {


            return response()->json([
                'message' =>  $e->getMessage(),
                'status' => 'false'
            ],400);
        }

    }


    public function getList(Request $request)
        {
            //$students = Student::first();
            $user = User::where('api_token',$request['api_token'])->first();

            $organizations = Organizations::query();

            if ($request['query'] != '') {
              $organizations->where('name', 'like', '%' . $request['query'] . '%');
            }

            return response()->json([
                'result' => $organizations->get(),
                'message' => 'ok',
                'status' => 'success'
            ]);
        }

    public function getById(Request $request)
    {

        $organization = Organizations::Where('id',$request['id'])->first();

        return response()->json([
            //'result' => $organization,
            'message' => $organization,
            'status' => 'success'
        ]);
    }



    public function AddStudentsOrganizations(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'registration_number'        => 'required|string',
            'student_id'        => 'required|string',
            'organization_id'        => 'required|string',
            'date_of_inception' => 'required|date'


//
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

        $newOrg = StudentOrganization::create([
            'student_id'        => $request['student_id'],
            'organization_id'       => $request['organization_id'],
            'status'       => 0,
            'date_of_inception'     => $request['date_of_inception'],
            'supervisor_id'     => $request['supervisor_id'],
            'records' => 0,
            'is_active'        => false,
        ]);


        if ($newOrg) {

            $organization = Organizations::where('id',$request['organization_id'])->first();

            $updateOrganization = $organization-> update([
                //  'id'                => $user->id,
                //'name'     => $request['name'],
                'registration_number' => $request['registration_number'],

            ]);

            $supervisor = Supervisor::Where('id',$request['supervisor_id'])->first();
            $student = Student::where('id',$request['student_id'])->first();

            $studentOrganization = StudentOrganization::where('organization_id',$request['organization'])->where('student_id')
                ->first();
            

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


        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ],400);
        }
    }

    public function UpdateStudentsOrganizations(Request $request)
    {
        try {

            $user = User::where('api_token',$request['api_token'])->first();

            $organization= StudentOrganization::where('id',$request['id'])
                //->where('user_id', $user->id)
                ->first();


            if (empty($organization)) {
                return response()->json([
                    'message' => 'organization Not Found',
                    'status' => 'error'
                ]);
            }


            $validate = Validator::make($request->all(), [
                'student_id'        => 'required|string',
                'organization_id'        => 'required|string',
                'date_of_inception' => 'required|date'
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'message' => $validate->errors(),
                    'status' => 'validation-error'
                ], 400);
            }

            $updateOrganization = $organization->update([
                'student_id'        => $request['student_id'],
                'organization_id'       => $request['organization_id'],
                'date_of_inception'     => $request['date_of_inception'],
                'supervisor_id'     => $request['supervisor_id'],
//                  'user_id'                => $request['user_id'],
            ]);

            $supervisor = Supervisor::Where('id',$request['supervisor_id'])->first();
            $student = Student::where('id',$request['student_id'])->first();

            $studentOrganization = StudentOrganization::where('organization_id',$request['organization'])->where('student_id')
                ->first();

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
                'message' => 'Successfully updated',
                'status' => 'success'
            ]);

        } catch (\Exception $e) {


            return response()->json([
                'message' =>  $e->getMessage(),
                'status' => 'false'
            ],400);
        }

    }

    public function AddOrganizationSupervisors(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $validate = Validator::make($request->all(), [

            'student_id'        => 'required|string',
            'organization_id'        => 'required|string',
            'supervisor_id' => 'required|string',

        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 400);
        }

        $newSupervisor = OrganizationsSupervisors::create([
            'student_id'        => $request['student_id'],
            'organization_id'       => $request['organization_id'],
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

    public function getOrganizationSupervisors(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        if ( $request['organization_id'] != '') {


            $studentSupervisors = Supervisor::whereHas('organizationsSupervisors', function (Builder $query) use ($request) {
                $query->where('organization_id', 'like', $request['organization_id'])
                    ->where('name', 'like', '%' . $request['query'] . '%');
            })->get();

            return response()->json([
                'result' => $studentSupervisors,
                'message' => 'ok',
                'status' => true
            ]);
        }else{
            return response()->json([
                'result' => [],
                'message' => 'Failed',
                'status' => false
            ],200);
        }

    }

    public function deleteOrganization(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $organization = Organizations::where('id',$request['id'])
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
}
