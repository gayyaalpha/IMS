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
import SupervisorCard from "./SupervisorCard";
import CreatableSelectInput from "../shared/formInput/CreatableSelect";
import {saveCommonStateAttr} from "../../redux/actions/commonAction";

function OrganizationForm(props) {
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {organization,dropdowns} = useSelector(state => state.commonReducer);
    const {student} = useSelector(state => state.studentReducer);
    const authUser = useSelector(state => state.authUserReducer);

    const [state, setState] = useState({
        data:  '',
        loading: false,
        authUser: props.authUserProp,
        isEdit: props.isEdit,
        registration_number:'',
        companyName:'',
        date_of_inception:'',
        company:null,
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

        }else{
            document.title = 'Add Organization';

            props.setActiveComponentProp('AddOrganization');
        }


    }, []);

    const getOrgById = () => {
        axios.get('/api/v1/student/getStudentOrganizationById', {
            params: {
                api_token: authUser.api_token,
                id:id,
                student_id:student?.id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCommonStateAttr('organization',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(()=>{
        if(organization){
            setState({
                ...state,
                data:organization,
                registration_number:organization?.organization?.registration_number,
                company:{value:organization?.organization?.id,label:organization?.organization?.name},
                ...organization,
                // supervisor: {value:student?.supervisor?.id,label:student?.supervisor?.name,item:student?.supervisor}
            })
        }
    },[organization])

    useEffect(()=>{
        if(student){
            getOrgById();
        }
    },[student])

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

            axios.post(props?.isEdit?'/api/v1/student/organizations/update':'/api/v1/student/organizations/create', $(e.target).serialize())
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
                    history.push('/student/organization/list')
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
                                        <input type="hidden" name="id" value={state.data?.id} />
                                        <input type="hidden" name="student_id" value={student?.id} />
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
                                                    <CreatableSelectInput
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
                                                        onCreate={(item)=>{
                                                            setState({
                                                                ...state,
                                                                company: {
                                                                    value: item.data.result.id,
                                                                    label: item.data.result.name,
                                                                }
                                                            });
                                                        }}
                                                        createUrl={'/api/v1/organizations/create'}
                                                        value={state.company}
                                                        isDisabled={props.isEdit}
                                                    />
                                                </div>
                                                <input type="hidden" className="form-control form-control-sm" id="organization_id" name="organization_id" placeholder="Name of the Company"
                                                value={state?.company?.value} />
                                            </div>
                                            {simpleValidator.current.message('companyName', state?.company?.label, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Registration number</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="registration_number" name="registration_number" placeholder="Registration Number"
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
                                                <input type="date" className="form-control form-control-sm" id="date_of_inception" name="date_of_inception" placeholder="Date of the inception of the training"
                                                value={state?.date_of_inception} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('date', state?.date_of_inception, 'required')}
                                        </div>

                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">{state?.isEdit? 'Update':'Add'} </button>
                                            <Link to='/student/organization/list' className="btn btn-inverse-secondary btn-md">Cancel</Link>
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
