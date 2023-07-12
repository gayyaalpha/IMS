import Profile from "../components/admin/Profile";

require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom'
import EditProfile from '../components/admin/EditProfile'
import '../variables'
import {createStore} from 'redux';
import rootReducer from '../redux/reducers/index'
import { Provider, useDispatch, useSelector } from 'react-redux'
import rootAction from '../redux/actions/index'
import OrganizationForm from "../components/admin/student/OrganizationForm";
import SupervisorForm from "../components/admin/student/SupervisorForm";
import {saveStudentStateAttr} from "../redux/actions/studentAction";
import StudentList from "../components/admin/student/StudentList";
import StudentForm from "../components/admin/student/StudentForm";
import InternalSupervisorList from "../components/admin/internalSupervisor/internalSupervisorList";
import InternalSupervisorForm from "../components/admin/internalSupervisor/internalSupervisorForm";
import OrganizationList from "../components/admin/organization/OrganizationList";
import NewOrganization from "../components/admin/organization/OrganizationForm";
import NewSupervisor from "../components/admin/supervisor/SupervisorForm";
import NewIntSupervisor from "../components/admin/internalSupervisor/internalSupervisorForm";
import SupervisorList from "../components/admin/supervisor/SupervisorList";
import {saveInternalSupervisorStateAttr} from "../redux/actions/internalSupervisorAction";
import CoordinatorForm from "../components/admin/coordinator/CoordinatorForm";
import CoordinatorList from "../components/admin/coordinator/CoordinatorList";
import ExSupervisorForm from "../components/admin/supervisor/SupervisorForm";
import PasswordForm from "../components/admin/ChangePassword";
import UserList from "../components/admin/user/UserList";
import UserForm from "../components/admin/user/UserForm";
import ClusterList from "../components/admin/Master/ClusterList";
import ClusterForm from "../components/admin/Master/ClusterForm";

import DepartmentList from "../components/admin/Master/departmentList";

import CodeList from "../components/admin/Master/codeList";
import CodeForm from "../components/admin/Master/CodeForm";

import DepartmentForm from "../components/admin/Master/DepartmentForm";

import TypeList from "../components/admin/Master/typeList";
import NewsList from "../components/admin/News/NewsList";
import TypeForm from "../components/admin/Master/TypeForm";
import DesignationList from "../components/admin/Master/DesignationList";
import DesignationForm from "../components/admin/Master/DesignationForm";
import NewNews from "../components/admin/News/NewsForm"
import {saveCoordinatorStateAttr} from "../redux/actions/coordinatorAction";
import {saveCommonStateAttr} from "../redux/actions/commonAction";
import News from "../components/shared/news/news";


//create reducer
const myStore = createStore(
	rootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


function App() {
	//set reducer
	const myDispatch = useDispatch();
	myDispatch(rootAction.setAuthUser(authUser)); //authUser is from blade file

	//get reducer
    const activeComponent = useSelector(state => state.activeComponentReducer);

    const getBackLink=()=>{
        switch (activeComponent) {
            case 'StudentList':
                return '/home';
            case 'EditStudent':
                return 'student/list';
            case 'AddStudent':
                return 'student/list';
            case 'OrganizationList':
                return '/home';
            case 'AddOrganization':
                return '/organization/list';
            case 'EditOrganization':
                return '/organization/list';
            case 'internalSupervisorList':
                return '/home';
            case 'EditInternalSupervisor':
                return '/internal-supervisor/list';
            case 'AddInternalSupervisor':
                return '/internal-supervisor/list';
            case 'SupervisorList':
                return '/home';
            case 'EditExternalSupervisor':
                return '/supervisor/list';
            case 'AddExternalSupervisor':
                return '/supervisor/list';
            case 'CoordinatorList':
                return '/home';
            case 'EditCoordinator':
                return '/coordinator/list';
            case 'NewCoordinator':
                return '/coordinator/list';
            case 'ClusterList':
                return '/home';
            case 'NewCluster':
                return '/cluster/list';
            case 'DepartmentList':
                return '/home';
            case 'NewDepartment':
                return '/department/list';
            case 'DesignationList':
                return '/home';
            case 'NewDesignation':
                return '/designation/list';
            case 'CodeList':
                return '/home';
            case 'NewCode':
                return '/code/list';
            case 'TypeList':
                return '/home';
            case 'NewType':
                return '/type/list';
            default:
                return '/home';
            // default:
                // return '/student/profile';
        }
    }

    useEffect(() => {
        loadDropdownData();
        getUserByToken();
    }, []);

    const loadDropdownData = () => {
        axios.get('/api/v1/supervisor/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveInternalSupervisorStateAttr('dropdowns',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getUserByToken = () => {
        axios.get('/api/v1/user/getUserByToken', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCommonStateAttr('user',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

	return (
		<React.Fragment>
			<BrowserRouter>
			<div className="page-header">
				<h3 className="page-title">
					<span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-folder-account"></i>
					</span>
                    {activeComponent &&  activeComponent.replace(/([A-Z])/g, ' $1').trim()}
				</h3>
				<nav aria-label="breadcrumb">
					{ activeComponent && activeComponent != 'Profile' ?
						<Link to={getBackLink()} className="btn btn-social-icon-text btn-linkedin"><i className="mdi mdi-arrow-left-bold btn-icon-prepend"></i>&nbsp; Back</Link> : false
					}

				</nav>
			</div>
			<div className="row">
				<div className="col-lg-12 grid-margin stretch-card">

						<Switch>
							<Route exact path='/home' > <Profile /> </Route>
                            <Route path='/user/edit-profile/:id' component={EditProfile} />
                            <Route path='/user/list' > <UserList /> </Route>
                            <Route path='/user/new' > <UserForm isEdit={false} /> </Route>
                            <Route path='/user/edit/:id' > <UserForm isEdit={true} /> </Route>
							<Route path='/student/list' > <StudentList /> </Route>
							{/*<Route path='/student/new' > <StudentForm isEdit={false} /> </Route>*/}
                            {/*<Route path='/student/edit/:id'  ><StudentForm isEdit={true}/></Route>*/}
                            <Route path='/student/organization/edit/:id' ><OrganizationForm isEdit={true}/></Route>
                            <Route path='/student/organization/new' ><OrganizationForm isEdit={false}/></Route>
                            <Route path='/student/supervisor/edit/:id' ><SupervisorForm isEdit={true}/></Route>
                            <Route path='/student/supervisor/new' ><SupervisorForm isEdit={false}/></Route>
                            <Route path='/internal-supervisor/list' > <InternalSupervisorList /> </Route>
                            <Route path='/internal-supervisor/new' > <InternalSupervisorForm isEdit={false}/> </Route>
							<Route path='/student/new' > <StudentForm isEdit={false} /> </Route>
                            <Route path='/student/edit/:id'  ><StudentForm isEdit={true}/></Route>
                            <Route path='/student/organization/edit/:id' ><OrganizationForm isEdit={true}/></Route>
                            <Route path='/student/organization/new' ><OrganizationForm isEdit={false}/></Route>
                            <Route path='/student/supervisor/edit/:id' ><SupervisorForm isEdit={true}/></Route>
                            <Route path='/student/supervisor/new' ><SupervisorForm isEdit={false}/></Route>

                            <Route path='/organization/list' > <OrganizationList /> </Route>
                            <Route path='/organization/new' > <NewOrganization isEdit={false}/> </Route>
                            <Route path='/supervisor/list' > <SupervisorList /> </Route>
                            <Route path='/supervisor/new' > <NewSupervisor /> </Route>
                            <Route path='/external-supervisor/edit/:id' ><ExSupervisorForm isEdit={true}/></Route>

                            <Route path='/internal-supervisor/edit/:id' ><InternalSupervisorForm isEdit={true}/></Route>
                            <Route path='/organization/edit/:id'  ><NewOrganization isEdit={true}/></Route>

                            <Route path='/coordinator/new' ><CoordinatorForm isEdit={false}/></Route>
                            <Route path='/coordinator/edit/:id' ><CoordinatorForm isEdit={true}/></Route>
                            <Route path='/coordinator/list' ><CoordinatorList /></Route>
                            <Route path='/user/change-password'  ><PasswordForm /></Route>

                            <Route path='/cluster/list' ><ClusterList /></Route>
                            <Route path='/cluster/new' ><ClusterForm /></Route>

                            <Route path='/department/list' ><DepartmentList /></Route>
                            <Route path='/department/new' ><DepartmentForm /></Route>

                            <Route path='/designation/list' ><DesignationList /></Route>
                            <Route path='/designation/new' ><DesignationForm /></Route>

                            <Route path='/code/list' ><CodeList /></Route>
                            <Route path='/code/new' ><CodeForm /></Route>

                            <Route path='/type/list' ><TypeList /></Route>
                            <Route path='/type/new' ><TypeForm /></Route>

                            <Route exact path='/news/new' > <NewNews isEdit={false} /> </Route>
                            <Route path='/news/edit/:id'  ><NewNews isEdit={true}/></Route>
                            <Route exact path='/news/list' ><NewsList /></Route>
                            <Route path='/news/:id'  ><News/></Route>


                        </Switch>

				</div>
			</div>
			</BrowserRouter>
		</React.Fragment>
	);
}

ReactDOM.render(
	<Provider store={myStore}>
		<App />
	</Provider>
, document.getElementById('app'))
