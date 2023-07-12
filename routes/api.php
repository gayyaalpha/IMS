<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function () {
    Route::get('/user/list', 'Api\HomeController@getUsers');
    Route::post('/user/create', 'Api\HomeController@userCreate');
    Route::post('/user/update', 'Api\HomeController@userUpdate');
    Route::get('/user/getById', 'Api\HomeController@userGetById');
    Route::post('/user/destroy', 'Api\HomeController@deleteUser');
    Route::get('/admin/dropdown', 'Api\HomeController@dropdown');

    Route::get('/lead/list', 'Api\LeadController@listData');
    Route::post('/lead/create', 'Api\LeadController@create');
    Route::post('/lead/update', 'Api\LeadController@update');
    Route::post('/lead/destroy', 'Api\LeadController@destroy');

    Route::get('/dashboard-data', 'Api\HomeController@getData');

    Route::get('/student/list', 'Api\StudentController@getList');
    Route::post('/student/create', 'Api\StudentController@create');
    Route::post('/student/bulkUpload', 'Api\StudentController@bulkUpload');
    Route::post('/student/update', 'Api\StudentController@update');
    Route::post('/student/destroy', 'Api\StudentController@destroy');
    Route::get('/student/getById', 'Api\StudentController@getById');
    Route::get('/student/getByToken', 'Api\StudentController@getByToken');
    Route::get('/student/getStudentOrganizations', 'Api\StudentController@getStudentOrganizations');
    Route::delete('/student/deleteStudentOrganization', 'Api\StudentController@deleteStudentOrganization');
    Route::post('/student/AddStudentSupervisors', 'Api\StudentController@AddStudentSupervisors');
    Route::get('/student/getStudentSupervisors', 'Api\StudentController@getStudentSupervisors');
    Route::get('/student/getStudentOrganizationById', 'Api\StudentController@getStudentOrganizationById');
    Route::get('/student/getStudentTrainingDiariesList', 'Api\StudentController@getStudentTrainingDiariesList');
    Route::get('/student/getStudentTrainingDiariesById', 'Api\StudentController@getStudentTrainingDiariesById');
    Route::post('/student/updateTrainingDiaryById', 'Api\StudentController@updateTrainingDiaryById');
    Route::post('/student/submitForReview', 'Api\StudentController@submitForReview');
    Route::get('/student/getStudentOrganization', 'Api\StudentController@getStudentOrganization');
    Route::post('/student/studentCreateSupervisor', 'Api\StudentController@studentCreateSupervisor');
    Route::post('/student/getTrainingDiariesReviews', 'Api\StudentController@getTrainingDiariesReviews');
    Route::post('/student/organizations/create', 'Api\StudentController@organizationCreate');
    Route::post('/student/organizations/update', 'Api\StudentController@organizationUpdate');
    Route::get('/student/supervisor/externalList', 'Api\StudentController@getExternalSupervisorList');
    Route::get('/student/supervisor/studentExternalList', 'Api\StudentController@getStudentExternalList');
    Route::get('/student/supervisor/dropdown', 'Api\StudentController@supervisorDropdown');
    Route::get('/student/setStudentOrganizationActive', 'Api\StudentController@setStudentOrganizationActive');
    Route::get('/student/setStudentSupervisorActive', 'Api\StudentController@setStudentSupervisorActive');
    Route::post('/student/deleteStudentOrganization', 'Api\StudentController@deleteStudentOrganization');
    Route::post('/student/deleteStudentSupervisor', 'Api\StudentController@deleteStudentSupervisor');

    Route::post('/admin/internalSupervisorAddStudent', 'Api\SupervisorController@AssignStudnetToInternalSupervisor');
    Route::post('/profile/imageUpload', 'Api\HomeController@profileImageUpload');


    Route::get('/supervisor/List', 'Api\SupervisorController@getList');
    Route::get('/supervisor/getInternalList', 'Api\SupervisorController@getInternalList');
    Route::get('/supervisor/getExternalList', 'Api\SupervisorController@getExternalList');
    Route::post('/supervisor/create', 'Api\SupervisorController@create');
    Route::post('/supervisor/createExternalSupervisor', 'Api\SupervisorController@createExternalSupervisor');
    Route::post('/supervisor/update', 'Api\SupervisorController@update');
    Route::post('/supervisor/approveExternalSupervisor', 'Api\SupervisorController@approveExternalSupervisor');
    Route::post('/supervisor/destroy', 'Api\SupervisorController@destroy');
    Route::get('/supervisor/searchSupervisor', 'Api\SupervisorController@searchSupervisor');
    Route::get('/supervisor/sendMail', 'Api\SupervisorController@sendMail');

    Route::get('/supervisor/getByToken', 'Api\SupervisorController@getByToken');
    Route::get('/supervisor/getById', 'Api\SupervisorController@getById');
    Route::get('/supervisor/getStudentSupervisor', 'Api\SupervisorController@getStudentSupervisor');
    Route::get('/supervisor/getInternalSupervisorStudentList', 'Api\SupervisorController@getSupervisorStudentList');
    Route::post('/student/updateTrainingDate', 'Api\StudentController@updateTrainingDate');
    Route::get('/supervisor/getSupervisorStudentList', 'Api\SupervisorController@getSupervisorStudentList');
    Route::get('/supervisor/getExternalSupervisorStudentList', 'Api\SupervisorController@getExternalSupervisorStudentList');
    Route::post('externalSupervisor/submitForReview', 'Api\SupervisorController@externalSupervisorSubmitForReview');
    Route::post('externalSupervisor/submitDayReview', 'Api\SupervisorController@externalSupervisorSubmitDayReview');
    Route::post('internalSupervisor/submitForReview', 'Api\SupervisorController@internalSupervisorSubmitForReview');
    Route::post('internalSupervisor/submitDayReview', 'Api\SupervisorController@internalSupervisorSubmitDayReview');




    Route::get('/role/list', 'Api\RoleController@getList');

    Route::get('/cluster/dropdown', 'Api\ClusterController@dropdown');
    Route::get('/student/dropdown', 'Api\StudentController@dropdown');
    Route::get('/supervisor/dropdown', 'Api\SupervisorController@dropdown');

    Route::get('/organizations/getList', 'Api\OrganizationsController@getList');
    Route::post('/organizations/create', 'Api\OrganizationsController@create');
    Route::get('/organizations/getById', 'Api\OrganizationsController@getById');
    Route::post('/organizations/update', 'Api\OrganizationsController@update');
    Route::post('/organizations/AddStudentsOrganizations', 'Api\OrganizationsController@AddStudentsOrganizations');
    Route::post('/organizations/updateStudentsOrganizations', 'Api\OrganizationsController@UpdateStudentsOrganizations');
    Route::post('/organizations/AddOrganizationSupervisors', 'Api\OrganizationsController@AddOrganizationSupervisors');
    Route::get('/organizations/getOrganizationSupervisors', 'Api\OrganizationsController@getOrganizationSupervisors');
    Route::post('/organizations/deleteOrganization', 'Api\OrganizationsController@deleteOrganization');

    Route::get('/coordinator/list', 'Api\CoordinatorController@getList');
    Route::post('/coordinator/create', 'Api\CoordinatorController@create');
    Route::get('/coordinator/getById', 'Api\CoordinatorController@getById');
    Route::get('/coordinator/getByToken', 'Api\CoordinatorController@getByToken');
    Route::get('/coordinator/dropdown', 'Api\CoordinatorController@coordinatorDropdown');
    Route::post('/coordinator/update', 'Api\CoordinatorController@update');
    Route::post('/coordinator/destroy', 'Api\CoordinatorController@destroy');
    Route::get('/cluster/list', 'Api\ClusterController@getList');
    Route::post('/cluster/create', 'Api\ClusterController@create');
    Route::post('/cluster/destroy', 'Api\ClusterController@destroy');


    Route::get('/designation/list', 'Api\HomeController@getDesignationList');
    Route::post('/designation/create', 'Api\HomeController@createDesignation');
    Route::post('/designation/destroy', 'Api\HomeController@destroyDesignation');

    Route::get('/department/list', 'Api\HomeController@getDepartmentList');
    Route::post('/department/create', 'Api\HomeController@createDepartment');
    Route::post('/department/destroy', 'Api\HomeController@destroyDepartment');

    Route::get('/code/list', 'Api\HomeController@getCodeList');
    Route::post('/code/create', 'Api\HomeController@createCode');
    Route::post('/code/destroy', 'Api\HomeController@destroyCode');

    Route::get('/type/list', 'Api\HomeController@getTypeList');
    Route::post('/type/create', 'Api\HomeController@createType');
    Route::post('/type/destroy', 'Api\HomeController@destroyType');

    Route::get('/news/list', 'Api\NewsController@getNewsList');
    Route::post('/news/create', 'Api\NewsController@createNews');
    Route::post('/news/destroy', 'Api\NewsController@destroyNews');
    Route::post('/news/update', 'Api\NewsController@updateNews');
    Route::get('/news/getNewsById', 'Api\NewsController@getNewsById');

    Route::get('/user/getUserByToken', 'Api\HomeController@getUserByToken');
    Route::post('/user/updatePassword', 'Api\HomeController@updatePassword');


});

Route::post('/upload/news/image', 'Api\NewsController@uploadImage');

//Route::post('login', function (){
//
//    $user=array('name'=>'pradeep','email'=>'pradeep@test.com');
//    $obj = (object) array('user' => $user,'token' => Str::random(80));
//    return json_encode($obj);
//
//});
Route::post('/login', 'Api\AuthController@login')->name('Login');

Route::get('user', function (){

    $user=array('name'=>'pradeep','email'=>'pradeep@test.com');
    return json_encode($user);

});

Route::post('logout', function (){

    $user=array('name'=>'pradeep','email'=>'pradeep@test.com');
    return json_encode($user);

});

