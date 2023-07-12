import Profile from "../components/internalSupervisor/Profile";

require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom'
import EditProfile from '../components/internalSupervisor/EditProfile'
import '../variables'
import {createStore} from 'redux';
import rootReducer from '../redux/reducers/index'
import { Provider, useDispatch, useSelector } from 'react-redux'
import rootAction from '../redux/actions/index'
import {saveInternalSupervisorStateAttr} from "../redux/actions/internalSupervisorAction";
import StudentList from "../components/internalSupervisor/StudentList";
import StudentForm from "../components/internalSupervisor/StudentForm";
import OrganizationForm from "../components/internalSupervisor/OrganizationForm";
import TrainingDiary from "../components/internalSupervisor/TrainingDiary";
import TrainingDiaryForm from "../components/internalSupervisor/TrainingDiaryForm";
import PasswordForm from "../components/internalSupervisor/ChangePassword";
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
            case 'StudentList':
                return '/home';
            case 'EditStudent':
                return '/student/list';
            case 'TrainingDiary':
                return '/student/list';
            case 'AddReview':
                return '/student/training-diary';
            case 'ChangePassword':
                return '/home';
            default:
                return '/home';
        }
    }

    useEffect(() => {
        loadDropdownData();
        getSupervisorByToken();
        loadStudentDropdownData();
    }, []);

    const loadDropdownData = () => {
        axios.get('/api/v1/supervisor/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveInternalSupervisorStateAttr('dropdowns', response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const loadStudentDropdownData = () => {
        axios.get('/api/v1/student/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveInternalSupervisorStateAttr('student_dropdowns', response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getSupervisorByToken = () => {
        axios.get('/api/v1/supervisor/getByToken', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveInternalSupervisorStateAttr('internalSupervisor',response.data.result));
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
							<Route path='/internal-supervisor/profile' > <Profile /> </Route>
							<Route path='/internal-supervisor/edit/:id' component={EditProfile} />
                            <Route path='/student/list' > <StudentList /> </Route>
                            <Route path='/student/edit/:id' > <StudentForm isEdit={true} /> </Route>
                            <Route path='/student/new' > <StudentForm isEdit={false} /> </Route>
                            <Route path='/student/organization/edit/:id' ><OrganizationForm isEdit={true}/></Route>
                            <Route path='/student/organization/new' ><OrganizationForm isEdit={false}/></Route>
                            <Route exact path='/student/training-diary' ><TrainingDiary/></Route>
                            <Route exact path='/student/training-diary/:id'  ><TrainingDiary /></Route>
                            <Route path='/student/training-diary/edit/:id'  ><TrainingDiaryForm /></Route>
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
    , document.getElementById('app'));
