<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Validator,Redirect,Response,File;

use App\User;

class SocialiteLoginController extends Controller
{

    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider)
    {

        $getInfo = Socialite::driver($provider)->user();

        $user = $this->createUser($getInfo,$provider);

        auth()->login($user);


        return redirect()->to('/home');

    }
    function createUser($getInfo,$provider){

        $user = \App\User::where('provider_id', $getInfo->id)->first();

        if (!$user) {
            $user = \App\Models\User::create([
                'name'     => $getInfo->name,
                'email'    => $getInfo->email,
                'provider' => $provider,
                'provider_id' => $getInfo->id,
                'password' => bcrypt(Str::random(8)),
                'api_token' => Str::random(80),
                'password_changed' => 1,
            ]);
            $token = Str::random(80);

            $user->forceFill([
                'api_token' => hash('sha256', $token),
            ])->save();

            $user_role = UserRole::create([
                'user_id' => $user->id,
                'role_id' => "6"
            ]);
        }
        return $user;
    }
}
