@section('title')
    Home
@endsection

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/Leads.css') }}">
@endsection

@extends('admin.layout.master')

@section('container')
    <div id="app"></div>
@endsection

@section('scripts')
    <script>
        var authUser = @json(Auth::user());
    </script>
    <script src="{{ asset('js/views/Admin.js') }}"></script>
@endsection
