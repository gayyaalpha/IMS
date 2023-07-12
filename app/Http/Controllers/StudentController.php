<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        return view('student.index');
    }
}
