import Profile from "../components/student/Profile";

require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom'
import EditProfile from '../components/student/EditProfile'
import '../variables'
import {createStore} from 'redux';
import rootReducer from '../redux/reducers/index'
import { Provider, useDispatch, useSelector } from 'react-redux'
import rootAction from '../redux/actions/index'
import OrganizationForm from "../components/student/OrganizationForm";
import SupervisorForm from "../components/student/SupervisorForm";
import TrainingDiary from "../components/student/TrainingDiary";
import TrainingDiaryForm from "../components/student/TrainingDiaryForm";
import {saveStudentStateAttr} from "../redux/actions/studentAction";
import OrganizationList from "../components/admin/organization/OrganizationList";
import NewOrganization from "../components/admin/organization/OrganizationForm";
import SupervisorList from "../components/student/SupervisorList";
import StudentOrganizationList from "../components/student/OrganizationList";

import NewSupervisor from "../components/admin/supervisor/SupervisorForm";
import PasswordForm from "../components/student/ChangePassword";
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
            case 'EditProfile':
                return '/home';
            case 'TrainingDiary':
                return '/home';
            case 'EditTrainingDiary':
                return '/student/training-diary';
            case 'EditOrganization':
                return '/student/organization/list';
            case 'EditSupervisor':
                return '/supervisor/list';
            default:
                return '/home';
        }
    }

    useEffect(() => {
        loadDropdownData();
        getStudentByToken();
    }, []);

    const loadDropdownData = () => {
        axios.get('/api/v1/student/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveStudentStateAttr('dropdowns',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getStudentByToken = () => {
        axios.get('/api/v1/student/getByToken', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveStudentStateAttr('student',response.data.result));
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
							<Route exact path='/student/profile' > <Profile /> </Route>
							<Route path='/student/edit/:id' component={EditProfile} />
                            <Route path='/organization/edit/:id' ><OrganizationForm isEdit={true}/></Route>
                            <Route path='/student/organization/new' ><OrganizationForm isEdit={false}/></Route>
                            <Route path='/supervisor/edit/:id' ><SupervisorForm isEdit={true}/></Route>
                            <Route path='/student/supervisor/new' ><SupervisorForm isEdit={false}/></Route>
                            <Route exact path='/student/training-diary' ><TrainingDiary/></Route>
                            <Route path='/student/training-diary/edit/:id' ><TrainingDiaryForm  isEdit={true}/></Route>
                            <Route path='/student/organization/list' > <StudentOrganizationList /> </Route>


                            <Route path='/organization/list' > <OrganizationList /> </Route>
                            <Route path='/organization/new' > <OrganizationForm /> </Route>
                            <Route path='/supervisor/list' > <SupervisorList /> </Route>
                            <Route path='/supervisor/new' > <NewSupervisor /> </Route>
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
