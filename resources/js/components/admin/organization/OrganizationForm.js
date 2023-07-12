import React, {useEffect, useRef, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";
import {showSznNotification} from "../../../Helpers";
import SimpleReactValidator from "simple-react-validator";
import EditProfile from "../../student/EditProfile";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
import OrganizationCard from "../student/OrganizationCard";
import rootAction from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";


function OrganizationForm(props){
    let { id } = useParams();
    let history = useHistory();
    const myDispatch = useDispatch();
    const {organization,dropdowns} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)
    const [state, setState] = useState({
        data:  organization,
        loading: false,
        authUser: authUser,
        name: '',
        registration_number: '',

    });


    useEffect(()=>{
        if(props.isEdit){
            getOrganizationById();
        }

        return ()=>{
            // myDispatch(saveStudentStateAttr('student',{}));
        }
    },[])

    useEffect(() => {
        if(props.isEdit){
            document.title = 'Edit Organization';

            props.setActiveComponentProp('EditOrganization');
        }else{
            document.title = 'Add Organization';

            props.setActiveComponentProp('AddOrganization');
        }
    }, []);

    useEffect(()=>{
        if(organization){
            setState({
                ...state,
                data:organization,
                ...organization,
                // supervisor: {value:student?.supervisor?.id,label:student?.supervisor?.name,item:student?.supervisor}
            })
        }
    },[organization])



    const getOrganizationById = () => {
        axios.get('/api/v1/organizations/getById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCommonStateAttr('organization',response.data.message));
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

        if(props.isEdit){
            onUpdateOrganzation(e)

        }else{
            onCreateOrganization(e)
          //  console.log("edit working")
        }

    }


    const onUpdateOrganzation=(e)=>{
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/organizations/update', $(e.target).serialize())
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
                        history.push('/organization/list')
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

    const onCreateOrganization=(e)=>{
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/organizations/create', $(e.target).serialize())
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
                        history.push('/organization/list')
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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">{props?.isEdit? 'EDIT':'ADD'} ORGANIZATION</span>
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
                                            <label>Registration Number</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                          <i className="mdi mdi-phone"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="custom-range form-control form-control-sm" id="registration_number" name="registration_number" placeholder="Registration Number" value={state.registration_number} onChange={onChangeHandle}/>
                                            </div>
                                        </div>
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">{props?.isEdit? 'SAVE':'ADD'}</button>
                                            <Link to='/organization/list' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                        </div>
                                    </form>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        {/*    <div style={{marginTop:10}} className="card animated fadeIn">*/}
        {/*        <div className="card animated fadeIn">*/}
        {/*            <div className="card-body">*/}
        {/*                <div style={{marginLeft:'16%',marginRight:'16%'}}>*/}
        {/*                <OrganizationCard/>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationForm)


//export default OrganizationForm
