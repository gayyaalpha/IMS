<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        return view('admin.dashboard');
    }
}
