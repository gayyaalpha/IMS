<?php

namespace App\Http\Controllers;

use App\Models\Cluster;
use App\Models\Coordinator;
use App\Models\Department;
use App\Models\Lead;
use App\Models\Role;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Util\Json;
use Redirect;
use Faker\Provider\Lorem;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $loggedUser=Auth::user();
        $userData = User::with('userRole.role')->where('id',$loggedUser->id)->first();

        if($userData->userRole){
            if($userData->userRole->role_id==='1'){ //1 is admin role
                return view('admin.dashboard');
            }elseif ($userData->userRole->role_id==='2'){ //1 is Student role
                return view('student.index');
            }elseif ($userData->userRole->role_id==='3'){ //1 is External Supervisor role
                $supervisors = Supervisor::where('user_id', $loggedUser->id )->first();
                if ($supervisors->status===1){
                    return view('externalSupervisor.index');
                }else{
                    return view('externalSupervisor.status_pending');
                }

            }elseif ($userData->userRole->role_id==='4'){ //1 is Internal Supervisor role
                return view('internalSupervisor.index');
            }elseif ($userData->userRole->role_id==='5'){ //1 is Coordinator role
                return view('coordinator.index');
            }elseif ($userData->userRole->role_id==='6'){ //1 is Guest role
                return view('externalSupervisor.status_pending');
            }else{
                return redirect(route('Login'));
            }
        }else{
            return view('externalSupervisor.status_pending');
        }
    }

    public function adminChangePassword(){
        return view('admin.change_password');
    }
    public function studentChangePassword(){
        $departments = Department::get();

        $obj = (object)array('department' => $departments);
        return view('student.change_password_student',['data'=>$obj]);
    }
    public function externalChangePassword(){
        $departments = Department::get();

        $obj = (object)array('department' => $departments);
        return view('externalSupervisor.change_password_external',['data'=>$obj]);
    }

    public function internalChangePassword(){
        $departments = Department::get();

        $obj = (object)array('department' => $departments);
        return view('internalSupervisor.change_password_internal',['data'=>$obj]);
    }

    public function coordinatorChangePassword(){
        $departments = Department::get();

        $obj = (object)array('department' => $departments);
        return view('coordinator.change_password_coordinator',['data'=>$obj]);
    }


    public function updatePassword(Request $request)
    {
        $loggedUser=Auth::user();
        $userData = User::with('userRole.role')->where('id',$loggedUser->id)->first();
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|min:5|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        if (!Hash::check($request->current_password, $loggedUser->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.'])->withInput();
        }

        $user = Auth::user();
        $user->password = bcrypt($request->password);
        $user->password_changed = 1;
        $user->save();



        if($userData->userRole){
            if ($userData->userRole->role_id==='2'){ //1 is Student role

                $student = Student::where('user_id',$loggedUser->id)->first();

                $updateStudent = $student->update([
                    'department'             => $request['department'],
                ]);

            }elseif ($userData->userRole->role_id==='4'){ //3 is Internal Supervisor role

                $supervisor = Supervisor::where('user_id',$loggedUser['id'])->first();

                $updateSupervisor = $supervisor->update([
                    'department_id'      => $request['department'],
                ]);


            }elseif ($userData->userRole->role_id==='5') { //5 is Coordinator role

                $coordinator = Coordinator::where('user_id',$loggedUser['id'])->first();

                $updateSupervisor = $coordinator->update([
                    'Department'      => $request['department'],
                ]);
            }
        }

        return redirect()->route('Dashboard')->with('success', 'Password changed successfully.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect(route('Login'));
    }

    public function sendMail(){
        $details = [
            'name'=>'Pradeep',
        ];

        try {
            Mail::to('pradeeprox95@gmail.com')->send(new \App\Mail\ReviewReminder($details));


            echo  "Success";
        } catch (Exception $ex) {
            // Debug via $ex->getMessage();
            echo "We've got errors!";
        }
    }
}
