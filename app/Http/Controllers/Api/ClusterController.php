<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;
class ClusterController extends Controller
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

        $validate = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $cluster = Cluster::create([
            'name'        => $request['name'],
        ]);


        return response()->json([
            'result' => $cluster,
            'message' => 'Cluster successfully saved',
            'status' => 'success',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Cluster  $cluster
     * @return \Illuminate\Http\Response
     */
    public function show(Cluster $cluster)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Cluster  $cluster
     * @return \Illuminate\Http\Response
     */
    public function edit(Cluster $cluster)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cluster  $cluster
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cluster $cluster)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Cluster  $cluster
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {

        try {
            $user = User::where('api_token',$request['api_token'])->first();
            $cluster = Cluster::where('id',$request['id'])
                //  ->where('id', $user->id)
                ->first();

            if (empty($cluster)) {
                return response()->json([
                    'message' => 'Cluster Not Found',
                    'status' => 'error'
                ]);
            }

            $deleteCluster = $cluster->delete();

            if ($deleteCluster) {
                return response()->json([
                    'message' => 'Cluster successfully deleted',
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
        //



    public function dropdown(Cluster $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


        $departments = department::get();
        $clusters = Cluster::get();

        $obj = (object) array('department' => $departments,'cluster' => $clusters);

        return response()->json([
            'message' => $obj,
            'status' => 'success'
        ]);
    }

    public function getList(Request $request)
    {
        //$students = Student::first();
        //$user = User::where('api_token',$request['api_token'])->first();

        $clusters = Cluster::query();

        if ($request['name'] != '') {
            $clusters->where('name', 'like', '%' . $request['name'] . '%');
        }

        $request=$clusters->get();

        return response()->json([
            'result' => $request,
            'message' =>'Ok',
            'status' => 'success'
        ]);
    }

}
