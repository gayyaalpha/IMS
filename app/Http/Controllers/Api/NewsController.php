<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class NewsController extends Controller
{
    public function getNewsList(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();
        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];


        $news = News::query();

        if ($request['name'] != '') {
            $news->where('title', 'like', '%' . $request['name'] . '%');
        }

        return response()->json([
            'result' => $news->get(),
            'status' => 'success'
        ]);
    }

    public function createNews(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $validate = Validator::make($request->all(), [
            'description' => 'required|string',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

        $news = News::create([
            'title' => $request['title'],
            'description' => $request['description'],
            'author' => $request['author'],
        ]);

        return response()->json([
            'result' => $news,
            'message' => 'News has Successfully Created',
            'status' => 'success'
        ]);
    }

    public function destroyNews(Request $request)
    {
        try {
            $user = User::where('api_token',$request['api_token'])->first();
            $news = News::where('id',$request['id'])
                ->first();

            if (empty($news)) {
                return response()->json([
                    'message' => 'News Not Found',
                    'status' => 'error'
                ]);
            }

            $deleteNews = $news->delete();

            if ($deleteNews) {
                return response()->json([
                    'message' => 'News successfully deleted',
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

    public function getNewsById(Request $request)
    {
        $user = User::where('api_token', $request['api_token'])->first();

        $news = News::Where('id', $request['id'])->first();

        return response()->json([
            'message' => $news,
            'status' => 'success'
        ]);
    }

    public function updateNews(Request $request)
    {
        $user = User::where('api_token',$request['api_token'])->first();

        $news = News::where('id',$request['id'])
            ->first();

        if (empty($news)) {
            return response()->json([
                'message' => 'Not Found',
                'status' => 'error'
            ]);
        }

        $updateNews = $news->update([
            'title'        => $request['title'],
            'description'        => $request['description'],
            'author'       => $request['author'],

        ]);

        return response()->json([
            'message' => 'Successfully updated',
            'status' => 'success'
        ]);
    }
}
