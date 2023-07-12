import React, {useEffect, useRef, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
import {showSznNotification} from '../../Helpers';
import SelectInput from "../shared/formInput/Select";
import setActiveComponent from "../../redux/actions/setActiveComponent";
import {saveCommonStateAttr} from "../../redux/actions/commonAction";
import rootAction from "../../redux/actions";
import connect from "react-redux/es/connect/connect";

function EditProfile(props){
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {user,dropdowns} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)
    const [state, setState] = useState({
        data:  user,
        loading: false,
        authUser: authUser,
        name: '',
        email: '',
        role_id:''

    });

    let history = useHistory();


    useEffect(()=>{
        if(props.isEdit){
            loadDropdownData();
            getUserById();
        }


    },[])

    const loadDropdownData = () => {
        axios.get('/api/v1/admin/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('dropdowns',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        document.title = 'Edit Profile';

        props.setActiveComponentProp('EditProfile');
    }, []);

    useEffect(()=>{
        if(user){
            setState({
                ...state,
                data:user,
                ...user,
                role_id: user?.user_role?.role_id
            })
        }
    },[user])




    const getUserById = () => {
        axios.get('/api/v1/user/getById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('user',response.data.result));
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

            axios.post('/api/v1/user/update', $(e.target).serialize())
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
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">Edit Profile</span>
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
                                            <label>Email</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                         <i className="mdi mdi-email"></i>
                                                    </span>
                                                </div>
                                                <input readOnly={true} type="text" className="form-control form-control-sm" id="email" name="email" placeholder="Email" value={state.email} onChange={onChangeHandle} />
                                                {simpleValidator.current.message('email', state.email, 'required|email')}
                                            </div>
                                        </div>
                                        {/*<div className="form-group">*/}
                                            {/*<label>roles</label>*/}
                                            {/*<div className="input-group input-group-sm">*/}
                                                {/*<div className="input-group-prepend">*/}
                                                    {/*<span className="input-group-text bg-gradient-success text-white">*/}
                                                        {/*<i className="mdi mdi-account"></i>*/}
                                                    {/*</span>*/}
                                                {/*</div>*/}
                                                {/*<select className="form-control form-control-sm" id="role_id" name="role_id" value={state.role_id} onChange={onChangeHandle}>*/}
                                                    {/*{dropdowns?.roles && dropdowns?.roles.map((item)=>{*/}
                                                        {/*return  <option value={item.id}>{item.name}</option>*/}
                                                    {/*})}*/}
                                                {/*</select>*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
