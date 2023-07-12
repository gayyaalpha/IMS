import Profile from "../components/coordinator/Profile";

require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom'
import EditProfile from '../components/coordinator/EditProfile'
import '../variables'
import {createStore} from 'redux';
import rootReducer from '../redux/reducers/index'
import { Provider, useDispatch, useSelector } from 'react-redux'
import rootAction from '../redux/actions/index'
import OrganizationForm from "../components/admin/student/OrganizationForm";
import SupervisorForm from "../components/admin/student/SupervisorForm";
import StudentList from "../components/admin/student/StudentList";
import StudentForm from "../components/admin/student/StudentForm";
import InternalSupervisorList from "../components/admin/internalSupervisor/internalSupervisorList";
import InternalSupervisorForm from "../components/admin/internalSupervisor/internalSupervisorForm";
import OrganizationList from "../components/admin/organization/OrganizationList";
import NewOrganization from "../components/admin/organization/OrganizationForm";
import NewSupervisor from "../components/admin/supervisor/SupervisorForm";
import NewIntSupervisor from "../components/admin/internalSupervisor/internalSupervisorForm";
import SupervisorList from "../components/admin/supervisor/SupervisorList"
import ExSupervisorForm from "../components/admin/supervisor/SupervisorForm";
import PasswordForm from "../components/coordinator/ChangePassword";
import TypeForm from "../components/admin/Master/TypeForm";
import {saveCoordinatorStateAttr} from "../redux/actions/coordinatorAction";
import News from "../components/shared/news/news";
// import authUser from "../redux/reducers/authUser";

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
            case 'Profile':
                return '/home';
            case 'StudentList':
                return '/home';
            case 'EditStudent':
                return 'student/list';
            case 'AddStudent':
                return 'student/list';
            case 'internalSupervisorList':
                return '/home';
            case 'EditSupervisor':
                return '/internal-supervisor/list';
            case 'AddSupervisor':
                return '/internal-supervisor/list';
            case 'SupervisorList':
                return '/home';
            case 'EditSupervisor':
                return '/supervisor/list';
            case 'AddSupervisor':
                return '/supervisor/list';
            case 'EditTrainingDiary':
                return '/student/training-diary';
            default:
                return '/home';
        }
    }

    useEffect(() => {
        loadDropdownData();
        getCoordinatorByToken();
    }, []);

    const loadDropdownData = () => {
        axios.get('/api/v1/coordinator/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveCoordinatorStateAttr('dropdowns',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getCoordinatorByToken = () => {
        axios.get('/api/v1/coordinator/getByToken', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCoordinatorStateAttr('coordinator',response.data.result));
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
                            <Route path='/coordinator/profile' > <Profile /> </Route>
                            <Route path='/coordinator/edit/:id' component={EditProfile} />
							<Route path='/student/list' > <StudentList /> </Route>
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
                            <Route path='/organization/new' > <NewOrganization /> </Route>
                            <Route path='/supervisor/list' > <SupervisorList /> </Route>
                            <Route path='/supervisor/new' > <NewSupervisor /> </Route>
                            <Route path='/external-supervisor/edit/:id' ><ExSupervisorForm isEdit={true}/></Route>
                            <Route path='/internal-supervisor/edit/:id' ><InternalSupervisorForm isEdit={true}/></Route>
                            <Route path='/organization/edit/:id'  ><NewOrganization isEdit={true}/></Route>
                            <Route path='/user/change-password'  ><PasswordForm /></Route>
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
