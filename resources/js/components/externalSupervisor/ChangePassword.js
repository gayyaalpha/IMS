import React, { useState, useEffect, useRef } from 'react'
import {connect, useDispatch, useSelector} from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory, useParams } from 'react-router-dom';
import {saveCommonStateAttr} from "../../redux/actions/commonAction";
import commonReducer from "../../redux/reducers/common";
import setActiveComponent from "../../redux/actions/setActiveComponent";
//import {saveInternalSupervisorStateAttr} from "../../redux/actions/internalSupervisorAction";

function PasswordForm(props) {
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {user} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [state, setState] = useState({
        data:  'user',
        loading: false,
        authUser: props.authUserProp,
        password: '',
        password_confirmation: '',
    });

    useEffect(()=>{
        getUserByToken();
    },[])

    useEffect(()=>{
        document.title = 'Change Password';
        myDispatch(setActiveComponent('ChangePassword'));
    },[])


    useEffect(()=>{
        if(user){
            setState({
                ...state,
                data:user,
                ...user
            })
        }
    },[user])

    const getUserByToken = () => {
        axios.get('/api/v1/user/getUserByToken', {
            params: {
                api_token: authUser.api_token,
                id:id
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

    let history = useHistory();

    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
        autoForceUpdate: {forceUpdate: forceUpdate},
        className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

    const onSubmitHandle = (e) =>{
        e.preventDefault();

        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/user/updatePassword', $(e.target).serialize())
                .then(response => {
                    setState({
                        ...state,
                        loading: false
                    });
                    if (response.data.status == 'validation-error') {
                        var errorArray = response.data.message;
                        $.each( errorArray, function( key, errors ) {
                            $.each( errors, function( key, errorMessage ) {
                                showSznNotification({
                                    type : 'error',
                                    message : errorMessage
                                });
                            });
                        });
                    } else if (response.data.status == 'error') {
                        showSznNotification({
                            type : 'error',
                            message : response.data.message
                        });
                    } else if (response.data.status == 'success') {
                        showSznNotification({
                            type : 'success',
                            message : response.data.message
                        });
                        history.push('/external-supervisor/profile')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
                    setState({
                        ...state,
                        loading: false
                    });
                    if (error.response.data.status == 'validation-error') {
                        var errorArray = error.response.data.message;
                        $.each( errorArray, function( key, errors ) {
                            $.each( errors, function( key, errorMessage ) {
                                showSznNotification({
                                    type : 'error',
                                    message : errorMessage
                                });
                            });
                        });
                    } else if (error.response.data.status == 'error') {
                        showSznNotification({
                            type : 'error',
                            message : error.response.data.message
                        });
                    }
                });
        } else {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        }

    }

    return (
        <React.Fragment>

            <div className="card animated fadeIn">
                <div className="card-body">
                    <div className="row new-lead-wrapper d-flex justify-content-center">
                        <div className="col-md-8 ">
                            <LoadingOverlay
                                active={state.loading}
                                spinner={<BeatLoader />}
                                styles={{
                                    overlay: (base) => ({
                                        ...base,
                                        opacity: '0.5',
                                        filter: 'alpha(opacity=50)',
                                        background: 'white'
                                    })
                                }}
                            >
                                <form className="edit-lead-form border" onSubmit={onSubmitHandle}>
                                    <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                    <input type="hidden" name="id" value={state.data.id} />
                                    <div className="form-group">
                                        <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                            <li className="nav-item">
                                                <span className="nav-link btn btn-gradient-primary btn-block active">CHANGE PASSWORD</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                            </div>
                                            <input type="password" className="form-control form-control-sm" id="password" name="password"  placeholder="New Password" value={state.password} onChange={onChangeHandle}/>
                                        </div>
                                        {simpleValidator.current.message('password', state.password, 'required')}
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                            </div>
                                            <input type="password" className="form-control form-control-sm" id="password" name="password_confirmation" placeholder="Confirm Password" value={state.password_confirmation} onChange={onChangeHandle}/>
                                        </div>
                                        {simpleValidator.current.message('password_confirmation', state.password_confirmation, 'required')}
                                    </div>
                                    <div className="form-group text-center">
                                        <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Save</button>
                                        <Link to='/external-supervisor/profile' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                    </div>
                                </form>
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    return {
        authUserProp: state.authUserReducer,
        activeComponentProp: state.activeComponentReducer,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setAuthUserProp: (user) => dispatch(setAuthUser(user)),
        setActiveComponentProp: (component) => dispatch(rootAction.setActiveComponent(component))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordForm)
