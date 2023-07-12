import React, { useState, useEffect, useRef } from 'react'
import {connect, useDispatch, useSelector} from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory, useParams} from 'react-router-dom';
import externalSupervisorReducer from "../../redux/reducers/externalSupervisor";
import setActiveComponent from "../../redux/actions/setActiveComponent";
import {saveExternalSupervisorStateAttr} from "../../redux/actions/externalSupervisorAction";

function EditProfile(props) {
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {externalSupervisor} = useSelector(state => state.externalSupervisorReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [state, setState] = useState({
        // data: props.location.state.data ? props.location.state.data : '',
        data:  '',
        loading: false,
        authUser: props.authUserProp,
        name: '',
        designation:  '',
        qualification_id: '',
        contact_no_office: '',
        contact_no_home: '',
        email_work:  '',
        email:  '',
    });

    useEffect(()=>{
        getSupervisorById();
    },[])


    useEffect(()=>{
        if(externalSupervisor){
            setState({
                ...state,
                data:externalSupervisor,
                ...externalSupervisor
            })
        }
    },[externalSupervisor])

    const getSupervisorById = () => {
        axios.get('/api/v1/supervisor/getById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveExternalSupervisorStateAttr('externalSupervisor',response.data.message));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    let history = useHistory();
    const dropdowns = useSelector(state => state.externalSupervisorReducer.dropdowns);

    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
            autoForceUpdate: {forceUpdate: forceUpdate},
            className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    // useEffect(() => {
    //     document.title = 'Edit Profile';
    //
    //     props.setActiveComponentProp('EditProfile');
    // }, []);

    useEffect(()=>{
        document.title = 'Edit Profile';
        myDispatch(setActiveComponent('EditProfile'));
    },[])

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

            axios.post('/api/v1/supervisor/update', $(e.target).serialize())
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
                    getSupervisorById();
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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">EDIT PROFILE</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="name" name="name" placeholder="Name" value={state.name} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('name', state.name, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Designation</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" id="designation_id" name="designation_id" value={state.designation_id} onChange={onChangeHandle}>
                                                    {dropdowns?.designation && dropdowns?.designation.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Contact No Office</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-home"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="contact_no_office" name="contact_no_office" value={state.contact_no_office} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('contact_no_office', state.contact_no_office, 'required|phone')}
                                        </div>
                                        <div className="form-group">
                                            <label>Contact No Home</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                          <i className="mdi mdi-home"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="contact_no_home" name="contact_no_home" value={state.contact_no_home} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('contact_no_home', state.contact_no_home, 'required|phone')}
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address Work</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                         <i className="mdi mdi-email"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="email_work" name="email_work" placeholder="Email Address Work" value={state.email_work} onChange={onChangeHandle} />
                                                {simpleValidator.current.message('email_work', state.email_work, 'required|email_work')}
                                            </div>
                                        </div>
                                        {/*<div className="form-group">*/}
                                            {/*<label>Email Address Home</label>*/}
                                            {/*<div className="input-group input-group-sm">*/}
                                                {/*<div className="input-group-prepend">*/}
                                                    {/*<span className="input-group-text bg-gradient-success text-white">*/}
                                                         {/*<i className="mdi mdi-email"></i>*/}
                                                    {/*</span>*/}
                                                {/*</div>*/}
                                                {/*<input type="text" className="form-control form-control-sm" id="email" name="email" placeholder="Email Address Home" value={state.email} onChange={onChangeHandle} />*/}
                                                {/*/!*{simpleValidator.current.message('email', state.email, 'required|email')}*!/*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                        <div className="form-group">
                                            <label>Highest Education Qualification</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" id="qualification_id" name="qualification_id" value={state.qualification_id} onChange={onChangeHandle}>
                                                    {dropdowns?.qualification && dropdowns?.qualification.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        {/*<div className="form-group">*/}
                                            {/*<label>Educational Qualifications</label>*/}
                                            {/*<div style={{display:'flex',flexDirection:'column'}}>*/}
                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="professionalQualification" name="professionalQualification" value={state.professionalQualification} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; Professional*/}
                                                    {/*Qualification</label>*/}

                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="mPhil" name="mPhil" value={state.mPhil} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; MPhil</label>*/}

                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="msc" name="msc" value={state.msc} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; MSc</label>*/}

                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="mba" name="mba" value={state.mba} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; MBA</label>*/}

                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="bsc" name="bsc" value={state.bsc} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; B.Sc.</label>*/}

                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="higherDiploma" name="higherDiploma" value={state.higherDiploma} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; Higher Diploma</label>*/}

                                                {/*<label htmlFor="vehicle1"> <input style={{marginTop:4}}  type="checkbox"  id="al" name="al" value={state.al} onChange={onChangeHandle}/>*/}
                                                    {/*&nbsp; A/L</label>*/}


                                            {/*</div>*/}
                                        {/*</div>*/}
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
