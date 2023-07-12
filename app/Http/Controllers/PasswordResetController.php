<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function showForgetPasswordForm()
    {
        return view('forgetPassword');
    }

    public function submitForgetPasswordForm(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $token = Str::random(80);


        $passwordReset = PasswordReset::create([
            'email' => $request->email,
            'token' => $token,
        ]);

        Mail::send('mail.forgetPassword', ['token' => $token], function($message) use($request){
            $message->to($request->email);
            $message->subject('Reset Password');
        });

        return back()->with('message', 'We have e-mailed your password reset link!');
    }

    public function showResetPasswordForm($token) {
        return view('forgetPasswordLink', ['token' => $token]);
    }

    public function submitResetPasswordForm(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|string|min:5|confirmed',
            'password_confirmation' => 'required'
        ]);

        $updatePassword = PasswordReset::where(['email' => $request->email, 'token' => $request->token])->first();

        if(!$updatePassword){
            return back()->withInput()->with('error', 'Invalid token!');
        }

        $user = User::where('email', $request->email)->first();

        $updateUser = $user->update([
            'password' => bcrypt($request['password']),
        ]);

        if($updateUser){

            $passwordReset = PasswordReset::where('email',$request['email'])->first();

            $deletePasswordReset = $passwordReset->delete();

        }

        return redirect('/login')->with('message', 'Your password has been changed!');
    }
}
