<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Validator;

class AuthController extends Controller
{
    public function index(Request $request)
    {
        return view('admin.login');
    }



    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $credentials = request(['email', 'password']);

        if(!Auth::guard('users')->attempt($credentials))
            return response()->json([
                'message' => 'Invalid email or password',
                'status' => 'error'
            ], 401);
        $user = $request->user();

        return response()->json([
            'result' => $user,
            'status' => 'success',
            'message' => 'Success',
        ], 201);
    }


    public function user(Request $request)
    {
        return response()->json([
            'message' => $request->user(),
            'status' => 'success'
        ]);
    }
}
