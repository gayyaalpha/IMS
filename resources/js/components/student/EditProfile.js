import React, { useState, useEffect, useRef } from 'react'
import {connect, useSelector} from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory } from 'react-router-dom';
import studentReducer from "../../redux/reducers/student";

function EditProfile(props) {
    const {student} = useSelector(state => state.studentReducer);
    const [state, setState] = useState({
        data: props.location.state.data ? props.location.state.data : '',
        loading: false,
        authUser: props.authUserProp,
        registration_number: '',
        name_with_initials: '',
        full_name: '',
        address: '',
        city:  '',
        contact_number_home: '',
        contact_number_mobile: '',
        // email:  '',
        department:  '',
        cluster:  '',
    });


    useEffect(()=>{
        if(student){
            setState({
                ...state,
                data:student,
                ...student
            })
        }
    },[student])

    let history = useHistory();
    const dropdowns = useSelector(state => state.studentReducer.dropdowns);

    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
            autoForceUpdate: {forceUpdate: forceUpdate},
            className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    useEffect(() => {
        document.title = 'Edit Profile';

        props.setActiveComponentProp('EditProfile');
    }, []);

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

            axios.post('/api/v1/student/update', $(e.target).serialize())
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
                    history.push('/home')
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
                                        <input type="hidden" name="user_id" value={state.authUser.id} />
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">EDIT PROFILE</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Registration Number</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="registration_number" name="registration_number" placeholder="Registration Number"
                                                value={state.registration_number} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('registration_number', state.registration_number, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Name with initials</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="name_with_initials" name="name_with_initials" placeholder="Name with initials" value={state.name_with_initials} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('name_with_initials', state.name_with_initials, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Name in Full</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                         <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="full_name" name="full_name" placeholder="nameInFull" value={state.full_name} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('full_name', state.full_name, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Address</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-home"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="address" name="address" placeholder="Address" value={state.address} onChange={onChangeHandle}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>City</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                          <i className="mdi mdi-home"></i>
                                                    </span>
                                                </div>
                                                <input type="text"  className="form-control form-control-sm" id="city" name="city" placeholder="City" value={state.city} onChange={onChangeHandle}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Contact Number Home</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                          <i className="mdi mdi-phone"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="contact_number_home" name="contact_number_home" value={state.contact_number_home} onChange={onChangeHandle}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Contact Number Mobile</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                          <i className="mdi mdi-phone"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="contact_number_mobile" name="contact_number_mobile" value={state.contact_number_mobile} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('contact_number_mobile', state.contact_number_mobile, 'required|phone')}
                                        </div>
                                        {/*<div className="form-group">*/}
                                            {/*<label>Email</label>*/}
                                            {/*<div className="input-group input-group-sm">*/}
                                                {/*<div className="input-group-prepend">*/}
                                                    {/*<span className="input-group-text bg-gradient-success text-white">*/}
                                                         {/*<i className="mdi mdi-email"></i>*/}
                                                    {/*</span>*/}
                                                {/*</div>*/}
                                                {/*<input type="text" className="form-control form-control-sm" id="email" name="email" placeholder="Email" value={state.email} onChange={onChangeHandle} />*/}
                                                {/*{simpleValidator.current.message('email', state.email, 'required|email')}*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                        <div className="form-group">
                                            <label>Department</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" id="department" name="department" value={state.department} onChange={onChangeHandle}>
                                                    {dropdowns?.department && dropdowns?.department.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Cluster</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" id="cluster" name="cluster" value={state.cluster} onChange={onChangeHandle}>
                                                    {dropdowns?.cluster && dropdowns?.cluster.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Update</button>
                                            <Link to='/home' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
