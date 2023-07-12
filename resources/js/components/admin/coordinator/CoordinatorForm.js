import React, { useState, useEffect, useRef } from 'react'
import {connect, useDispatch, useSelector} from 'react-redux';
import rootAction from '../../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import { Link, useHistory, useParams } from 'react-router-dom';
import coordinatorReducer from "../../../redux/reducers/coordinator";
import {saveCoordinatorStateAttr} from "../../../redux/actions/coordinatorAction";

function CoordinatorForm(props){
    let { id } = useParams();
    let history = useHistory();
    const authUser = useSelector(state => state.authUserReducer);
    const {coordinator,dropdowns} = useSelector(state => state.coordinatorReducer);
    const myDispatch = useDispatch();
    const [state, setState] = useState({
        data: '',
        loading: false,
        authUser: props.authUserProp,
        isEdit: props.isEdit,
        name:'',
        Designation:'',
        organization_id: '',
        contact_number_home:'',
        contact_number_office:'',
        email:'',
        Department:  '',
    });
    //const dropdowns = useSelector(state => state.internalSupervisorReducer.dropdowns);

    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
        autoForceUpdate: {forceUpdate: forceUpdate},
        className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    useEffect(()=>{
        loadDropdownData();
        if(props.isEdit){
            getCoordinatorById();
        }

        return ()=>{
            // myDispatch(saveInternalSupervisorStateAttr('supervisor',{}));
        }
    },[])

    useEffect(() => {
        if(props.isEdit){
            document.title = 'Edit Coordinator';

            props.setActiveComponentProp('EditCoordinator');
        }else{
            document.title = 'Add Coordinator';

            props.setActiveComponentProp('AddCoordinator');
        }
    }, []);

    useEffect(()=>{
        if(coordinator){
            setState({
                ...state,
                data:coordinator,
                ...coordinator
            })
        }
    },[coordinator])

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


    const getCoordinatorById = () => {
        axios.get('/api/v1/coordinator/getById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCoordinatorStateAttr('coordinator',response.data.message));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onChangeHandle = (e) =>{

        const { name, value } = e.target;
        console.log({name})
        console.log({value})
        setState({
            ...state,
            [name] : value
        });
    }

    const onSubmitHandle = (e) =>{
        e.preventDefault();

        if(props.isEdit){
            onUpdateCoordinator(e)
        }else{
            onCreateCoordinator(e)
        }
    }

    const onCreateCoordinator=(e)=>{
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/coordinator/create', $(e.target).serialize())
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
                        history.push('/coordinator/list')
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

    const onUpdateCoordinator=(e)=>{
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/coordinator/update', $(e.target).serialize())
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
                        history.push('/coordinator/list')
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
                                        <input type="hidden" name="id" value={state.data.id} />
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">{state?.isEdit? 'EDIT':'ADD'} COORDINATOR</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" id="title" name="title" value={state.title} onChange={onChangeHandle}>
                                                    <option value="Prof.">Professor</option>
                                                    <option value="Dr.">Doctor</option>
                                                    <option value="Dr.">Mr.</option>
                                                    <option value="Dr.">Mrs.</option>
                                                    <option value="Dr.">Ms.</option>
                                                    })}
                                                </select>
                                            </div>
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
                                            <label>Contact Number-Home</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-home"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="contact_number_home" name="contact_number_home" value={state.contact_number_home} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('contact_number_home', state.contact_number_home, 'required|phone')}
                                        </div>
                                        <div className="form-group">
                                            <label>Contact Number-Office</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                          <i className="mdi mdi-home"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="contact_number_office" name="contact_number_office" value={state.contact_number_office} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('contact_number_office', state.contact_number_office, 'required|phone')}
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                         <i className="mdi mdi-email"></i>
                                                    </span>
                                                </div>
                                                <input readOnly={!!props?.isEdit} type="text" className="form-control form-control-sm" id="email" name="email" placeholder="Email Address" value={state.email} onChange={onChangeHandle} />
                                                {simpleValidator.current.message('email', state.email, 'required|email')}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Designation</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" id="Designation" name="Designation" value={state.Designation} onChange={onChangeHandle}>
                                                    {dropdowns?.designation && dropdowns?.designation.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
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
                                                <select className="form-control form-control-sm" id="Department" name="Department" value={state.Department} onChange={onChangeHandle}>
                                                    {dropdowns?.department && dropdowns?.department.map((item)=>{
                                                        return  <option value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">{state?.isEdit? 'Update':'Add'}</button>
                                            <Link to='/coordinator/list' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                        </div>
                                    </form>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{marginTop:10}} className="card animated fadeIn">
                <div className="card animated fadeIn">
                    <div className="card-body">
                        <div style={{marginLeft:'16%',marginRight:'16%'}}>
                            {/*<OrganizationCard/>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </React.Fragment>)
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

export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorForm)

//export default InternalSupervisorForm
