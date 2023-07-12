<?php

namespace App\Http\Middleware;

use App\Models\Supervisor;
use App\Models\User;
use Closure;
use Illuminate\Support\Facades\Auth;

class ForcePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (! $request->user()->password_changed) {
            $loggedUser=Auth::user();
            $userData = User::with('userRole.role')->where('id',$loggedUser->id)->first();

            if($userData->userRole){
                if($userData->userRole->role_id==='1'){ //1 is admin role
                    return redirect()->route('adminPasswordChange');
                }elseif ($userData->userRole->role_id==='2'){ //1 is Student role
                    return redirect()->route('studentPasswordChange');
                }elseif ($userData->userRole->role_id==='3'){ //1 is External Supervisor role
                    return redirect()->route('externalPasswordChange');

                }elseif ($userData->userRole->role_id==='4'){ //1 is Internal Supervisor role
                    return redirect()->route('internalPasswordChange');
                }elseif ($userData->userRole->role_id==='5'){ //1 is Coordinator role
                    return redirect()->route('coordinatorPasswordChange');
                }elseif ($userData->userRole->role_id==='6'){ //1 is Guest role
                    return redirect()->route('GuestPasswordChange');
                }else{
                    return view('externalSupervisor.status_pending');
                }
            }else{
                return view('externalSupervisor.status_pending');
            }

//            return redirect()->route('passwordChange');
        }

        return $next($request);
    }
}
