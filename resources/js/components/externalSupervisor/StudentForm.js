import React, {useEffect, useRef, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {saveStudentStateAttr} from "../../redux/actions/studentAction";
import {useDispatch, useSelector} from "react-redux";
import {showSznNotification} from "../../Helpers";
import SimpleReactValidator from "simple-react-validator";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
import setActiveComponent from "../../redux/actions/setActiveComponent";


function StudentForm(props){
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {student} = useSelector(state => state.studentReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const {externalSupervisor,dropdowns} = useSelector(state => state.externalSupervisorReducer);
    const [isLoading,setIsLoading]=useState(false)
    const [state, setState] = useState({
        data:  student,
        loading: false,
        authUser: authUser,
        registration_number: '',
        name_with_initials: '',
        full_name: '',
        address: '',
        city:  '',
        contact_number_home: '',
        contact_number_mobile: '',
        email:  '',
        department:  '',
        cluster:  '',
        // training_start_date: '',
        // training_end_date: '',
        supervisor:null
    });

    let history = useHistory();


    useEffect(()=>{
        if(props.isEdit){
            getStudentById();
        }

        return ()=>{
            // myDispatch(saveStudentStateAttr('student',{}));
        }
    },[])

    useEffect(()=>{
        document.title = 'Edit Student';
        myDispatch(setActiveComponent('EditStudent'));
    },[])

    useEffect(()=>{
        if(student){
            setState({
                ...state,
                data:student,
                ...student,
                supervisor: {value:student?.supervisor?.id,label:student?.supervisor?.name,item:student?.supervisor}
            })
        }
    },[student])


    const getStudentById = () => {
        axios.get('/api/v1/student/getById', {
            params: {
                api_token: authUser.api_token,
                id:id
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

            axios.post('/api/v1/student/updateTrainingDate', $(e.target).serialize())
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
                        history.push('/student/list')
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


    return (  <React.Fragment>
        <div style={{width:'100%'}}>
            <div className="card animated fadeIn">
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
                                        {/*<input type="hidden" name="user_id" value={state.authUser?.id} />*/}
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">Edit Student</span>
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
                                                <input disabled={true} type="text" className="form-control form-control-sm" id="registration_number" name="registration_number" placeholder="Registration Number"
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
                                                <input disabled={true}  type="text" className="form-control form-control-sm" id="name_with_initials" name="name_with_initials" placeholder="Name with initials" value={state.name_with_initials} onChange={onChangeHandle}/>
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
                                                <input disabled={true}  type="text" className="form-control form-control-sm" id="full_name" name="full_name" placeholder="nameInFull" value={state.full_name} onChange={onChangeHandle}/>
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
                                                <input  disabled={true}  type="text" className="form-control form-control-sm" id="address" name="address" placeholder="Address" value={state.address} onChange={onChangeHandle}/>
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
                                                <input disabled={true}  type="text"  className="form-control form-control-sm" id="city" name="city" placeholder="City" value={state.city} onChange={onChangeHandle}/>
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
                                                <input disabled={true}  type="text" className="custom-range form-control form-control-sm" id="contact_number_home" name="contact_number_home" value={state.contact_number_home} onChange={onChangeHandle}/>
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
                                                <input disabled={true}  type="text" className="custom-range form-control form-control-sm" id="contact_number_mobile" name="contact_number_mobile" value={state.contact_number_mobile} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('contact_number_mobile', state.contact_number_mobile, 'required|phone')}
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                         <i className="mdi mdi-email"></i>
                                                    </span>
                                                </div>
                                                <input disabled={true}  type="text" className="form-control form-control-sm" id="email" name="email" placeholder="Email" value={state.email} onChange={onChangeHandle} />
                                                {simpleValidator.current.message('email', state.email, 'required|email')}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Department</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select disabled={true}  className="form-control form-control-sm" id="department" name="department" value={state.department} onChange={onChangeHandle}>
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
                                                <select disabled={true}  className="form-control form-control-sm" id="cluster" name="cluster" value={state.cluster} onChange={onChangeHandle}>
                                                    {dropdowns?.cluster && dropdowns?.cluster.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        {/*<div className="form-group">*/}
                                        {/*    <label>Start Date of the training</label>*/}
                                        {/*    <div className="input-group input-group-sm">*/}
                                        {/*        <div className="input-group-prepend">*/}
                                        {/*            <span className="input-group-text bg-gradient-success text-white">*/}
                                        {/*                <i className="mdi mdi-calendar"></i>*/}
                                        {/*            </span>*/}
                                        {/*        </div>*/}
                                        {/*        <input type="date" className="form-control form-control-sm" id="training_start_date" name="training_start_date" placeholder="Start Date of the training"*/}
                                        {/*               value={state?.training_start_date} onChange={onChangeHandle}/>*/}
                                        {/*    </div>*/}
                                        {/*    {simpleValidator.current.message('training_start_date', state?.training_start_date, 'required')}*/}
                                        {/*</div>*/}

                                        {/*<div className="form-group">*/}
                                        {/*    <label>End Date of the training</label>*/}
                                        {/*    <div className="input-group input-group-sm">*/}
                                        {/*        <div className="input-group-prepend">*/}
                                        {/*            <span className="input-group-text bg-gradient-success text-white">*/}
                                        {/*                <i className="mdi mdi-calendar"></i>*/}
                                        {/*            </span>*/}
                                        {/*        </div>*/}
                                        {/*        <input type="date" className="form-control form-control-sm" id="training_end_date" name="training_end_date" placeholder="End Date of the training"*/}
                                        {/*               value={state?.training_end_date} onChange={onChangeHandle}/>*/}
                                        {/*    </div>*/}
                                        {/*    {simpleValidator.current.message('training_end_date', state?.training_end_date, 'required')}*/}
                                        {/*</div>*/}

                                        <div className="form-group text-center">
                                            {/*<button type="submit" className="btn btn-gradient-primary btn-md mr-2">{props.isEdit?'Update':'Add'}</button>*/}
                                            <Link to='/student/list' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                        </div>
                                    </form>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </React.Fragment>)
}

export default StudentForm
