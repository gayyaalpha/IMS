<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/clearapp', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Session::flush();
    return redirect('/');
});


Route::group(['middleware' => ['guest', 'web']], function () {
    Route::get('/', 'AuthController@redirectToIndex');
    Route::get('/auth/redirect/{provider}', 'SocialiteLoginController@redirect');
    Route::get('/callback/{provider}', 'SocialiteLoginController@callback');
    //react route
    Route::get('/login', 'AuthController@index')->name('Login');
    Route::get('/registration', 'AuthController@index')->name('Registration');

    Route::post('/login', 'AuthController@login');
    Route::post('/registration', 'AuthController@signup');

});


Route::group(['middleware' => ['auth']], function () {
    Route::get('/password/change', 'HomeController@adminChangePassword')->name('adminPasswordChange');
    Route::post('/password/change', 'HomeController@updatePassword')->name('updatePassword');
    Route::get('/student/password/change', 'HomeController@studentChangePassword')->name('studentPasswordChange');
    Route::get('/external-supervisor/password/change', 'HomeController@externalChangePassword')->name('externalPasswordChange');
    Route::get('/internal-supervisor/password/change', 'HomeController@internalChangePassword')->name('internalPasswordChange');
    Route::get('/coordinator/password/change', 'HomeController@coordinatorChangePassword')->name('coordinatorPasswordChange');

});

Route::group(['middleware' => ['auth','password_changed']], function () {
    Route::get('/logout', 'HomeController@logout')->name('Logout');
    Route::get('/home', 'HomeController@index')->name('Dashboard');

    //react route
    Route::get('/user/list', 'HomeController@index')->name('UserList');
    Route::get('/user/new', 'HomeController@index')->name('NewUser');
    Route::get('/user/edit/{id}', 'HomeController@index')->name('EditUser');
    Route::get('/user/profile', 'HomeController@index')->name('UserProfile');
    Route::get('/user/edit-profile/{id}', 'HomeController@index')->name('editUserProfile');

    //react route
    Route::get('/lead/list', 'LeadController@index')->name('Leads');
    Route::get('/lead/new', 'LeadController@index')->name('NewLead');
    Route::get('/lead/edit/{id}', 'LeadController@index')->name('EditLead');

    //react route

    Route::get('/student/list', 'HomeController@index')->name('StudentsList');
    Route::get('/student/edit/{id}', 'HomeController@index')->name('EditStudent');
    Route::get('/student/organization/edit/{id}', 'HomeController@index')->name('EditOrganization');
    Route::get('/student/organization/new', 'HomeController@index')->name('AddOrganization');
    Route::get('/student/new', 'HomeController@index')->name('NewStudent');

    Route::get('/student/profile', 'HomeController@index')->name('Profile');
    Route::get('/student/training-diary', 'HomeController@index')->name('TrainingDiary');
    Route::get('/student/training-diary/edit/{id}', 'HomeController@index')->name('TrainingDiaryEdit');
    Route::get('/student/supervisor/edit/{id}', 'HomeController@index')->name('EditOrganization');
    Route::get('/student/supervisor/new', 'HomeController@index')->name('AddOrganization');
    Route::get('/student/organization/list', 'HomeController@index')->name('StudentOrganizationsList');


    Route::get('/internal-supervisor/profile', 'InternalSupervisorController@index')->name('InternalSupervisorProfile');


    Route::get('/external-supervisor/profile', 'ExternalSupervisorController@index')->name('ExternalSupervisorProfile');
    Route::get('/coordinator/profile', 'Coordinator@index')->name('CoordinatorProfile');

    Route::get('/external-supervisor/edit/{id}', 'ExternalSupervisorController@index')->name('EditSupervisor');
    Route::get('/admin/external-supervisor/edit/{id}', 'HomeController@index')->name('EditExternalSupervisor');

    Route::get('/internal-supervisor/edit/{id}', 'InternalSupervisorController@index')->name('EditSupervisor');
    Route::get('/admin/internal-supervisor/edit/{id}', 'HomeController@index')->name('EditInternalSupervisor');

    Route::get('/internal-supervisor/list', 'HomeController@index')->name('InternalSupervisorList');
    Route::get('/internal-supervisor/new', 'HomeController@index')->name('NewInternalSupervisor');

    Route::get('/organization/new', 'HomeController@index')->name('NewOrganization');
    Route::get('/organization/list', 'HomeController@index')->name('OrganizationsList');
    Route::get('/organization/edit/{id}', 'HomeController@index')->name('EditOrganization');


    Route::get('/supervisor/new', 'HomeController@index')->name('NewSupervisor');
    Route::get('/supervisor/list', 'HomeController@index')->name('SupervisorList');

    Route::get('/student/supervisor/new', 'HomeController@index')->name('NewExSupervisor');
    Route::get('/student/supervisor/list', 'HomeController@index')->name('ExSupervisorList');

    Route::get('/student/training-diary/{id}', 'HomeController@index')->name('TrainingDiarySupervisor');

    Route::get('/coordinator/new', 'HomeController@index')->name('NewCoordinator');
    Route::get('/coordinator/list', 'HomeController@index')->name('CoordinatorList');
    Route::get('/coordinator/edit/{id}', 'HomeController@index')->name('CoordinatorEdit');

    Route::get('/cluster/list', 'HomeController@index')->name('ClusterList');
    Route::get('/cluster/new', 'HomeController@index')->name('ClusterForm');

    Route::get('/department/list', 'HomeController@index')->name('DepartmentList');
    Route::get('/department/new', 'HomeController@index')->name('DepartmentForm');

    Route::get('/designation/list', 'HomeController@index')->name('DesignationList');
    Route::get('/designation/new', 'HomeController@index')->name('DesignationForm');

    Route::get('/code/list', 'HomeController@index')->name('CodeList');
    Route::get('/code/new', 'HomeController@index')->name('CodeForm');

    Route::get('/type/list', 'HomeController@index')->name('TypeList');
    Route::get('/type/new', 'HomeController@index')->name('TypeForm');

    Route::get('/news/new', 'HomeController@index')->name('NewsForm');
    Route::get('/news/edit/{id}', 'HomeController@index')->name('NewsFormEdit');
    Route::get('/news/{id}', 'HomeController@index')->name('News');
    Route::get('/news/list', 'HomeController@index')->name('NewsList');

    Route::get('/user/change-password', 'HomeController@index')->name('ChangePassword');

});

Route::get('/forget-password', 'PasswordResetController@showForgetPasswordForm')->name('forget.password.get');
Route::post('/forget-password', 'PasswordResetController@submitForgetPasswordForm')->name('forget.password.post');
Route::get('/reset-password/{token}','PasswordResetController@showResetPasswordForm')->name('reset.password.get');
Route::post('/reset-password', 'PasswordResetController@submitResetPasswordForm')->name('reset.password.post');


Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');

Route::get('/sendMail', 'HomeController@sendMail')->name('sendMail');

Route::get('/status-pending', function() {
    return view('externalSupervisor.status_pending');
})->name('statusPending');;

// Clear view cache:
Route::get('/queue-work', function() {
    Artisan::call('queue:work');
    return 'queue:work run';
});

// Clear view cache:
Route::get('/email/1', function() {
   $details=['userName'=>'pradeep@gmail.com','password'=>'test','name'=>'Pradeep'];
    return view('mail.student_invitation',['details'=>$details]);
});
