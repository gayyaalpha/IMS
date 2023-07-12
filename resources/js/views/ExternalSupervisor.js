import Profile from "../components/externalSupervisor/Profile";

require('../app');
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom'
import EditProfile from '../components/externalSupervisor/EditProfile'
import '../variables'
import {createStore} from 'redux';
import rootReducer from '../redux/reducers/index'
import { Provider, useDispatch, useSelector } from 'react-redux'
import rootAction from '../redux/actions/index'
import {saveExternalSupervisorStateAttr} from "../redux/actions/externalSupervisorAction";
import StudentList from "../components/externalSupervisor/StudentList";
import StudentForm from "../components/externalSupervisor/StudentForm";
import TrainingDiary from "../components/externalSupervisor/TrainingDiary";
import TrainingDiaryForm from "../components/externalSupervisor/TrainingDiaryForm";
import PasswordForm from "../components/externalSupervisor/ChangePassword";
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
            case 'EditStudent':
                return '/student/list';
            case 'Student':
                return '/home';
            case 'TrainingDiary':
                return '/student/list';
            case 'AddReview':
                return '/student/training-diary';
            // case 'EditReview':
            //     return '/student/training-diary';
            default:
                return '/home';

        }
    }

    useEffect(() => {
        loadDropdownData();
        getSupervisorByToken();
    }, []);

    const loadDropdownData = () => {
        axios.get('/api/v1/supervisor/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveExternalSupervisorStateAttr('dropdowns', response.data.result));
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
                myDispatch(saveExternalSupervisorStateAttr('externalSupervisor',response.data.result));
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
							<Route path='/external-supervisor/profile' > <Profile /> </Route>
							<Route path='/external-supervisor/edit/:id' component={EditProfile} />
                            <Route path='/student/list' > <StudentList /> </Route>
                            <Route path='/student/edit/:id'  ><StudentForm isEdit={true} /></Route>
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
