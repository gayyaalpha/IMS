<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\Coordinator;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Student;
use App\Models\TrainingDiaryCode;
use App\Models\TrainingDiaryStatus;
use App\Models\TrainingDiaryType;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Validator;

class CoordinatorController extends Controller
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
   * @return \Illuminate\Http\JsonResponse
   */
  public function create(Request $request)
  {
    try {

      $validate = Validator::make($request->all(), [
        'name' => 'required|string',
        'email' => 'required|email|unique:coordinators,email'
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

      $newCoordinator = Coordinator::create([
        'name' => $request['name'],
        'title' => $request['title'],
        'contact_number_home' => $request['contact_number_home'],
        'contact_number_office' => $request['contact_number_office'],
        'email' => $request['email'],
        'Designation' => $request['Designation'],
        'Department' => $request['Department'],
        'user_id' => $user->id
      ]);

      $user_role = UserRole::create([
        'user_id' => $user->id,
        'role_id' => "5"
      ]);

        if ($newCoordinator) {

            $details = [
                'userName' => $request['email'],
                'password' => $newPassword,
                'name' => $request['name'],
            ];

            Mail::to($user->email)->send(new \App\Mail\SupervisorInvitation($details));
            return response()->json([
                'message' => 'Coordinator successfully saved',
                'status' => 'success'
            ]);
        }

    } catch (\Exception $e) {

      return response()->json([
        'message' => $e->getMessage(),
        'status' => 'false'
      ], 400);
    }

  }

  public function getById(Request $request)
  {
    //$students = Student::first();
    $user = User::where('api_token', $request['api_token'])->first();

    $coordinator = Coordinator::Where('id', $request['id'])->first();

    return response()->json([
      'message' => $coordinator,
      'status' => 'success'
    ]);
  }

  public function getByToken(Request $request)
  {
    $user = User::where('api_token', $request['api_token'])->first();

    $coordinator = Coordinator::Where('user_id', $user->id)->first();

    return response()->json([
      'result' => $coordinator,
      'status' => 'success'
    ]);
  }

  public function getList(Request $request)
  {
      $user = User::where('api_token',$request['api_token'])->first();
      $perPage = $request['per_page'];
      $sortBy = $request['sort_by'];
      $sortType = $request['sort_type'];


      $coordinator = Coordinator::query();

      if ($request['name'] != '') {
          $coordinator->where('name', 'like', '%' . $request['name'] . '%');
      }

      return response()->json([
          'result' => $coordinator->get(),
          'status' => 'success'
      ]);
  }


  public function coordinatorDropdown(Request $request)
  {

    $department = Department::get();
    $designation = Designation::select('designation as name','designations.*')->get();

    $obj = (object)array(
      'department' => $department,
      'designation' => $designation
    );

    return response()->json([
      'result' => $obj,
      'message' => 'ok',
      'status' => 'success'
    ]);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   *
   * @param \App\Models\Coordinator $coordinator
   * @return \Illuminate\Http\Response
   */
  public function show(Coordinator $coordinator)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param \App\Models\Coordinator $coordinator
   * @return \Illuminate\Http\Response
   */
  public function edit(Coordinator $coordinator)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param \Illuminate\Http\Request $request
   * @param \App\Models\Coordinator $coordinator
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request)
  {
      $user = User::where('api_token',$request['api_token'])->first();

      $coordinator = Coordinator::where('id',$request['id'])
          ->first();

      if (empty($coordinator)) {
          return response()->json([
              'message' => 'Coordinator Not Found',
              'status' => 'error'
          ]);
      }


      $validate = Validator::make($request->all(), [
          'title'        => 'string',
          'name'        => 'required|string',
          'contact_number_home'       => 'required|unique:coordinators,contact_number_home,'.$coordinator->id.',id',
          'Designation'        => 'string',
          'Department'        => 'string',

      ]);

      if ($validate->fails()) {
          return response()->json([
              'message' => $validate->errors(),
              'status' => 'validation-error'
          ], 401);
      }

      $updateCoordinator = $coordinator->update([
          'title'        => $request['title'],
          'name'        => $request['name'],
          'contact_number_home'       => $request['contact_number_home'],
          'contact_number_office'       => $request['contact_number_office'],
          'Designation'     => $request['Designation'],
          'Department' => $request['Department'],

      ]);

      if($updateCoordinator){

          $user = User::Where('id',$coordinator->user_id)->first();

          $updateUser = $user->update([
              'name' => $request['name'],
          ]);

      }



      return response()->json([
          'message' => 'Coordinator successfully updated',
          'status' => 'success'
      ]);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param \App\Models\Coordinator $coordinator
   * @return \Illuminate\Http\Response
   */
  public function destroy(Request $request)
  {
      try {
          $user = User::where('api_token',$request['api_token'])->first();
          $coordinator = Coordinator::where('id',$request['id'])
              ->first();

          if (empty($coordinator)) {
              return response()->json([
                  'message' => 'Coordinator Not Found',
                  'status' => 'error'
              ]);
          }

          $deleteCoordinator = $coordinator->delete();

          if ($deleteCoordinator) {
              return response()->json([
                  'message' => 'Coordinator successfully deleted',
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
}
