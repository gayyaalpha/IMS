import React, { useState, useEffect, useRef } from 'react'
import {connect, useDispatch, useSelector} from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import {Link, useHistory, useParams} from 'react-router-dom';
import OrganizationCard from "./OrganizationCard";
//import SupervisorCard from "./SupervisorCard";
import CreatableSelectInput from "../shared/formInput/CreatableSelect";
import {saveStudentStateAttr} from "../../redux/actions/studentAction";
import SelectInput from "../shared/formInput/Select";

function OrganizationForm(props) {
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {student,dropdowns,studentOrganization} = useSelector(state => state.studentReducer);
    const [state, setState] = useState({
        student:  {},
        data:  '',
        loading: false,
        authUser: props.authUserProp,
        isEdit: props.isEdit,
        registration_number:'',
        company:'',
        supervisor:'',
        date_of_inception:'',
    });

    let history = useHistory();

    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
            autoForceUpdate: {forceUpdate: forceUpdate},
            className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    useEffect(() => {
        if(props.isEdit){
            document.title = 'Edit Organization';

            props.setActiveComponentProp('EditOrganization');
            loadOrg();
        }else{
            document.title = 'Add Organization';

            props.setActiveComponentProp('AddOrganization');
        }
        if(!student){
            history.push('/student/list')
        }
    }, []);

    useEffect(()=>{
        if(student){
            setState({
                ...state,
                student: student
            });
        }
    },[student])

    useEffect(()=>{
        if(studentOrganization){
            console.log({studentOrganization})
            setState({
                ...state,
                registration_number:studentOrganization?.registration_number,
                date_of_inception:studentOrganization?.date_of_inception,
                company: {value:studentOrganization?.organization?.id,label:studentOrganization?.organization?.name},
                supervisor: {value:studentOrganization?.supervisor?.id,label:studentOrganization?.supervisor?.name}
            });
        }
    },[studentOrganization])

    const loadOrg=()=>{
        axios.get('/api/v1/student/getStudentOrganizationById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                myDispatch(saveStudentStateAttr('studentOrganization',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getStudentById = () => {
        axios.get('/api/v1/student/getById', {
            params: {
                api_token: authUser.api_token,
                id:student?.id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveStudentStateAttr('student',response.data.message));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

    const onSubmitHandle = (e) =>{
        e.preventDefault();

        const url=props.isEdit?'/api/v1/organizations/updateStudentsOrganizations':'/api/v1/organizations/AddStudentsOrganizations'

        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post(url, $(e.target).serialize())
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
                    history.push('/student/edit/'+student?.id)
                }
            })
            .catch((error) => {
                console.log(error);

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

    const renderSupervisor=()=>{
        if(props.isEdit){
            if(state.supervisor?.label){
                return <div>
                    <input type='hidden' value={state.supervisor?.label}/>
                    <SelectInput
                        params={{organization_id:state.company?.value}}
                        endpoint={'/api/v1/organizations/getOrganizationSupervisors'}
                        onChange={(item)=>{
                            console.log({item})
                            if(item){
                                setState({
                                    ...state,
                                    supervisor : item,
                                });
                            }else{
                                setState({
                                    ...state,
                                    supervisor : '',
                                });
                            }
                        }}
                        value={state.supervisor}
                    />
                </div>
            }else{
                return <div><SelectInput
                    params={{organization_id:state.company?.value}}
                    endpoint={'/api/v1/organizations/getOrganizationSupervisors'}
                    onChange={(item)=>{
                        console.log({item})
                        if(item){
                            setState({
                                ...state,
                                supervisor : item,
                            });
                        }else{
                            setState({
                                ...state,
                                supervisor : '',
                            });
                        }
                    }}
                    value={state.supervisor}
                /></div>
            }


        }else{
            return  <SelectInput
                params={{organization_id:state.company?.value}}
                endpoint={'/api/v1/organizations/getOrganizationSupervisors'}
                onChange={(item)=>{
                    console.log({item})
                    if(item){
                        setState({
                            ...state,
                            supervisor : item,
                        });
                    }else{
                        setState({
                            ...state,
                            supervisor : '',
                        });
                    }
                }}
                value={state.supervisor}
            />
        }


    }

    // debugger;
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
                                        <input type="hidden" name="id" value={studentOrganization?.id?studentOrganization?.id:""} />
                                        <input type="hidden" name="student_id" value={student.id?student.id:""} />
                                        <div style={{display:'none'}}>{JSON.stringify(state.student?.id)}</div>
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">{state?.isEdit? 'EDIT':'Add'} Organization</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Name of the Company</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-bank"></i>
                                                    </span>
                                                </div>
                                                <div style={{width:'96%'}}>
                                                    {props.isEdit ? <input type="text" value={state.company?.label} className="form-control form-control-sm" disabled={true} placeholder="Registration Number"/>

                                                        : <CreatableSelectInput
                                                        endpoint={'/api/v1/organizations/getList'}
                                                        onChange={(item)=>{
                                                            if(item){
                                                                setState({
                                                                    ...state,
                                                                    company : item,
                                                                    registration_number:item?.item?.registration_number
                                                                });
                                                            }else{
                                                                setState({
                                                                    ...state,
                                                                    company : '',
                                                                    registration_number:''
                                                                });
                                                            }
                                                        }}
                                                        onCreate={(item)=>{console.log({item})}}
                                                        value={state.company}
                                                    />}

                                                </div>
                                                <input type="hidden" name="organization_id" value={state.company?.value} />
                                                {/*<input type="text" className="form-control form-control-sm" id="companyName" name="companyName" placeholder="Name of the Company"*/}
                                                {/*value={state?.companyName} onChange={onChangeHandle}/>*/}
                                            </div>
                                            {simpleValidator.current.message('company', state?.company, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Registration number</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" disabled={props.isEdit} id="registration_number" name="registration_number" placeholder="Registration Number"
                                                value={state?.registration_number} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('registration_number', state?.registration_number, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Date of the inception of the training</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-calendar"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="date_of_inception" name="date_of_inception" placeholder="Date of the inception of the training"
                                                value={state?.date_of_inception} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('date_of_inception', state?.date_of_inception, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Supervisor</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-bank"></i>
                                                    </span>
                                                </div>
                                                <div style={{width:'96%'}}>
                                                    {renderSupervisor()}
                                                </div>
                                                <input type="hidden" name="supervisor_id" value={state.supervisor?.value} />
                                                {/*<input type="text" className="form-control form-control-sm" id="companyName" name="companyName" placeholder="Name of the Company"*/}
                                                {/*value={state?.companyName} onChange={onChangeHandle}/>*/}
                                            </div>
                                            {simpleValidator.current.message('supervisor', state?.supervisor, 'required')}
                                        </div>

                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">{state?.isEdit? 'Update':'Add'} </button>
                                            <Link to='/student/profile' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationForm)
